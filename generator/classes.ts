import fs from "fs";
import path from "path";
import slugify from "slugify";
import { ClassList, ClassSubList } from "dnd-5th-ruleset";
import type {
  Class,
  ClassFeature,
  ChoiceClassFeature,
  ClassChoice,
} from "dnd-5th-ruleset";
import { toSourceString } from "./utils";

function featIsChoice(obj: ClassFeature): obj is ChoiceClassFeature {
  return !!(obj as any).choices;
}

const buildClass = (
  cclass: Class & { parent?: string; parentSlug?: string; slug: string },
  emit: boolean = true,
  level: number = 1
) => {
  let content = "";

  const fpath = ["classes"];
  cclass.parentSlug && fpath.push(cclass.parentSlug);
  fpath.push(cclass.slug);

  if (emit) {
    content += `---
layout: page
title: ${cclass.name}
parent: ${cclass.parent || "Classes"}
${!!cclass.parent ? "grand_parent: Classes" : ""}
${cclass.subclasses && cclass.subclasses.length > 0 ? "has_children: true" : ""}
${
  cclass.subclasses && cclass.subclasses.length > 0
    ? `toc_name: ${cclass.subclasses[0]}`
    : ""
}
description: D&D 5th edition ${cclass.name} details
permalink: /${fpath.join("/")}/
---
`;
  }

  const parts = [`\n# ${cclass.name}\n`];

  if (cclass.source) {
    const sourceString = toSourceString(cclass.source);
    sourceString && parts.push(sourceString);
  }

  parts.push("- **Prerequisites**: " + cclass.prereqs);
  parts.push("- **Hit dice**: d" + cclass.die);

  if (cclass.toolProfs || cclass.weaponProfs || cclass.armorProfs) {
    parts.push("\n## Proficiencies\n");

    if (cclass.toolProfs?.primary) {
      parts.push(
        "- **Tools:** " +
          cclass.toolProfs.primary
            .map((prof) => {
              return typeof prof === "string" ? prof : prof[0];
            })
            .filter((tool) => !!tool)
            .join(", ")
      );
    }

    if (cclass.weaponProfs?.primary) {
      const [simple, martial, other = []] = cclass.weaponProfs.primary;

      parts.push(
        "- **Weapons:** " +
          [simple ? "simple" : null, martial ? "martial" : null, ...other]
            .filter((tool) => !!tool)
            .join(", ")
      );
    }

    if (
      cclass.armorProfs?.primary &&
      cclass.armorProfs?.primary.some((e) => e)
    ) {
      const [light, medium, heavy, shields] = cclass.armorProfs.primary;
      parts.push(
        "- **Armors:** " +
          [
            light ? "light" : null,
            medium ? "medium" : null,
            heavy ? "heavy" : null,
            shields ? "shields" : null,
          ]
            .filter((tool) => !!tool)
            .join(", ")
      );
    }
  }

  if (cclass.equipment) {
    parts.push("\n## Equipment\n");

    parts.push(
      ...cclass.equipment.split(/\n+/gm).map((str) => {
        str = str.trim();
        if (/^\w/.test(str)) {
          return "\n" + str + "\n";
        } else {
          return "- " + str.replace(/^([^\w]+)/, "");
        }
      })
    );
  }

  Object.values(cclass.features || {})
    .sort((a, b) => (a.minlevel < b.minlevel ? 1 : 0))
    .forEach((feat: ClassFeature) => {
      parts.indexOf("\n## Features\n") === -1 && parts.push("\n## Features\n");

      parts.push(
        `### ${feat.name} <small>(at level ${feat.minlevel})</small>\n`
      );
      if (typeof feat.description === "string") {
        let prevIsList = false;
        parts.push(
          ...(feat.description as string)
            .split(/\n+/gm)
            .map((str) => {
              str = str.trim();
              if (!str) return "";
              if (/^(\w|\[)/.test(str)) {
                prevIsList = false;
                return (prevIsList ? "\n\n" : "\n") + str;
              } else {
                prevIsList = true;
                return "- " + str.replace(/^([^\w]+)/, "");
              }
            })
            .filter((line) => !!line)
        );
      } else if (Array.isArray(feat.description)) {
        parts.push(`\n| Level | Description |`);
        parts.push(`|:----------------------------|:------------------|`);
        parts.push(
          ...feat.description.map((description, index) => {
            let prevIsList = false;
            return `| ${index + 1} | ${description
              .split(/\n+/gm)
              .map((str) => {
                str = str.trim();
                if (!str) return "";
                if (/^(\w|\[)/.test(str)) {
                  prevIsList = false;
                  return (prevIsList ? "<br>" : "") + str;
                } else {
                  prevIsList = true;
                  return "- " + str.replace(/^([^\w]+)/, "");
                }
              })
              .filter((line) => !!line)
              .join("<br>")} |`;
          })
        );
      }

      if (featIsChoice(feat)) {
        parts.push("#### Choices");
        parts.push(
          ...feat.choices
            .map((name) => {
              const key = !!cclass.parent
                ? name.toLowerCase()
                : name.toLowerCase().replace(/\s*\[\d+\]$/, "");

              if (feat[key]) {
                const hasNb = /\s*\[(\d+)\]$/.exec(name.toLowerCase());
                const nb = hasNb ? Number.parseInt(hasNb[1]) : 1;

                if (nb > 1) return "";

                const choice = feat[key] as ClassChoice;
                return "- **" + choice.name + "**: " + choice.description;
              } else if (
                Object.keys(feat).some((key) =>
                  key.startsWith(name.toLowerCase())
                )
              ) {
                const choices = Object.keys(feat).filter((key) =>
                  key.startsWith(name.toLowerCase())
                );

                if (choices.length === 0) return "";

                const choice = feat[choices[0]] as ClassChoice;
                return "- **" + choice.name + "**: " + choice.description;
              }

              console.warn(
                "choice not found",
                JSON.stringify(key),
                `(${name.toLowerCase()})`,
                "in",
                Object.keys(feat)
              );

              return "";
            })
            .filter((str) => !!str),
          "\n\n"
        );
      }

      parts.push("\n\n");
    });

  if (cclass.subclasses && cclass.subclasses.length > 0) {
    const [label, variants] = cclass.subclasses;

    variants.forEach((variantName) => {
      const variant = ClassSubList[variantName];
      if (variant) {
        variant.name = variant.subname || `${cclass.name} variant`;

        buildClass({
          ...cclass,
          ...variant,
          parentSlug: cclass.slug,
          slug: slugify(variantName),
          subclasses: undefined,
          parent: cclass.name,
        });
      }
    });
  }

  content += parts.join("\n");

  if (emit) {
    const filename = path.resolve(
      __dirname.replace("dist/", ""),
      "..",
      "docs",
      "_docs",
      `${fpath.join(" # ")}.md`
    );
    fs.writeFileSync(filename, content);
  } else {
    content = content.replace(/^(#+ .*)$/gm, `${"#".repeat(level)}$1`);
    content = content.replace(/^(.*)$/gm, "> $1");
  }

  return content;
};

export default function build() {
  console.group("Classes");

  const filename = path.resolve(
    __dirname.replace("dist/", ""),
    "..",
    "docs",
    "_docs",
    `classes # index.md`
  );

  const content = `---
layout: page
title: Classes
description: D&D 5th edition class list
has_children: true
nav_order: 2
permalink: /classes/
---
# Classes
`;

  fs.writeFileSync(filename, content);

  const slugs = Object.keys(ClassList);
  slugs.forEach((slug, idx) => {
    const race = ClassList[slug];
    buildClass({ ...race, slug: slugify(slug) });
  });

  console.groupEnd();
}
