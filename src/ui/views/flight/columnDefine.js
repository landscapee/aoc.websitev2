import {each, get, map} from "lodash";
import {sizeStr} from "@/ui/lib/common";
import classNames from "classnames";
let DISPLAYNULL = '--'
export default {

  airlineCnName: {
    widthCalc: (flights)=>{
      let size = 10;
      each(flights, (f) => {
        let s = sizeStr(get(f, 'airlineCnName', ''));
        size = s > size ? s : size;
      });
      console.log('airlineCnName size:', size)
      return size * 8;
    }
  },
  flightStatusText: {
    formatter: (item) => {
      const flightState = {
        前方起飞: '#9E72FF',
        到达: '#1D93F2',
        登机: '#2a42ff',
        催促登机: '#BC1D1D',
        关闭: '#00950C',
        取消: '#7B97AD',
        延误: '#EE4469',
        起飞: '#B3C0D6',
        到下站: '#B3C0D6',
        正常: '#fff',
        备降: '#F89401',
        返航: '#F89401',
      };
      let status = get(item, 'flightStatusText');
      return(
        `<div 
          class="el-badge__content" 
          style="
            background-color: ${flightState[status] || '#919191'}; 
            border: none; 
            color: ${status == '正常' ? '#000' : '#fff'}" 
            >${item.flightStatusText}</div>`
      )
    }
  },
  displayRouter: {
    widthCalc: (flights)=>{
      let size = 10;
      each(flights, (f) => {
        let route = get(f, 'displayRouter', []);
        if (route) {
          let rs = route.join('-');
          let s = sizeStr(rs);
          size = s > size ? s : size;
        }
      });
      return size * 7;
    },
    formatter: (data) => {
      let rs = get(data, 'displayRouter', []);
      let dom = '';
      map(rs, (r, i) => {
        let city = r;
        let icon = 'icon-arrow text-blue px-1'
        let end = rs.length - 1;
        let iconClassName;
        iconClassName = i === end ? undefined : icon;
        dom += `<span>
						${city}
            <i class=${iconClassName} ></i>
					</span>`
      });
      return `<div>${dom}</div>`
    },
  },
  mark: {
    formatter: (data) => {
      let mark = get(data, 'mark');
      let vip = get(mark, 'V');
      let delay = get(mark, 'D');
      let v = vip ? 'V' : null;
      let d = delay ? 'D' : null;
      let markClassName = `text-white ms-b border-radius text-center rounded-sm px-1 mr-1 font-sm bg-gray-c9c font-weight-bold ${vip && 'active'}`
      let markClassNameD = `text-white ms-b border-radius text-center rounded-sm px-1 mr-1 font-sm bg-red font-weight-bold ${vip && 'active'}`
      markClassNameD = d ? markClassNameD : markClassName;
      let markClassNameV = `text-white ms-b border-radius text-center rounded-sm px-1 mr-1 font-sm bg-orange font-weight-bold ${vip && 'active'}`
      markClassNameV = v ? markClassNameV : markClassName;
      return (
        `<div>
          <span class="${markClassNameD}">D</span>
          <span class="${markClassNameV}">V</span>
        </div>`
      );
    }
  },
  displayRunway: {
    formatter: (data) => {
      let displayRunway = get(data, 'displayRunway', null);
      let runway = get(data, 'runway', null);
      runway = runway === '--' ? null : runway;
      let expectRunWay = get(data, 'expectRunWay', null);
      expectRunWay = expectRunWay === '--' ? null : expectRunWay;
      let finalRunway = displayRunway === '--' ? null : displayRunway;
      return (
        `<div className="runway align-self-center">${finalRunway ? `<span class='font-xs font-YaheiBold text-white text-weight-normal letter-icon mx-1 rounded-1 bg-blue ms-b ${!runway && expectRunWay && 'bg-expectRunWay'}'>${finalRunway}</span>` : DISPLAYNULL}</div>`
      );
    },
  },
  displayPreATDOrETD: {
    formatter: (data) => {
      // let displayPreATDOrETD = get(data, 'displayPreATDOrETD');
      // let times = displayPreATDOrETD.split('/');
      //[预计, 实际] 数组
      //如果预计和实际都为 null , 隐藏图标
      //有实际显示实际, 没有实际显示预计, 没有预计显示--
      let times = get(data, 'displayPreATDOrETD');
      let iconClassName = classNames('', {
        'd-none': !times || (!get(times, '0') && !get(times, '1')),
        'etd-font': times && get(times, '0') && !get(times, '1'),
        'ata-font': times && get(times, '1'),
      });
      // let iconClassName = `
      //   ${!times || (!get(times, '0') && !get(times, '1')) && 'd-none'}
      //   ${times && get(times, '0') && !get(times, '1') && 'etd-font'}
      //   ${times && get(times, '1') && 'ata-font'}`

      // let iconClassName = classNames('fa', { 'icon-ata text-cirblue': times.length > 1, 'icon-etd text-cirorange': times.length === 1 });
      return (
        `<span class="d-inline-block">
					<i class="${iconClassName}" ></i>
					<span class="mx-2">${get(times, '1') || get(times, '0') || DISPLAYNULL}</span>
				</span>`
      );
    },
  },
  seat: {
    formatter: (data) => {
      let { isSeatConflict, seat } = data;
      // isSeatConflict = true;
      let c = isSeatConflict && isSeatConflict !== '--' && isSeatConflict.length > 0;
      let classname = classNames({ 'd-block bg-red text-white': c });
      return (
        `<span class="${classname}" title="${isSeatConflict}">
					${seat}
				</span>`
      );
    },
  },
  milestoneStatusCn: {
    formatter: (item) => {
      let milestoneStatusCn = get(item, 'milestoneStatusCn', '--');
      let milestoneStatusType = get(item, 'milestoneStatusType');
      let color = '#fff';
      if (milestoneStatusType === 'elec') {
        // 电子进程单
        color = '#f0f';
      } else if (milestoneStatusType === 'guarantee') {
        // 地面保障
        color = '#0041ff';
      }
      return(
        `
        <div style="color: ${color}">${milestoneStatusCn}</div>
        `
      )
    }
  },
  isDelay: {
    formatter: (item) => {
      return item.isDelay === true ? '是' : '否';
    }
  }
}
