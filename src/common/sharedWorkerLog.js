import moment from 'moment/moment';
import postal from 'postal';
/**在页面上打印网络状态，方便查询客户现场使用bug**/

const sharedWorkerLog = function() {
	//shared worker  ws 监控
	let notice;
	notice = document.createElement('div');
	notice.className = 'd-none';
	notice.style = 'position: absolute; right: 2px;  bottom: 2px;  background: rgba(0,0,0,0.5);';
	notice.innerHTML = '<div id="serverSuccess" style="padding:4px; color: #55ff55;"></div>' + '<div id="serverError" style="padding:4px; color: red;"></div>';
	document.body.appendChild(notice);

	postal.subscribe({
		channel: 'Web',
		topic: '#.Network.Connected',
		callback: (serverName) => {
			let cellNotice = document.createElement('div');
			let serverSuccess = document.getElementById('serverSuccess');
			cellNotice.innerHTML = `${moment(new Date()).format('hh:mm:ss')}-${serverName}连接成功`;
			serverSuccess.appendChild(cellNotice);
			if (serverSuccess.childNodes.length > 20) {
				serverSuccess.childNodes[0].remove();
			}
		},
	});
	postal.subscribe({
		channel: 'Web',
		topic: '#.Network.Error',
		callback: (data) => {
			let cellNotice = document.createElement('div');
			let serverError = document.getElementById('serverError');
			cellNotice.innerHTML = `${moment(new Date()).format('hh:mm:ss')}-${data.serverName}连接出错`;
			serverError.appendChild(cellNotice);
			if (serverError.childNodes.length > 20) {
				serverError.childNodes[0].remove();
			}
		},
	});

	document.addEventListener('keydown', (e) => {
		if (e.keyCode === 74 && e.ctrlKey) {
			notice.className = 'd-block';
		} else if (e.keyCode === 27) {
			notice.className = 'd-none';
		}
	});
};

export default sharedWorkerLog;
