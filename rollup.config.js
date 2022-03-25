import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";
/**
 * @type {Array<import('rollup').RollupOptions>}
 */
const config = [
  // browser-friendly UMD build
  {
    input: "dist/index_temp.js",
    output: {
      name: "dnd5thRuleset",
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
    input: "./typings/index.d.ts",
    output: [{ file: pkg.typings, format: "es" }],
    plugins: [dts()],
  },
];

export default config;
