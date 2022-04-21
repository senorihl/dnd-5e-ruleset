import * as ruleset from "dnd-5th-ruleset";
import fs from "fs";
import path from "path";

const regex = /const ([^\:]+)/gm;
let missing = Object.keys(ruleset);

export default function () {
    const allExports = fs.readFileSync(path.resolve(__dirname, '..', 'typings', 'index.d.ts').replace('dist/', '')).toString();

    let m: any

    while ((m = regex.exec(allExports)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        missing = missing.filter(name => name !== m[1]);
    }

    console.error('Missing exports:', missing.join(', '));
}
