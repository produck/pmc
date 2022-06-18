import { Lang, Type } from '@produck/charon';
import * as Events from '@produck/charon-events';

import * as Registry from './Registry.js';
import * as SYMBOL from './symbol.js';

const STATUS = { CONNECTING: 0, ESTABLISHED: 1, FINISHED: -1 };
const Counter = { port: 1, calling: 0 };

const DataDiagram = {
	Call: data => ['pmc', SYMBOL.CALL, ...data],
	Return: data => ['pmc', SYMBOL.RETURN, ...data]
};

export class ChannelContext extends Events.Simple.Emitter {
	constructor(proxy, port = Counter.port++) {
		super();

		this.$ = proxy;
		this.status = STATUS.CONNECTING;

		this.local = { host: window, port };
		this.remote = { host: null, port: null };

		this.returners = {};
		this.methods = {};

		Registry.add(this);
	}

	get address() {
		return [this.remote.port, this.local.port];
	}

	assertNotFinished() {
		if (this.status === STATUS.FINISHED) {
			Lang.throwError('Finished.');
		}
	}

	setEstablish(host, port) {
		this.remote.host = host;
		this.remote.port = port;
		this.status = STATUS.ESTABLISHED;
	}

	async call(id, name, args) {
		if (name === 'close') {
			return this.close();
		}

		const calledData = [null, null];
		const method = this.methods[name];

		try {
			if (Type.Not.Function(method)) {
				Lang.throwError(`PMC: Bad method named ${name}.`);
			}

			calledData[1] = await this.methods[name](...args);
		} catch (error) {
			calledData[0] = error.message;
		}

		const data = [...this.address, id, ...calledData];

		this.remote.host.postMessage(DataDiagram.Return(data), '*');
	}

	request(method, args, timeout = 1000) {
		this.assertNotFinished();

		const id = Counter.calling++;
		const data = [...this.address, id, method, args];

		return new Promise((resolve, reject) => {
			this.returners[id] = { resolve, reject };
			this.remote.host.postMessage(DataDiagram.Call(data), '*');

			if (method === 'close') {
				return;
			}

			setTimeout(() => {
				reject(new Error(`PMC: The ${this.local.port}/${id} ${method} is timeout.`));
			}, timeout);
		}).finally(() => delete this.returners[id]);
	}

	receive(id, errorMessage, returnValue) {
		const returner = this.returners[id];

		if (!returner) {
			return;
		}

		if (Type.isNull(errorMessage)) {
			returner.resolve(returnValue);
		} else {
			returner.reject(new Error(`PMC: The remote error\n${errorMessage}`));
		}
	}

	async close() {
		this.assertNotFinished();
		Registry.remove(this.local.port);

		if (this.status === STATUS.ESTABLISHED) {
			this.request('close', []);
		}

		this.status = STATUS.FINISHED;
		this.emit('close');
	}

	async connect(host, port) {
		try {
			Object.assign(this.remote, { host, port });
			this.setEstablish(host, await this.request('connect', []));
		} catch (error) {
			this.close();
			throw error;
		}
	}
}