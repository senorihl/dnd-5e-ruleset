const fs = require("fs");
const path = require("path");
const toSource = require("tosource");

const MPMBPath = path.resolve(__dirname, "modules", "ruleset-wrapper");
const MPMBVariables = path.resolve(MPMBPath, "_variables");
const MPMBFunctions = path.resolve(MPMBPath, "_functions");
const MPMBRuleset = path.resolve(
  __dirname,
  "modules",
  "ruleset-collection",
  "WotC material",
  "all_WotC_published.js"
);

const execute = (pathname) => {
  console.group("Executing", path.resolve(pathname));
  let content = fs
    .readFileSync(path.resolve(pathname))
    .toString()
    .replace("InitializeEverything();", "InitializeEverything(true, true);")
    .replace(/^var tDoc = this;$/gm, "")
    .replace(/^var\s+(\S+)/gm, "global.tDoc.$1")
    .replace(/^global.tDoc.tDoc/gm, "global.tDoc")
    .replace(
      /(for \(var (\S+) in (\S+)\) \{)$/gm,
      "$1\nif ($2 === 'toSource') { continue; }"
    )
    .replace(/^function ([^\(]+)/gm, "global.tDoc.$1 = function $1");

  do {
    const m = /^(global\.tDoc\.(\S+)),\s*(.*);$/m.exec(content);

    if (m === null) {
      break;
    }

    content = content.replace(
      /^(global\.tDoc\.(\S+)),\s*(.*);$/m,
      "$1 = null;\nglobal.tDoc.$3;"
    );
  } while (true);

  try {
    eval(content);
    console.groupEnd();
  } catch (e) {
    console.groupEnd();
    throw new Error(
      `Cannot run '${pathname}' due to: ${e}
${e.stack}`
    );
  }
};

const createDomProxy = () => ({
  children: new Proxy(
    {},
    {
      get(target, prop, receiver) {
        return createDomProxy();
      },
    }
  ),
});

global.tDoc = new Proxy(
  {
    calculateNow: () => {},
    info: {
      SheetType: "",
      SheetVersion: "13.1.0",
      SpellsOnly: false,
      AdvLogOnly: false,
    },
    getField: () => ({
      submitName: ",,,,,,,,",
      setItems: () => ({}),
    }),
    bookmarkRoot: createDomProxy(),
  },
  {
    get(target, prop, receiver) {
      return target[prop];
    },
    set(target, prop, value, receiver) {
      if (prop.startsWith("Base_")) {
        global[prop.replace("Base_", "")] = value;
      }
      console.log(`Setting tDoc.${prop}`);
      global[prop] = value;
      target[prop] = value;
    },
  }
);

global.tDoc.app = {
  alert: () => {},
  setTimeOut: () => {},
  thermometer: {},
};

global.tDoc.display = {};

global.tDoc.sheetVersion = 13001000;

Object.prototype.toSource = function () {
  if (Array.isArray(this)) {
    const [...rest] = this;
    return rest;
  }
  const { ...rest } = this;
  return rest;
};

execute(path.resolve(MPMBFunctions, "Functions0.js"));
execute(path.resolve(MPMBFunctions, "Functions1.js"));
execute(path.resolve(MPMBFunctions, "Functions2.js"));
execute(path.resolve(MPMBFunctions, "Functions3.js"));
execute(path.resolve(MPMBFunctions, "FunctionsResources.js"));
execute(path.resolve(MPMBFunctions, "FunctionsImport.js"));
execute(path.resolve(MPMBFunctions, "FunctionsSpells.js"));
execute(path.resolve(MPMBVariables, "Lists.js"));
execute(path.resolve(MPMBVariables, "ListsSpells.js"));
execute(path.resolve(MPMBVariables, "ListsBackgrounds.js"));
execute(path.resolve(MPMBVariables, "ListsClasses.js"));
execute(path.resolve(MPMBVariables, "ListsCompanions.js"));
execute(path.resolve(MPMBVariables, "ListsCreatures.js"));
execute(path.resolve(MPMBVariables, "ListsFeats.js"));
execute(path.resolve(MPMBVariables, "ListsGear.js"));
execute(path.resolve(MPMBVariables, "ListsMagicItems.js"));
execute(path.resolve(MPMBVariables, "ListsPsionics.js"));
execute(path.resolve(MPMBVariables, "ListsRaces.js"));
execute(path.resolve(MPMBVariables, "ListsSources.js"));
global.tDoc.GetStringifieds = () => {};
global.tDoc.testSource = () => {};
global.tDoc.noVars = true;
global.tDoc.event = {};
global.tDoc.What = (any) => {
  if (any === "Color.Theme") {
    return "aqua";
  }

  return "";
};
global.tDoc.console = {
  ...console,
  println: () => {},
  show: () => {},
};
execute(path.resolve(MPMBFunctions, "Startup.js"));

var sheetVersion = 13001000;

execute(MPMBRuleset);

fileContent = [];

Object.keys(global).forEach((key) => {
  if (key.startsWith("Base_")) {
    fileContent.push(
      `export const ${key.replace("Base_", "")} = ${`${toSource(
        global[key]
      )}`.replace("typePF", "true")};`
    );
  }
});

fs.writeFileSync(
  path.resolve(__dirname, "dist", "index_temp.js"),
  fileContent.join("\n")
);
