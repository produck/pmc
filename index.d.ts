interface ChannelAddress {
	host: Window;
	port: number;
}

interface Channel {
	methods: object;
	readonly local: ChannelAddress;
	readonly remote: ChannelAddress;
	request(method: string, ...args: any[]): Promise<any>;
	close(): void;
	on(eventType: 'close', listener: () => {}): this;
	off(eventType: 'close', listener: () => {}): this;
}

interface Server {
	listen(port: number): void;
	close(): void;
}

type RequestListener = (channel: Channel) => void;

export function bind(host: Window, port: number): Promise<Channel>;
export function createServer(requestListener: RequestListener): Server;