// rollup.config.js
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import rollupTypescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
const extensions = [".js", ".jsx", ".ts", ".tsx"]; // 어떤 확장자를 처리 할 지 정함

process.env.BABEL_ENV = "production";

const config = {
  input: "./src/index.ts",
  plugins: [
    peerDepsExternal(),
    json(),
    resolve({ extensions }),
    babel({
      babelHelpers: "bundled",
    }),
    commonjs({ include: "node_modules/**" }),
    rollupTypescript({ tsconfig: "./tsconfig.json" }),
  ],
  output: [
    {
      file: "./dist/index.mjs",
      format: "es",
      sourcemap: true,
    },
    {
      file: "./dist/index.min.js",
      format: "iife",
      name: "version",
      plugins: [terser()],
    },
  ],
};

export default config;
