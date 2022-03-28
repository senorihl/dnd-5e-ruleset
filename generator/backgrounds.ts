import fs from "fs";
import path from "path";
import {
  BackgroundList,
  BackgroundFeatureList,
  BackgroundSubList,
} from "dnd-5th-ruleset";
import type {
  Background,
  FixedSkillsBackground,
  VaryingSkillsBackground,
} from "dnd-5th-ruleset";
import { toSourceString } from "./utils";
import slugify from "slugify";

function hasFixedSkills(obj: Background): obj is FixedSkillsBackground {
  return !!(obj as any).skills;
}

function hasVaryingSkills(obj: Background): obj is VaryingSkillsBackground {
  return !!(obj as any).skillstxt;
}

const buildBackground = (
  background: Background & {
    parent?: string;
    parentSlug?: string;
    slug: string;
  },
  emit: boolean = true,
  level: number = 1
) => {
  let content = "";

  const fpath = ["backgrounds"];
  background.parentSlug && fpath.push(background.parentSlug);
  fpath.push(background.slug);

  if (emit) {
    content += `---
layout: page
title: ${background.name}
parent: ${background.parent || "All backgrounds"}
${!background.parent ? "" : "grand_parent: All backgrounds"}
description: D&D 5th edition ${background.name} details
permalink: /${fpath.join("/")}/
---`;
  }

  const parts = [`\n# ${background.name}\n`];

  if (background.source) {
    const sourceString = toSourceString(background.source);
    sourceString && parts.push(sourceString);
  }

  parts.push("\n## Proficiencies & equipment\n");

  if (background.toolProfs) {
    parts.push(
      "- **Tools:** " +
        background.toolProfs
          .map((prof) => {
            return typeof prof === "string" ? prof : prof[0];
          })
          .filter((tool) => !!tool)
          .join(", ")
    );
  }

  if (background.languageProfs) {
    parts.push(
      "- **Languages:** " +
        background.languageProfs
          .map((prof) => {
            return typeof prof === "string"
              ? prof
              : prof > 0
              ? `${prof} of your choice`
              : "";
          })
          .filter((lang) => !!lang)
          .join(", ")
    );
  }

  if (hasFixedSkills(background)) {
    parts.push("- **Skills:** " + background.skills.join(", "));
  } else if (hasVaryingSkills(background)) {
    parts.push("- **Skills:** " + background.skillstxt);
  }

  const equipment = [
    ...(background.equipleft || []),
    ...(background.equipright || []),
  ];
  if (equipment.length > 0) {
    parts.push("- **Equipment:** ");
    equipment.forEach((equipment) => {
      parts.push("  - " + equipment[0]);
    });
  }

  if (
    background.feature &&
    BackgroundFeatureList[background.feature.toLowerCase()]
  ) {
    parts.push(`\n## Feature: ${background.feature}\n\n`);

    const feature = BackgroundFeatureList[background.feature.toLowerCase()];

    parts.push(feature.description);
  }

  if (
    background.trait ||
    background.ideal ||
    background.bond ||
    background.flaw
  ) {
    parts.push(`\n## Suggested Characteristics\n`);

    if (background.trait) {
      parts.push(`\n| d${background.trait.length} | Personality Trait |`);
      parts.push(`|:----------------------------|:------------------|`);
      parts.push(
        ...background.trait.map((trait, index) => `| ${index + 1} | ${trait} |`)
      );
    }

    if (background.ideal) {
      parts.push(`\n| d${background.ideal.length} | Ideal |`);
      parts.push(`|:----------------------------|:------|`);
      parts.push(
        ...background.ideal.map(
          ([ideal, trait], index) =>
            `| ${index + 1} | ${trait.replace(ideal, `**${ideal}**`)} |`
        )
      );
    }

    if (background.bond) {
      parts.push(`\n| d${background.bond.length} | Bond |`);
      parts.push(`|:----------------------------|:------------------|`);
      parts.push(
        ...background.bond.map((trait, index) => `| ${index + 1} | ${trait} |`)
      );
    }

    if (background.flaw) {
      parts.push(`\n| d${background.flaw.length} | Flaw |`);
      parts.push(`|:----------------------------|:------------------|`);
      parts.push(
        ...background.flaw.map((trait, index) => `| ${index + 1} | ${trait} |`)
      );
    }
  }

  if (background.extra) {
    parts.push(`\n## Extra: ${background.extra[0]}\n`);
    parts.push(
      ...background.extra.map((extra, idx) => {
        if (idx === 0) return "";
        return `- ${extra}`;
      })
    );
  }

  if (background.variant && background.variant.length > 0) {
    background.variant.forEach((variantName) => {
      const variant = BackgroundSubList[variantName.toLowerCase()];
      if (variant) {
        variant.name = variant.name || `${background.name} variant`;

        parts.indexOf("\n\n## Variants") === -1 &&
          parts.push("\n\n## Variants");
        parts.push("");
        parts.push("<hr>");
        parts.push("");
        parts.push(
          buildBackground(
            {
              ...background,
              ...variant,
              parentSlug: background.slug,
              slug: slugify(variantName, { remove: /[^\w]/g }),
              variant: [],
              parent: background.name,
            },
            false,
            level + 1
          )
        );
      } else {
        console.error("missing variant", variantName);
      }
    });
  }

  content += parts.join("\n");

  if (emit) {
    const dirname = path.resolve(
      __dirname.replace("dist/", ""),
      "..",
      "docs",
      "_backgrounds"
    );
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    const filename = path.resolve(dirname, `${fpath.slice(1).join(" # ")}.md`);
    fs.writeFileSync(filename, content);
  } else {
    content = content.replace(/^(#+ .*)$/gm, `${"#".repeat(level)}$1`);
    content = content.replace(/^(.*)$/gm, "> $1");
  }

  return content;
};

export default function build() {
  console.group("Backgrounds");

  const slugs = Object.keys(BackgroundList);

  const content = `---
layout: page
title: All backgrounds
description: D&D 5th edition all backgrounds
permalink: /backgrounds/
has_children: true
---

# All backgrounds

${slugs
  .map((slug) => {
    const race = BackgroundList[slug];
    return `- [${race.name}]({{ '/backgrounds/${slugify(slug, {
      remove: /[^\w]/g,
    })}/' | relative_url }})`;
  })
  .join("\n")}
`;

  const dirname = path.resolve(
    __dirname.replace("dist/", ""),
    "..",
    "docs",
    "_backgrounds"
  );
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  const filename = path.resolve(dirname, `index.md`);
  fs.writeFileSync(filename, content);

  slugs.forEach((slug, idx) => {
    const race = BackgroundList[slug];
    buildBackground({ ...race, slug: slugify(slug, { remove: /[^\w]/g }) });
  });

  console.groupEnd();
}
