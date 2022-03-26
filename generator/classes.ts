import fs from "fs";
import path from "path";
import { ClassList, SourceList } from "dnd-5th-ruleset";
import type {
  CClass,
  SourceLocation,
  Source,
  ClassFeature,
  ChoiceClassFeature,
  ClassChoice,
} from "dnd-5th-ruleset";

const filename = path.resolve(
  __dirname.replace("dist/", ""),
  "..",
  "docs",
  "_docs",
  `classes # index.md`
);

function featIsChoice(obj: ClassFeature): obj is ChoiceClassFeature {
  return !!(obj as any).choices;
}

console.group("Classes");

const content = `---
layout: page
title: Classes
description: D&D 5th edition class list
has_children: true
---
# Classes
`;

fs.writeFileSync(filename, content);

const buildClass = (
  cclass: CClass & { parent?: string },
  emit: boolean = true,
  level: number = 1
) => {
  emit && console.group(cclass.name);
  let content = "";

  if (emit) {
    content += `---
layout: page
title: ${cclass.name}
parent: Classes
description: D&D 5th edition ${cclass.name} details
---
`;
  }

  const parts = [`\n# ${cclass.name}\n`];

  if (cclass.source) {
    if (Array.isArray(cclass.source[0])) {
      parts.push(
        `<small>From ${cclass.source
          .map((e) => {
            return [
              SourceList[(e as SourceLocation)[0]],
              (e as SourceLocation)[1],
            ] as [Source, number];
          })
          .filter(([source]) => !!source)
          .map(([source, page]) => {
            if (source.url) {
              return `<a target="_blank" href="${source.url}">${source.name}</a> (p. ${page})`;
            }
            return `${source.name} (p. ${page})`;
          })
          .join(", ")}</small>\n`
      );
    } else {
      const source = SourceList[(cclass.source as SourceLocation)[0]];
      const page = cclass.source[1];
      if (source.url) {
        parts.push(
          `<small>From <a target="_blank" href="${source.url}">${source.name}</a> (p. ${page})</small>`
        );
      } else {
        parts.push(`<small>From ${source.name} (p. ${page})</small>`);
      }
    }
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

  Object.values(cclass.features)
    .sort((a, b) => (a.minlevel < b.minlevel ? 1 : 0))
    .forEach((feat: ClassFeature) => {
      parts.indexOf("\n## Features\n") === -1 && parts.push("\n## Features\n");

      parts.push(
        `### ${feat.name} <small>(at level ${feat.minlevel})</small>\n`
      );
      let prevIsList = false;
      parts.push(
        ...feat.description
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

      if (featIsChoice(feat)) {
        parts.push("#### Choices");
        parts.push(
          ...feat.choices
            .map((name) => {
              const key = name.toLowerCase().replace(/\s*\[\d+\]$/, "");

              if (!feat[key]) {
                console.warn(
                  "choice not found",
                  JSON.stringify(key),
                  "in",
                  Object.keys(feat)
                );
                return "";
              }

              const hasNb = /\s*\[(\d+)\]$/.exec(name.toLowerCase());
              const nb = hasNb ? Number.parseInt(hasNb[1]) : 1;

              if (nb > 1) return "";

              const choice = feat[key] as ClassChoice;
              return "- **" + choice.name + "**: " + choice.description;
            })
            .filter((str) => !!str),
          "\n\n"
        );
      }

      parts.push("\n\n");
    });

  content += parts.join("\n");

  if (emit) {
    const filename = path.resolve(
      __dirname.replace("dist/", ""),
      "..",
      "docs",
      "_docs",
      `classes # ${cclass.name.toLowerCase()}.md`
    );
    fs.writeFileSync(filename, content);
  } else {
    content = content.replace(/^(#+ .*)$/gm, `${"#".repeat(level)}$1`);
    content = content.replace(/^(.*)$/gm, "> $1");
  }

  emit && console.groupEnd();

  return content;
};

Object.values(ClassList).forEach((race) => buildClass(race));

console.groupEnd();
