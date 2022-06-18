import * as Channel from './Channel/index.js';

export const bind = async function bind(host, port) {
	const channel = new Channel.Proxy();

	await Channel._(channel).connect(host, port);

	return channel;
};