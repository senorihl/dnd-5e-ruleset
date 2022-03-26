import fs from "fs";
import path from "path";
// import _ from "lodash";
import { SourceList, RaceList, RaceSubList } from "dnd-5th-ruleset";
import type { Race, SourceLocation, Source } from "dnd-5th-ruleset";

const filename = path.resolve(
  __dirname.replace("dist/", ""),
  "..",
  "docs",
  "_docs",
  `races # index.md`
);

console.group("Races");

const content = `---
layout: page
title: Races
description: D&D 5th edition race list
has_children: true
---
# Races
`;

fs.writeFileSync(filename, content);

const buildRace = (
  race: Race & { parent?: string },
  emit: boolean = true,
  level: number = 1
) => {
  emit && console.group(race.name);
  let content = "";

  if (emit) {
    content += `---
layout: page
title: ${race.name}
parent: ${race.parent || "Races"}
${!!race.parent ? "grand_parent: Races" : ""}
${race.variants && race.variants.length > 0 ? "has_children: true" : ""}
description: D&D 5th edition ${race.name} details
---
`;
  }

  const parts = [`\n# ${race.name}\n`];

  if (race.source) {
    if (Array.isArray(race.source[0])) {
      parts.push(
        `<small>From ${race.source
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
      const source = SourceList[(race.source as SourceLocation)[0]];
      const page = race.source[1];
      if (source.url) {
        parts.push(
          `<small>From <a target="_blank" href="${source.url}">${source.name}</a> (p. ${page})</small>`
        );
      } else {
        parts.push(`<small>From ${source.name} (p. ${page})</small>`);
      }
    }
  }

  if (race.scores)
    parts.push(
      `**Scores:** ${race.scores
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

  if (race.age || race.height || race.weight) {
    parts.push("\n## General information\n");
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

  parts.push("\n## Traits\n");

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

  const traitsObj: { [name: string]: string } = {};

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

  parts.push(
    ...Object.keys(traitsObj).map((name) => {
      return `- **${name.replace(/[^\w]*(.*)/, "$1")}**: ${traitsObj[name]}`;
    })
  );

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

  if (race.variants && race.variants.length > 0) {
    parts.push(`\n## Variants\n`);

    parts.push(
      ...race.variants.map((variantName) => {
        const variant =
          RaceSubList[
            `${race.name.toLowerCase()}-${variantName.toLowerCase()}`
          ];
        if (variant) {
          variant.name = variant.name || `${race.name} variant`;

          buildRace({
            ...race,
            ...variant,
            features: { ...race.features, ...variant.features },
            variants: [],
            parent: race.name,
          });

          return buildRace(variant, false, 2).replace(
            new RegExp(`(#*) ${variant.name}`, "i"),
            `$1 [${
              variant.name
            }]({{ '/races/' | relative_url }}{{ '${variant.name.replace(
              "'",
              "’"
            )}' | slugify }}/)`
          );
        } else {
          console.error("missing variant", variantName);
        }

        return "";
      })
    );
  }

  content += parts.join("\n");

  if (emit) {
    const filename = path.resolve(
      __dirname.replace("dist/", ""),
      "..",
      "docs",
      "_docs",
      `races # ${race.name.toLowerCase()}.md`
    );
    fs.writeFileSync(filename, content);
  } else {
    content = content.replace(/^(#+ .*)$/gm, `${"#".repeat(level)}$1`);
    content = content.replace(/^(.*)$/gm, "> $1");
  }

  emit && console.groupEnd();

  return content;
};

Object.values(RaceList).forEach((race) => buildRace(race));

console.groupEnd();
