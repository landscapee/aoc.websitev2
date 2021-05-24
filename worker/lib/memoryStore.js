// import localforage from 'localforage';
//
// export const flightsStore = localforage.createInstance({
//     name: "flights"
// });

// export const monitorStore = localforage.createInstance({
//     name: "monitor"
// });

import { extend } from 'lodash';

// const Storage = class Store {
// 	constructor(name) {
// 		this.monitor = JSON.parse(localStorage.getItem('monitor')) || {};
// 	}
// 	getItem(id) {
// 		return this.monitor[id];
// 	}
// 	setItem(id, data) {
// 		this.monitor[id] = data;
// 		localStorage.setItem('monitor', JSON.stringify(this.monitor));
// 	}
// };
//export const localStore = new Storage();

const Memory = class MemoryStore {
	constructor(name) {
		this.data = {};
	}
	getItem(id) {
		return this.data[id] ? extend({}, this.data[id]) : {};
	}
	setItem(id, data, isReplace) {
		this.data[id] = isReplace ? data : extend({}, this.data[id], data);
	}
};

export const memoryStore = new Memory();
