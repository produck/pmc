import * as PMC from '../index.js';

(async function () {
	const client = await PMC.bind(window.parent, -100);
	const result = await client.request('add');

	client.on('close', () => console.log('agent close'));

	window.c = client;

	console.log(result);

	// const a = await PMC.bind(window.parent, -101);

	// await a.request('no');
}());