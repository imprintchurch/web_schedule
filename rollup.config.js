import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const prod = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

function consts(consts) {
  const moduleStart = 'consts:';
  return {
    name: 'consts-plugin',
    resolveId(id) {
      if (!id.startsWith(moduleStart)) return;
      return id;
    },
    load(id) {
      if (!id.startsWith(moduleStart)) return;
      const key = id.slice(moduleStart.length);

      if (!(key in consts)) {
        this.error(`Cannot find const: ${key}`);
        return;
      }

      return `export default ${JSON.stringify(consts[key])}`;
    },
  };
}

/** @type { import('rollup').RollupOptions} */
const client = {
  input: 'src/calendar.svelte',
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: !prod,
  },
  plugins: [
    consts({
      hostLocation: prod ? 'https://imprintchurch.github.io/web_schedule' : '',
    }),
    svelte({
      compilerOptions: {
        dev: !prod,
      },
      emitCss: false,
    }),
    resolve({
      browser: 'true',
      dedupe: ['svelte'],
    }),
    commonjs(),
    prod && terser(),
    !prod && serve(),
  ],
};

export default client;
