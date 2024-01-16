import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";

const isWatching =
  process.argv.includes("-w") || process.argv.includes("--watch");

export default {
  input: ["src/index.ts"],
  output: {
    dir: "dist",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      sourceMap: true,
      inlineSourceMap: true,
      compilerOptions: { target: "ES3", ignoreDeprecations: "5.0" },
    }),
    isWatching
      ? serve({
          open: true,
          contentBase: "dist",
        })
      : terser({ ie8: true }),
  ],
};
