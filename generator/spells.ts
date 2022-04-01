import fs from "fs";
import path from "path";
import { SpellsList, ClassList } from "dnd-5th-ruleset";
import type { Spell } from "dnd-5th-ruleset";
import { toSourceString } from "./utils";
import slugify from "slugify";

const slugs = Object.keys(SpellsList);

const schoolsNames: { [key: string]: string } = {
  Abjur: "abjuration",
  Conj: "conjuration",
  Div: "divination",
  Ench: "enchantment",
  Evoc: "evocation",
  Illus: "illusion",
  Necro: "necromancy",
  Trans: "transmutation",
  Avatar: "avatar (psionic order)",
  Awake: "awakened (psionic order)",
  Immor: "immortal (psionic order)",
  Nomad: "nomad (psionic order)",
  "Wu Jen": "wu jen (psionic order)",
};

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const schools = slugs
  .map((slug, idx) => SpellsList[slug].school)
  .filter((school, idx, self) => self.indexOf(school) === idx);

function buildSpell(
  spell: Spell & { slug: string },
  emit: boolean = true,
  level: number = 1
) {
  let content = "";

  const levelStr = `${spell.level > 0 ? spell.level : ""}${
    spell.level > 3
      ? "th"
      : spell.level === 3
      ? "rd"
      : spell.level === 2
      ? "nd"
      : spell.level === 1
      ? "st"
      : "cantrip"
  }`;

  const fpath = ["spells"];
  fpath.push(levelStr);
  fpath.push(spell.slug);

  if (emit) {
    content += `---
layout: page
title: ${spell.name}
parent: ${spell.level > 0 ? `${levelStr} level spells` : "Cantrips"} 
description: D&D 5th edition ${spell.name} details
permalink: /${fpath.join("/")}/
---
`;
  }

  const parts = [`\n# ${spell.name}\n`];

  if (spell.source) {
    const sourceString = toSourceString(spell.source);
    sourceString && parts.push(sourceString);
  }

  parts.push("");

  if (spell.level === 0) {
    parts.push(
      `Cantrip ${
        spell.school &&
        (schoolsNames[spell.school] || spell.school).toLowerCase()
      }`
    );
  } else {
    parts.push(
      `${levelStr} level ${
        spell.school &&
        (schoolsNames[spell.school] || spell.school).toLowerCase()
      }`
    );
  }

  parts.push("");
  parts.push(`**Casting time:** ${spell.time}`);

  parts.push("");
  parts.push(
    `**Range:** ${
      spell.range.startsWith("S:")
        ? `Self (${spell.range.slice(2)})`
        : spell.range
    }`
  );

  parts.push("");
  parts.push(
    `**Components:** ${spell.components} ${
      spell.compMaterial ? `(${spell.compMaterial})` : ""
    }`
  );

  parts.push("");
  parts.push(`**Duration:** ${spell.duration}`);

  if ((spell.classes || []).length > 0) {
    parts.push("");
    parts.push(
      `**Classes:** ${spell.classes
        ?.map(
          (slug) =>
            `[${ClassList[slug].name}]({{ '/classes/${slugify(slug, {
              remove: /[^\w]/g,
            })}/' | relative_url }})`
        )
        .join(", ")}`
    );
  }

  parts.push("");
  parts.push(
    `${(spell.descriptionFull || spell.description).replace(/\n+/gm, "\n\n")}`
  );

  content += parts.join("\n");

  if (emit) {
    const dirname = path.resolve(
      __dirname.replace("dist/", ""),
      "..",
      "docs",
      "_spells"
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

  emit && console.groupEnd();

  return content;
}

function buildLevel(level: number) {
  const levelStr = `${level > 0 ? level : ""}${
    level > 3
      ? "th"
      : level === 3
      ? "rd"
      : level === 2
      ? "nd"
      : level === 1
      ? "st"
      : "cantrip"
  }`;
  const filename = path.resolve(
    __dirname.replace("dist/", ""),
    "..",
    "docs",
    "_spells",
    `${levelStr} level.md`
  );

  let content = `---
layout: page
title: ${level > 0 ? `${levelStr} level spells` : "Cantrips"} 
nav_order: ${level + 1} 
description: D&D 5th edition spell list of ${level} level
permalink: /spells/${levelStr}/
---
# ${level > 0 ? `${levelStr} level spells` : "Cantrips"} 
`;

  slugs
    .map((slug) => ({ spell: SpellsList[slug], slug }))
    .forEach(({ spell, slug }) => {
      if (spell.level === level) {
        content += `

<hr>

${buildSpell({ ...spell, slug }, false, 1)}`;
      }
    });

  fs.writeFileSync(filename, content);
}

export default function build() {
  console.group("Spells");

  Array.from({ length: 10 }, (_, i) => i).forEach((level) => {
    buildLevel(level);
  });

  console.groupEnd();
}
