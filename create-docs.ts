require("@babel/register");
import path from "path";
import fs from "fs";

const docsDirectoryPath = path.resolve(
  __dirname.replace("dist/", ""),
  "..",
  "docs",
  "_docs"
);

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

import "./generator/races";
import "./generator/classes";
import "./generator/webworker";
