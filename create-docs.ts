#!/usr/bin/env node
require("@babel/register");
import path from "path";
import fs from "fs";
import { program } from "commander";

const docsDirectoryPath = path.resolve(
  __dirname.replace("dist/", ""),
  "..",
  "docs",
  "_docs"
);

program.name(path.relative(process.cwd(), __filename));
program.option(
  "--rm",
  `Delete *.md files in ${path.relative(process.cwd(), docsDirectoryPath)}/**`,
  false
);
program.option("--no-races", "Prevents races generation");
program.option("--no-classes", "Prevents classes generation");
program.option("--no-backgrounds", "Prevents backgrounds generation");

program.parse();

const options = program.opts();

if (options.rm === true) {
  const docsDirectory = fs.opendirSync(docsDirectoryPath);

  let file = docsDirectory.readSync();

  while (file) {
    if (file.isFile()) {
      if (file.name.endsWith(".md")) {
        fs.rmSync(path.resolve(docsDirectoryPath, file.name));
      }
    }
    file = docsDirectory.readSync();
  }
}

options.races === true && require("./generator/races");
options.classes === true && require("./generator/classes");
options.backgrounds === true && require("./generator/backgrounds");
require("./generator/webworker");
