import { Type, Lang } from '@produck/charon';
import { ServerProxy } from './Server/Proxy.js';

export { bind } from './bind';

export const createServer = (requestListener) => {
	if (Type.Not.Function(requestListener)) {
		Lang.Throw.TypeError('Invalid requestListener, a function expected.');
	}

	return new ServerProxy(requestListener);
};