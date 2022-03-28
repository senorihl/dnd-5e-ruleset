import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";
import path from "path";
/**
 * @type {Array<import('rollup').RollupOptions>}
 */
const config = [
  // browser-friendly UMD build
  {
    input: "dist/index_temp.js",
    output: {
      name: "dnd-5th-ruleset",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ],
  },

  {
    input: "dist/index_temp.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
  },

  {
    // path to your declaration files root
    input: "typings/index.d.ts",
    output: [{ file: pkg.typings, format: "es" }],
    plugins: [dts()],
  },

  {
    input: "src/utils.ts",
    output: {
      name: "dnd-5th-ruleset/utils",
      file: pkg.browser.replace("index", "utils"),
      format: "umd",
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      typescript({ tsconfig: path.resolve(__dirname, "tsconfig.utils.json") }),
      commonjs({ extensions: [".js", ".ts"] }), // so Rollup can convert `ms` to an ES module,
    ],
  },

  {
    input: "src/utils.ts",
    output: [
      {
        name: "dnd-5th-ruleset/utils",
        file: pkg.main.replace("index", "utils"),
        format: "cjs",
      },
      {
        name: "dnd-5th-ruleset/utils",
        file: pkg.module.replace("index", "utils"),
        format: "es",
      },
    ],
    plugins: [
      typescript({ tsconfig: path.resolve(__dirname, "tsconfig.utils.json") }),
    ],
  },

  {
    input: "src/utils.ts",
    output: [
      {
        name: "dnd-5th-ruleset/utils",
        file: pkg.typings.replace("index", "utils"),
        format: "es",
      },
    ],
    plugins: [
      typescript({
        tsconfig: path.resolve(__dirname, "tsconfig.utils.json"),
        compilerOptions: { emitDeclarationOnly: true },
      }),
      dts(),
    ],
  },
];

export default config;
