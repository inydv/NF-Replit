// esbuild/build-server.js
const { build } = require("esbuild");

build({
  entryPoints: ["server/index.js"],
  bundle: true,
  platform: "node",
  target: ["node18"],
  outfile: "dist/index.js",
  sourcemap: false,
  minify: true,
  define: { "process.env.NODE_ENV": '"PRODUCTION"' },
  // external: ['some-native-module-if-needed']
}).catch(() => process.exit(1));
