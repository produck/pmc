import * as PMC from '../index.js';

console.log(PMC);
const methods = {
	add: () => Date.now(),
	test: msg => console.log(msg)
};

const server = PMC.createServer(channel => {
	console.log(channel);
	channel.methods = methods;
	channel.on('close', () => console.log('host close'));
});

server.listen(-100);


const iframe = document.createElement('iframe');

iframe.src = 'http://127.0.0.1:3001';

document.body.appendChild(iframe);