import { Type } from '@produck/charon';
import * as SYMBOL from './symbol.js';

const CHANNELS = {};

export const ChannelData = any => {
	if (Type.Not.Array(any)) {
		return false;
	}

	const [protocol, type, target, origin, id] = any;

	if (protocol !== 'pmc') {
		return false;
	}

	if (SYMBOL.CALL !== type && SYMBOL.RETURN !== type) {
		return false;
	}

	if (Type.Not.Number(origin)) {
		return false;
	}

	if (Type.Not.Number(target)) {
		return false;
	}

	if (Type.Not.Number(id)) {
		return false;
	}

	return true;
};

const DataType = {
	[SYMBOL.CALL]: (channel, data, origin, source) => {
		const [, method, args] = data;
		const finalArgs = method === 'connect' ? [origin, source] : args;

		data[2] = finalArgs;
		channel.call(...data);
	},
	[SYMBOL.RETURN]: (channel, data) => channel.receive(...data)
};

window.addEventListener('message', event => {
	const { data, source } = event;

	if (!ChannelData(data)) {
		return;
	}

	const [, type, target, origin] = data;
	const channel = CHANNELS[target];

	if (!channel) {
		return;
	}

	DataType[type](channel, data.slice(4), origin, source);
});

window.addEventListener('unload', () => {
	for (const port in CHANNELS) {
		CHANNELS[port].close();
	}
});

export const remove = port => delete CHANNELS[port];
export const add = channel => CHANNELS[channel.local.port] = channel;