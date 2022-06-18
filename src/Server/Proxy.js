import { Type, Lang, Object } from '@produck/charon';
import { ServerContext } from './Context.js';

const map = new WeakMap();
export const _ = proxy => map.get(proxy);

export class ServerProxy {
	constructor(listener) {
		const context = new ServerContext(this, listener);

		map.set(this, context);
		Object.freeze(this);
	}

	listen(port) {
		if (Type.Not.Number(port) || port > 0 || !Number.isInteger(port)) {
			Lang.Throw.TypeError('Invalid port, a negative integer expected.');
		}

		_(this).listen(port);
	}

	close() {
		_(this).close();
	}
}