## Setup

1. Clone the repo and open it in VS Code
2. Install dependencies with `pnpm install`
3. Install the [recommended extension](https://marketplace.visualstudio.com/items?itemName=deckerio.breakpointio)
   - Import breakpoints with <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> → `breakpointio-import` (breakpoint locations can be found in [.vscode/breakpoints.json](./.vscode/breakpoints.json))
4. Open a JavaScript Debug Terminal
5. Run the build with `pnpm build`

The output should be:

```
./src/foo/bar/baz.ts → dist/lib.d.ts...
getCompilerOptions( input: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
dts.resolveId( source: './src/foo/bar/baz.ts', importer: undefined )
dts.resolveId( source: 'rollup-plugin-dts', importer: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
getCompilerOptions( input: 'rollup-plugin-dts' )
dts.resolveId( source: '.', importer: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
getCompilerOptions( input: '.' )
dts.resolveId( source: './bazza', importer: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
getCompilerOptions( input: './bazza' )
dts.resolveId( source: '../../quux', importer: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
getCompilerOptions( input: '../../quux' )
error TS18003: No inputs were found in config file 'tsconfig.json'. Specified 'include' paths were '["./scripts"]' and 'exclude' paths were '[]'.

created dist/lib.d.ts in 388ms
```

The issue was introduced in 5.1. Running with `pnpm build:5.0` the output is:

```
./src/foo/bar/baz.ts → dist/lib.d.ts...
created dist/lib.d.ts in 351ms
```
(no TypeScript error)

## Patch

I've also included a [patch](./patches/rollup-plugin-dts@5.1.0.patch) with my suggested fix. Running with `pnpm build:5.1:patch` the output is:

```
./src/foo/bar/baz.ts → dist/lib.d.ts...
getCompilerOptions( input: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
dts.resolveId( source: './src/foo/bar/baz.ts', importer: undefined )
dts.resolveId( source: 'rollup-plugin-dts', importer: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
getCompilerOptions( input: 'rollup-plugin-dts' )
dts.resolveId( source: '.', importer: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
  resolved source: /___/rollup-plugin-dts-repro/packages/lib/src/foo/bar
getCompilerOptions( input: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar' )
dts.resolveId( source: './bazza', importer: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
  resolved source: /___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/bazza
getCompilerOptions( input: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/bazza' )
dts.resolveId( source: '../../quux', importer: '/___/rollup-plugin-dts-repro/packages/lib/src/foo/bar/baz.ts' )
  resolved source: /___/rollup-plugin-dts-repro/packages/lib/src/quux
getCompilerOptions( input: '/___/rollup-plugin-dts-repro/packages/lib/src/quux' )
created dist/lib.d.ts in 420ms
```
(no TypeScript error)
