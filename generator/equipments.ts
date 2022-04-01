import fs from "fs";
import path from "path";
import slugify from "slugify";

import {
  ArmourList,
  GearList,
  MagicItemsList,
  PacksList,
  ToolsList,
  WeaponsList,
  SpellsList,
} from "dnd-5th-ruleset";

const baseDirectory = path.resolve(
  __dirname.replace("dist/", ""),
  "..",
  "docs",
  "_equipments"
);

export default function () {
  console.group("Equipments");

  if (!fs.existsSync(baseDirectory)) {
    fs.mkdirSync(baseDirectory, { recursive: true });
  }

  console.group("Armour");
  generateArmour();
  console.groupEnd();

  console.group("Weapons");
  generateWeapons();
  console.groupEnd();

  console.groupEnd();
}

function generateArmour() {
  const file = path.resolve(baseDirectory, "armors.md");

  const byType: { [type: string]: typeof ArmourList } = {};

  Object.keys(ArmourList).forEach((slug) => {
    const armor = ArmourList[slug];
    const type = armor.type || "other";

    if (typeof byType[type] === "undefined") {
      byType[type] = {};
    }

    byType[type][slug] = armor;
  });

  const content = `---
layout: page
title: Armors
description: D&D 5th edition armors
---

# Armors

<table>
    <thead>
        <tr>
            <th>Armor</th>
            <th>AC</th>
            <th>Strength</th>
            <th>Stealth</th>
            <th>Weight</th>
        </tr>
    </thead>
    <tbody>
    ${
      typeof byType.light !== "undefined"
        ? `<tr><th colspan=5 style="text-align:left">Light</th></tr>\n` +
          Object.keys(byType.light)
            .map((slug) => {
              const armor = byType.light[slug];
              return `    <tr><td>${[
                armor.name,
                armor.ac,
                armor.strReq || "-",
                armor.stealthdis ? "Disadvantage" : "-",
                armor.weight || "-",
              ].join("</td><td>")}</td></tr>`;
            })
            .join("\n")
        : ""
    }
    ${
      typeof byType.medium !== "undefined"
        ? `<tr><th colspan=5 style="text-align:left">Medium</th></tr>\n` +
          Object.keys(byType.medium)
            .map((slug) => {
              const armor = byType.medium[slug];
              return `    <tr><td>${[
                armor.name,
                armor.ac,
                armor.strReq || "-",
                armor.stealthdis ? "Disadvantage" : "-",
                armor.weight || "-",
              ].join("</td><td>")}</td></tr>`;
            })
            .join("\n")
        : ""
    }
    ${
      typeof byType.heavy !== "undefined"
        ? `<tr><th colspan=5 style="text-align:left">Heavy</th></tr>\n` +
          Object.keys(byType.heavy)
            .map((slug) => {
              const armor = byType.heavy[slug];
              return `    <tr><td>${[
                armor.name,
                armor.ac,
                armor.strReq || "-",
                armor.stealthdis ? "Disadvantage" : "-",
                armor.weight || "-",
              ].join("</td><td>")}</td></tr>`;
            })
            .join("\n")
        : ""
    }
    ${Object.keys(byType)
      .filter((type) => ["light", "heavy", "medium"].indexOf(type) === -1)
      .map((type) => {
        return `<tr><th colspan=5 style="text-align:left">${type}</th></tr>\n${Object.keys(
          byType[type]
        )
          .map((slug) => {
            const armor = byType[type][slug];
            return `    <tr><td>${[
              armor.name,
              armor.ac,
              armor.strReq || "-",
              armor.stealthdis ? "Disadvantage" : "-",
              armor.weight || "-",
            ].join("</td><td>")}</td></tr>`;
          })
          .join("\n")}`;
      })
      .join("\n")}
    </tbody>
</table>
`;

  fs.writeFileSync(file, content);
}

function generateWeapons() {
  const file = path.resolve(baseDirectory, "weapons.md");

  const byType: { [type: string]: typeof WeaponsList } = {};

  Object.keys(WeaponsList).forEach((slug) => {
    const weapon = WeaponsList[slug];
    const type = weapon.type || "other";

    if (typeof byType[type] === "undefined") {
      byType[type] = {};
    }

    byType[type][slug] = weapon;
  });

  const content = `---
layout: page
title: Weapons
description: D&D 5th edition weapons
---

# Weapons

<table>
    <thead>
        <tr>
            <th>Weapon</th>
            <th>Damage</th>
            <th>Weight</th>
            <th>Properties</th>
        </tr>
    </thead>
    <tbody>
    ${Object.keys(byType)
      .filter((type) => type.toLowerCase() !== "spell")
      .map((type) => {
        return `<tr><th colspan=4 style="text-align:left">${type}</th></tr>\n${Object.keys(
          byType[type]
        )
          .map((slug) => {
            const weapon = byType[type][slug];
            const dice = `${weapon.damage[0]}`;
            let name = weapon.name;

            let damage = "-";
            if (
              dice.startsWith("C") ||
              dice.startsWith("B") ||
              dice.startsWith("Q") ||
              weapon.type === "Cantrip"
            ) {
              name = `<a target="_blank" href="{{ '/spells/cantrip/' | relative_url }}#${slugify(
                name.toLowerCase()
              )}">${name}</a>`;
              const descriptionCantripDie =
                SpellsList[weapon.name.toLowerCase()]?.descriptionCantripDie;
              if (descriptionCantripDie) {
                damage = descriptionCantripDie.replace(
                  /`CD([^\`]*)`/gm,
                  "<b>cantrip dice$1</b> &times; "
                );
              } else if (dice.match(/^\d+$/)) {
                damage = `${weapon.damage[0]}d${weapon.damage[1]} (${weapon.damage[2]})`;
              }
            } else if (dice.match(/^\d+$/)) {
              damage = `${weapon.damage[0]}d${weapon.damage[1]} (${weapon.damage[2]})`;
            }
            return `    <tr><td>${[
              name,
              `${damage}`,
              weapon.weight || "-",
              weapon.description || "-",
            ].join("</td><td>")}</td></tr>`;
          })
          .join("\n")}`;
      })
      .join("\n")}
    </tbody>
</table>
`;

  fs.writeFileSync(file, content);
}
