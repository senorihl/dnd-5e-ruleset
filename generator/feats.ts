import fs from "fs";
import path from "path";
import {FeatsList} from "dnd-5th-ruleset";
import type { Feat } from "dnd-5th-ruleset";
import { toSourceString } from "./utils";
import slugify from "slugify";

const slugs = Object.keys(FeatsList);

function buildFeat(slug: string, feat: Feat) {
    let content = "";
    const fpath = ["feats"];
    fpath.push(slug);

    content += `---
layout: page
title: ${feat.name}
parent: ${feat.parent || "All feats"}
${!feat.parent ? "" : "grand_parent: All feats"}
description: D&D 5th edition ${feat.name} details
permalink: /${fpath.join("/")}/
---
`;

    const parts = [`\n# ${feat.name}\n`];

    if (feat.source) {
        const sourceString = toSourceString(feat.source);
        sourceString && parts.push(sourceString);
    }

    const desc = feat.descriptionFull || feat.description;

    if (typeof desc === "string") {
        let prevIsList = false;
        parts.push(
            ...(desc as string)
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
    } else if (Array.isArray(desc)) {
        parts.push(`\n| Level | Description |`);
        parts.push(`|:----------------------------|:------------------|`);
        parts.push(
            ...desc.map((description, index) => {
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

    content += parts.join("\n");

    const dirname = path.resolve(
        __dirname.replace("dist/", ""),
        "..",
        "docs",
        "_feats"
    );
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
    const filename = path.resolve(dirname, `${fpath.slice(1).join(" # ")}.md`);
    fs.writeFileSync(filename, content);
}

export default function build() {
    console.group("Feats");

    let alphabetically: { [letter: string]: typeof FeatsList } = {};

    alphabetically = slugs.reduce((acc, slug) => {
        const letter = FeatsList[slug].name.substring(0, 1).toUpperCase();
        acc[letter] = acc[letter] || {};
        acc[letter][slug] = FeatsList[slug];
        return acc;
    }, alphabetically);

    const content = `---
layout: page
title: All feats
description: D&D 5th edition all feats
permalink: /feats/
has_children: true
---

# All feats alphabetically

${Object.keys(alphabetically).sort()
        .map((letter) => {
            return `## ${letter}
${Object.keys(alphabetically[letter]).map((slug) => {
                const feat = FeatsList[slug];
                let str = `- [${feat.name}]({{ '/feats/${slugify(slug, {
                    remove: /[^\w]/g,
                })}/' | relative_url }})${feat.prerequisite ? `, ${feat.prerequisite}` : ''}`;
                
                if (feat.choices && feat.choices.length > 0) {
                    str += `
${feat.choices.map(choiceKey => ([choiceKey, feat[choiceKey.toLowerCase()]] as [string, Feat])).map(([choiceKey, choice]) => {
                       return `  - [${choice.name || choiceKey}]({{ '/feats/${slugify(slug, {
                           remove: /[^\w]/g,
                       })}/#${choiceKey}' | relative_url }})`
                    }).join('\n')}`
                }
                return str;
            }).join("\n")}
`;
            
        })
        .join("\n")}
`;

    const dirname = path.resolve(
        __dirname.replace("dist/", ""),
        "..",
        "docs",
        "_feats"
    );
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
    const filename = path.resolve(dirname, `index.md`);
    fs.writeFileSync(filename, content);

    Object.keys(alphabetically).forEach((letter) => {
        const byLetter = alphabetically[letter];
        Object.keys(byLetter).forEach((key) => {
            const feat = byLetter[key] as Feat;
            buildFeat(slugify(key, { remove: /[^\w]/g }), feat);
        })

    });

    console.groupEnd();
}
