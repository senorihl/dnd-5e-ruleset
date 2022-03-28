import fs from "fs";
import path from "path";
// import _ from "lodash";
import { SourceList, RaceList, RaceSubList } from "dnd-5th-ruleset";
import type { Race, SourceLocation, Source } from "dnd-5th-ruleset";
import { toSourceString } from "./utils";
import slugify from "slugify";

const buildRace = (
  race: Race & {
    parent?: string;
    parentSlug?: string;
    parentTrait?: { [name: string]: string };
    slug: string;
  },
  index: number | null = null,
  emit: boolean = true,
  level: number = 1
) => {
  let content = "";
  const fpath = ["races"];
  race.parentSlug && fpath.push(race.parentSlug);
  fpath.push(race.slug);

  if (emit) {
    content += `---
layout: page
title: ${race.name}
parent: ${race.parent || "All races"}
${!race.parent ? "" : "grand_parent: All races"}
description: D&D 5th edition ${race.name} details
${(index && `nav_order: ${index + 1}`) || ""}
permalink: /${fpath.join("/")}/
---
`;
  }

  const parts = [`\n# ${race.name}\n`];

  if (race.source) {
    const sourceString = toSourceString(race.source);
    sourceString && parts.push(sourceString);
  }

  if (race.age || race.height || race.weight || race.scores) {
    parts.push("\n## General information\n");
  }

  if (race.scorestxt) {
    parts.push(`- **Scores:** ${race.scorestxt}`);
  } else {
    parts.push(
      `- **Scores:** ${race.scores
        .map((current, index) => {
          if (current > 0) {
            switch (index) {
              case 0:
                return `+${current} Strength`;
              case 1:
                return `+${current} Dexterity`;
              case 2:
                return `+${current} Constitution`;
              case 3:
                return `+${current} Intelligence`;
              case 4:
                return `+${current} Wisdom`;
              case 5:
                return `+${current} Charisma`;
            }
          }

          return null;
        })
        .filter((e) => !!e)
        .join(", ")}`
    );
  }

  if (race.age) {
    parts.push(`- **Age:** ${race.plural}${race.age}.`);
  }

  if (race.height) {
    parts.push(`- **Height:** ${race.plural}${race.height}.`);
  }

  if (race.weight) {
    parts.push(`- **Weight:** ${race.plural}${race.weight}.`);
  }

  let traits = race.trait
    .split(/\n|\t|\s{2,}/)
    .map((l) => l.trim())
    .filter((l) => !!l);
  const firstLine = traits.shift() as string;

  const hasHeader = /^[^\(]+\([^\)]+\)/.exec(firstLine);

  if (hasHeader) {
    traits.unshift(firstLine.replace(hasHeader[0], ""));
    traits = traits.map((l) => l.trim()).filter((l) => !!l);
  }

  const traitsObj: { [name: string]: string } = race.parentTrait || {};

  let prev: string | null = null;
  traits.forEach((line) => {
    const named = /^([^\:]+)\:\s+(.*)$/.exec(line);
    if (named) {
      prev = named[1];
      traitsObj[prev] = named[2];
    } else if (prev) {
      traitsObj[prev] += " " + line;
    }
  });

  if (Object.keys(traitsObj).length > 0) {
    parts.push("\n## Traits\n");

    parts.push(
      ...Object.keys(traitsObj).map((name) => {
        return `- **${name.replace(/[^\w]*(.*)/, "$1")}**: ${traitsObj[name]}`;
      })
    );
  }

  if (
    race.languageProfs ||
    race.toolProfs ||
    race.weaponProfs ||
    race.armorProfs
  ) {
    parts.push("\n## Proficiencies\n");

    if (race.languageProfs) {
      parts.push(
        "- **Languages:** " +
          race.languageProfs
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

    if (race.toolProfs) {
      parts.push(
        "- **Tools:** " +
          race.toolProfs
            .map((prof) => {
              return typeof prof === "string" ? prof : prof[0];
            })
            .filter((tool) => !!tool)
            .join(", ")
      );
    }

    if (race.weaponProfs) {
      const [simple, martial, other] = race.weaponProfs;

      parts.push(
        "- **Weapons:** " +
          [simple ? "simple" : null, martial ? "martial" : null, ...other]
            .filter((tool) => !!tool)
            .join(", ")
      );
    }

    if (race.armorProfs) {
      const [light, medium, heavy, shields] = race.armorProfs;
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

  content += parts.join("\n");

  if (emit) {
    const dirname = path.resolve(
      __dirname.replace("dist/", ""),
      "..",
      "docs",
      "_races"
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

  if (race.variants && race.variants.length > 0) {
    race.variants.forEach((variantName) => {
      const variant =
        RaceSubList[`${race.name.toLowerCase()}-${variantName.toLowerCase()}`];
      if (variant) {
        variant.name = variant.name || `${race.name} variant`;

        buildRace({
          ...race,
          ...variant,
          parentSlug: race.slug,
          slug: slugify(variantName, { remove: /[^\w]/g }),
          features: { ...race.features, ...variant.features },
          variants: [],
          parent: race.name,
          parentTrait: traitsObj,
        });
      } else {
        console.error("missing variant", variantName);
      }
    });
  }

  return content;
};

export default function build() {
  console.group("Races");

  const slugs = Object.keys(RaceList);

  const content = `---
layout: page
title: All races
description: D&D 5th edition all races
permalink: /races/
has_children: true
---

# All races

${slugs
  .map((slug) => {
    const race = RaceList[slug];
    return `- [${race.name}]({{ '/races/${slugify(slug, {
      remove: /[^\w]/g,
    })}/' | relative_url }})`;
  })
  .join("\n")}
`;

  const dirname = path.resolve(
    __dirname.replace("dist/", ""),
    "..",
    "docs",
    "_races"
  );

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  const filename = path.resolve(dirname, `index.md`);
  fs.writeFileSync(filename, content);

  slugs
    .sort((slugA, slugB) => {
      const raceA = RaceList[slugA];
      const raceB = RaceList[slugB];
      return (raceA.sortname || raceA.name).toLowerCase() >
        (raceB.sortname || raceB.name).toLowerCase()
        ? 1
        : 0;
    })
    .forEach((slug, idx) => {
      const race = RaceList[slug];
      buildRace({ ...race, slug: slugify(slug, { remove: /[^\w]/g }) }, idx);
    });

  console.groupEnd();
}
