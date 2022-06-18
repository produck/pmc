import { Object } from '@produck/charon';
import * as Events from '@produck/charon-events';

import * as Channel from '../Channel/index.js';

export class ServerContext extends Events.Simple.Emitter {
	constructor(proxy, requestListener) {
		super();

		this.$ = proxy;
		this.port = null;
		this.listener = requestListener;
		this.channel = null;
	}

	listen(port) {
		const listened = new Channel.Proxy(port);
		const _listened = Channel._(listened);

		listened.methods = {
			connect: (origin, source) => {
				const channel = new Channel.Proxy();
				const _channel = Channel._(channel);

				_channel.setEstablish(source, origin);
				_listened.setEstablish(source, origin);
				this.listener(channel);

				return _channel.local.port;
			}
		};
	}

	close() {
		this.channel.close();
	}
}
