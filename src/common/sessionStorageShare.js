// import { extend } from 'lodash';
//
// const Memory = class MemoryStore {
// 	constructor(name) {
// 		this.data = {};
// 	}
// 	getItem(id) {
// 		let data = sessionStorage.getItem(id);
// 		if (!data) {
// 			data = localStorage.getItem(id);
// 		}
// 		return data;
// 	}
// 	setItem(id, data) {
// 		sessionStorage.setItem(id, data);
// 		localStorage.setItem(id, data);
// 	}
// 	remove(id) {
// 		sessionStorage.remove(id, data);
// 		localStorage.remove(id, data);
// 	}
// };
//
// const sessionStorageShare = new Memory();

//如果是localStorage的，要同步其它页面的用户数据和sessionStorage
//e.url 判断不是本页面才处理
//如果是 sessionStorage变化，就需要同步到localStorage
// window.addEventListener('storage', function(e) {
// // 	console.log(e);
// // });
import postal from 'postal';
function isEmptyObj(obj) {
	for (let i in obj) {
		return false;
	}
	return true;
}
const MemoryStorage = class {
	constructor() {
		this.data = {};
	}
	setItem(k, v) {
		this.data[k] = v;
		sessionStorage.setItem(k, v);
		MemoryStorage.dataSendHandler(this.data);
	}
	getItem(k) {
		return this.data[k] || sessionStorage.getItem(k);
	}
	removeItem(k) {
		delete this.data[k];
		sessionStorage.removeItem(k);
		MemoryStorage.dataSendHandler(this.data);
	}
	clear() {
		this.data = {};
		sessionStorage.clear();
		MemoryStorage.dataSendHandler(this.data);
	}
	static dataSendHandler(data) {
		localStorage.setItem('setMemoryStorage', JSON.stringify(data));
		localStorage.removeItem('setMemoryStorage');
	}
	static dataGetHandler() {
		localStorage.setItem('getMemoryStorage', new Date().getTime());
		localStorage.removeItem('getMemoryStorage');
	}
};
const initMemoryStorage = function() {
	var memoryStorage = new MemoryStorage();
	window.addEventListener('storage', function(e) {
		if (e.newValue === null) return false;
		if (e.key == 'getMemoryStorage') {
			// console.log('有其他页面取memory')
			MemoryStorage.dataSendHandler(memoryStorage.data);
		} else if (e.key == 'setMemoryStorage') {
			let data = JSON.parse(e.newValue);
			if (isEmptyObj(data)) {
				// console.log('memory被清空了')
				sessionStorage.clear();
				memoryStorage.data = {};
			} else {
				// console.log('memory被修改了')
				for (let k in data) {
					// if (k == 'User' && memoryStorage.data[k] && memoryStorage.data[k] != data[k]) {
					// 	memoryStorage.data[k] = data[k];
					// 	window.location.reload();
					// } else {
					memoryStorage.data[k] = data[k];
					sessionStorage.setItem(k, data[k]);
					// }
					// postal.publish({
					// 	channel: 'UI',
					// 	topic: k + '.Changed',
					// 	callback: data[k],
					// });
				}
			}
		}
	});
	if (isEmptyObj(memoryStorage.data)) {
		MemoryStorage.dataGetHandler();
	}
	return memoryStorage;
};

export default initMemoryStorage;
