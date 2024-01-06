import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";
import svg from "rollup-plugin-svg";
import { corejsPlugin } from "rollup-plugin-corejs";

const isWatching =
  process.argv.includes("-w") || process.argv.includes("--watch");

const output = {
  dir: "dist",
  format: "iife",
};
const plugins = [
  svg(),
  nodeResolve(),
  typescript({ target: "ES3" }),
  //corejsPlugin(),
  isWatching
    ? serve({
        open: true,
        contentBase: "dist",
      })
    : terser(),
];

export default [
  {
    input: "src/index.ts",
    output: { ...output, name: "dist/index.js" },
    plugins,
  },
  {
    input: { fetch: "whatwg-fetch" },
    output,
    plugins,
  },
];
