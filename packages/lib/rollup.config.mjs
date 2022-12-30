import dts from "rollup-plugin-dts";

const config = [
  {
    input: "./src/foo/bar/baz.ts",
    output: [{ file: "dist/lib.d.ts", format: "es" }],
    plugins: [dts()],
  },
];

export default config;
