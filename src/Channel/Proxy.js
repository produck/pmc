import { Lang, Type, Object } from '@produck/charon';
import { ChannelContext } from './Context.js';

const map = new WeakMap();

export const _ = proxy => map.get(proxy);

export class ChannelProxy {
	constructor(port) {
		const context = new ChannelContext(this, port);

		map.set(this, context);
		Object.freeze(this);
	}

	get local() {
		return Object.assign({}, _(this).local);
	}

	get remote() {
		return Object.assign({}, _(this).remote);
	}

	get methods() {
		return _(this).methods;
	}

	set methods(value) {
		if (Type.Not.Object(value) || Type.isNull(value)) {
			Lang.Throw.TypeError('Invalid methods, an object expected.');
		}

		_(this).methods = value;
	}

	async request(name, ...args) {
		return _(this).request(name, args);
	}

	close() {
		_(this).close();
	}

	on(...args) {
		_(this).on(...args);

		return this;
	}

	off(...args) {
		_(this).on(...args);

		return this;
	}
}