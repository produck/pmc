const path = require('path');
const { defineConfig } = require('rollup');
const html = require('@rollup/plugin-html');
const serve = require('rollup-plugin-serve');
const { terser } = require('rollup-plugin-terser');
const livereload = require('rollup-plugin-livereload');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const DIST_DIR = path.join(__dirname, '../.dev');
const HOST_DIR = path.join(DIST_DIR, 'host');
const AGENT_DIR = path.join(DIST_DIR, 'agent');

export default defineConfig([
	{
		input: path.join(__dirname, '../test/host.js'),
		output: {
			dir: HOST_DIR,
			sourcemap: 'inline',
			format: 'umd',
			name: 'example'
		},
		plugins: [
			nodeResolve({
				browser: true,
				preferBuiltins: false
			}),
			// terser(),
			serve({ host: '127.0.0.1', port: 3000, contentBase: HOST_DIR }),
			livereload({ watch: DIST_DIR }),
			html(),
		]
	},
	{
		input: path.join(__dirname, '../test/agent.js'),
		output: {
			dir: AGENT_DIR,
			sourcemap: 'inline',
			format: 'umd',
			name: 'agent'
		},
		plugins: [
			nodeResolve({
				browser: true,
				preferBuiltins: false
			}),
			// terser(),
			serve({
				host: '127.0.0.1',
				port: 3001,
				contentBase: AGENT_DIR
			}),
			livereload({ watch: DIST_DIR }),
			html(),
		]
	}
]);