// import Promise from 'bluebird';
import postal from 'postal';
// import { remote } from 'electron';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
// import Logger from 'logger';
import { extend, map, isString } from 'lodash';

// const log = new Logger('library:sockjs');
const WSPORT = 8300;

class StompClient {
	constructor(server) {
		this.server = server;
		this.subMap = {};
		this.client = Stomp.over(server.socket);
		this.connect();
		this.debug();
	}

	connect(callback) {
		let server = this.server;
		server.headers = server.headers || {};
		// server.headers.userId = remote.getGlobal('userId');
		// server.headers.clientId = remote.getGlobal('clientId');
		// server.headers.seatFlag = remote.getGlobal('seatFlag');
		// server.headers.token = remote.getGlobal('token');
		// server.headers.Authorization = remote.getGlobal('token');

		this.client.connect(
			server.headers,
			(frame) => {
				postal.publish({
					channel: 'Web',
					topic: `${server.name}.Network.Connected`,
					data: server.name,
				});
				postal.publish({
					channel: 'Worker',
					topic: `${server.name}.Network.Connected`,
					data: this,
				});
			},
			(error) => {
				postal.publish({
					channel: 'Web',
					topic: `${server.name}.Network.Error`,
					data: { serverName: server.name, error: error },
				});
			},
		);
	}

	/*****
	/data.body.
	/responseMessage 返回内容
	/responseType 返回类型json string
	/total 返回总数
	/count 返回次数计数
	/requestType 200 成功  500错误
	*****/
	sub(key, callback, options) {
		this.subMap[key] = this.client.subscribe(
			key,
			(frame) => {
				if (frame.body && frame.body !== 'null') {
					//data.body.responseData 返回内容
					//data.body.responseType 返回类型json string
					//data.body.total 返回总数
					//data.body.count 返回次数计数
					//data.body.responseCode 200 成功  500错误
					let sBody = JSON.parse(frame.body);
					if (sBody.responseCode && sBody.responseCode === 200) {
						let contentData = sBody.responseData;
						if (sBody.responseType === 'json' && sBody.responseData) {
							if (isString(sBody.responseData)) {
								try {
									contentData = JSON.parse(sBody.responseData);
								} catch (e) {
									console.error(`无法解析响应:${sBody.responseData},路径:${key}`);
									return;
								}
							} else {
								contentData = sBody.responseData;
							}
						}
						callback(contentData, sBody);
					} else if (sBody.responseCode && sBody.responseCode === 500) {
						console.error('server error', frame.headers.destination, sBody.responseCode);
					} else {
						let data = sBody.responseData ? JSON.parse(sBody.responseData) : sBody;
						callback(data, frame.body);
					}
				} else {
					console.error(`ws:${key} got empty message`);
				}
			},
			options || {},
		);
	}

	send(...args) {
		this.client.send.apply(this.client, args);
	}

	unSub(key) {
		this.subMap[key].unsubscribe();
		console.log(key+': is unSub')
	}

	debug() {
		this.client.debug = function(msg) {
			// log.verbose(msg);
		};
	}
	disconnect(callback) {
		this.client.disconnect(callback);
	}
}

class Sock {
	constructor(servers) {
		this.servers = servers;
		map(servers, (server) => {
			server.socket = null;
			server.recTimer = null;
			this.connectSock(server);
		});
		return this;
	}

	connectSock(server) {
		let self = this;
		clearInterval(server.recTimer);
		// console.verbose(`socket.io should connect to host ${server.host} port ${server.port} for channel ${server.channel}`);
		server.socket = new SockJS(`http://${server.host}:${server.port}/${server.channel}`);
		server.client = new StompClient(server);

		server.socket.onclose = (e) => {
			console.info(`socket closed ${server.name}`, server, e);
			postal.publish({
				channel: 'Web',
				topic: `${server.name}.Network.Error`,
				data: { serverName: server.name, error: e },
			});
			server.socket = null;
			server.recTimer = setInterval(function() {
				server.client.disconnect();
				self.connectSock(server);
			}, 10 * 1000);
		};
	}
	reConnectSock(server) {
		server.socket = null;
		// server.recTimer = setInterval(function() {
		server.client.disconnect();
		self.connectSock(server);
		// }, 2000);
	}
	reConnectSockAll() {
		map(this.servers, (server) => {
			server.socket = null;
			server.recTimer = null;
			server.client.disconnect();
			this.connectSock(server);
		});
	}
	regist(name, callback) {
		map(this.servers, (server) => {
			if (server.name == name) {
				callback(server.client);
			}
		});
	}
}

export default (servers) => {
	return new Sock(servers);
};
