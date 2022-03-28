#!/usr/bin/env node
require("@babel/register");
import path from "path";
import fs from "fs";
import { program } from "commander";
import races from "./generator/races";
import classes from "./generator/classes";
import backgrounds from "./generator/backgrounds";
import spells from "./generator/spells";

const docsDirectoryPath = path.resolve(
  __dirname.replace("dist/", ""),
  "..",
  "docs"
);

program.name(path.relative(process.cwd(), __filename));
program.option(
  "--rm",
  `Delete *.md files in ${path.relative(
    process.cwd(),
    docsDirectoryPath
  )}/_*/**`,
  false
);
program.option("--no-races", "Prevents races generation");
program.option("--no-classes", "Prevents classes generation");
program.option("--no-backgrounds", "Prevents backgrounds generation");
program.option("--no-spells", "Prevents spells generation");
program.option("--no-worker", "Prevents web worker generation");

program.parse();

const options = program.opts();

//if (options.rm === true) {
const docsDirectory = fs.opendirSync(docsDirectoryPath);

let file = docsDirectory.readSync();

while (file) {
  if (
    file.isDirectory() &&
    ["_spells", "_docs", "_races", "_classes", "_backgrounds"].indexOf(
      file.name
    ) >= 0
  ) {
    const typeDir = fs.opendirSync(path.resolve(docsDirectoryPath, file.name));
    console.log(path.resolve(docsDirectoryPath, file.name));
    let subfile = typeDir.readSync();
    while (subfile) {
      if (subfile.isFile()) {
        if (subfile.name.endsWith(".md")) {
          fs.rmSync(path.resolve(docsDirectoryPath, file.name, subfile.name));
          console.warn(
            "deleted",
            path.resolve(docsDirectoryPath, file.name, subfile.name)
          );
        }
      }
      subfile = typeDir.readSync();
    }
  }

  file = docsDirectory.readSync();
}

options.races === true && races();
options.classes === true && classes();
options.backgrounds === true && backgrounds();
options.spells === true && spells();
