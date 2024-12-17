import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";

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
    typescript(),
    process.env.ROLLUP_WATCH
      ? serve({
          open: true,
          contentBase: "dist",
        })
      : terser({ ie8: true }),
  ],
};
