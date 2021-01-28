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

/** @type { import('rollup').RollupOptions} */
const client = {
  input: 'src/calendar.svelte',
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: !prod,
  },
  plugins: [
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
