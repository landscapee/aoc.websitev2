<template>
  <div>
    <div class="flightByHour">
      <div class="flightControl">
        <div class="flightControlBox ControlBoxSwitch">
          <span @click="switchMovement('A')" :style="{background: movement === 'A' ? '#407DFF' : '#fff'}">
            <i :style="{ color: movement === 'A' ? '#fff' : '#333' }" class="iconfont icon-jiangla1"/>
          </span>
          <span @click="switchMovement('D')" :style="{ background: movement === 'D' ? '#407DFF' : '#fff' }">
            <i :style="{ color: movement === 'D' ? '#fff' : '#333' }" class="iconfont icon-qifei1"/>
          </span>
        </div>

        <div class="flightControlBox checkStatus">
          <div @click="changeTakeOffNormalStatus(v.name)" :class="takeOffNormalStatus.includes(v.name) ? '' : 'checkOut'" v-for="v in normalStatus">
            <span :style="{ background: v.bgColor }"/>
            {{ v.name }}
          </div>
        </div>

        <div class="flightControlBox checkStatus">
          <div @click="changeFlightStatus(v)" v-for="v in statusCfg[movement]" :class="movement === 'A' ? (flightStatusA.includes(v) ? '' : 'checkOut') : flightStatusD.includes(v) ? '' : 'checkOut'">
            <span :style="{ background: flightStateColor[v] }"/>
            {{ v }}
          </div>
        </div>

        <div class="flightControlBox">
          <el-dropdown @command="v => updateDropdown(v, 'direction')" trigger="click">
          <span class="el-dropdown-link">
              {{ directionCfg[direction] }}<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :key="key + item + '4'" :command="key" v-for="(item, key) in directionCfg">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown class="ml-1" @command="v => updateDropdown(v, 'airline')" trigger="click">
          <span class="el-dropdown-link">
              {{ airLines[airline] }}<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :key="key + item + '3'" :command="key" v-for="(item, key) in airLines">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown class="ml-1" @command="v => updateDropdown(v, 'day')" trigger="click">
          <span class="el-dropdown-link">
              {{ days[day] }}<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :key="key + item + '2'" :command="key" v-for="(item, key) in days">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown class="ml-1" @command="v => updateDropdown(v, 'city')" trigger="click">
          <span class="el-dropdown-link">
              {{ citys[city] }}<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
          </span>
            <el-dropdown-menu slot="dropdown" class="cityDropDown">
              <el-dropdown-item :key="key + item + '1'" :command="key" v-for="(item, key) in citys">{{ item }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div
              @click="showMaxTotal = !showMaxTotal"
              class="flightControlBox flightEnd cursor">
          <img title="推荐放行架次" :src="showMaxTotal ? eyes1 : eyes2" alt="" />
        </div>
        </div>



      </div>
      <div class="statusHelp">
        <img @click="showStatusHelp = !showStatusHelp" :src="statusHelp" class="cursor statusHelpImg" alt="" />
        <div :class="classNames('statusHelpBox', { 'h-0': !showStatusHelp })">
          <div class="triangleBorder" />
          <div class="explain">
            <img :src="gantan" alt="" />
            <span class="">航班状态备注说明</span>
          </div>
          <div class="descriptions">
            <div class="descriptionItem">
              <div class="flight finish">CA6666</div>
              <span class="statusDes">正常</span>
            </div>
            <div class="descriptionItem">
              <div class="flight abnormal">CA6666</div>
              <span class="statusDes">不正常</span>
            </div>
            <div class="descriptionItem">
              <div class="flight unCalculate">CA6666</div>
              <span class="statusDes">不计算</span>
            </div>
            <div class="descriptionItem gutter">
              <div class="flight flightSuggest" />
              <span class="statusDes">推荐调整时刻</span>
            </div>
            <div class="descriptionItem">
              <div class="flight flightSuggest">CA6666</div>
              <span class="statusDes">计划调整后</span>
            </div>
            <div class="descriptionItem">
              <div class="flight actualAdjusted">
                <div class="iconStart" />CA6666
              </div>
              <span class="statusDes">实际调整后</span>
            </div>
            <div class="descriptionItem">
              <div class="flight planAdjust">CA6666</div>
              <span class="statusDes">计划调整前</span>
            </div>

            <div class="descriptionItem">
              <div class="flight actualAdjust">CA6666</div>
              <span class="statusDes">实际调整前</span>
            </div>
            <div class="descriptionItem">
              <div class="flight planReduce">CA6666</div>
              <span class="statusDes">计划调减</span>
            </div>
            <div class="descriptionItem">
              <div class="flight actualReduce">
                <div class="iconStartRed" />CA6666
              </div>
              <span class="statusDes">实际调减</span>
            </div>

            <div class="descriptionItem gutter">
              <div class="flight closeDoor">CA6666</div>
              <span class="statusDes">关闭</span>
            </div>

            <div class="descriptionItem">
              <div class="flight boarding">CA6666</div>
              <span class="statusDes">登机</span>
            </div>

            <div class="descriptionItem">
              <div class="flight preTakeoff">CA6666</div>
              <span class="statusDes">前方起飞</span>
            </div>

            <div class="descriptionItem">
              <div class="flight aBoarding">CA6666</div>
              <span class="statusDes">催促登机</span>
            </div>

            <div class="descriptionItem">
              <div class="flight arrive">CA6666</div>
              <span class="statusDes">到达</span>
            </div>

            <div class="descriptionItem">
              <div class="flight delay">CA6666</div>
              <span class="statusDes">延误</span>
            </div>

            <div class="descriptionItem">
              <div class="flight cancel">CA6666</div>
              <span class="statusDes">取消航班</span>
            </div>

            <div class="descriptionItem flex-items-center">
              <div class="flight maxTakeOff" />
              <span class="statusDes">最大起降架次</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flightBox d-flex mx-2 flex-items-end">
<!--        宽度81只是为了撑开空列 实际以flex: 1 为准 -->
        <div style="width: 81px" v-for="(item, index) in 24" class="flightColumn flex-auto text-center">
          <div v-for="(flightBy5Min, key) in getFlightsBy5Min(index)">
            <div
                @click="$FlightDetais.open({flightId:flight.flightId},true)"
                v-for="flight in flightBy5Min"
                :title="flight.preScheduleTime ? (flight.preScheduleTime || []).map(time => moment(time).format('HH:mm')).join(',') : ''"
                :class="getFlightClass(flight)">
              <div v-if="get(flight,'preScheduleTime.length', 0) > 0 && adjustReduceFlights.indexOf(flight.flightId) > -1" class="iconStart" />
              <div v-if="flight.flightStatusText === '取消' && adjustReduceFlights.indexOf(flight.flightId) > -1" class="iconStartRed" />
              {{flight.flightNo }}
            </div>
            <div class="flight timeGutter">
              <span class="line" />
              {{ key }}
              <span class="line" />
            </div>
          </div>
        </div>
      </div>
      <div class="time d-flex mx-2">
        <div class="flex-auto text-center fo" v-for="(item, index) in 24">
          {{ ('0' + index).slice(-2) + ':00' }}
          <small style="color: #00b9ee" class="ms-b">{{ (flights[item] || []).length || 0 }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 状态
import moment from "moment";
import {memoryStore} from "@/worker/lib/memoryStore";
import PostalStore from "@ui_lib/postalStore";
import {groupBy, pull, get} from "lodash";
import {displayTimeHour} from "@/lib/helper/utility";
import classNames from 'classnames';
import gantan from 'ui/assets/img/gantan.svg';
import statusHelp from 'ui/assets/img/statusHelp.svg';
import eyes1 from 'ui/assets/img/eyes1.svg';
import eyes2 from 'ui/assets/img/eye2.svg';

let postalStore = new PostalStore()

const normalStatus = [{name: '正常', bgColor: '#A0AFC8'}, {name: '不正常', bgColor: '#F89401'}, {
  name: '不计算',
  bgColor: '#FFFFFF'
}];
// 状态配置
const statusCfg = {
  A: ['取消', '延误', '前方起飞', '到达', '其他'],
  D: ['取消', '延误', '登机', '催促登机', '关闭', '其他'],
};
export const flightStateColor = {
  前方起飞: '#9E72FF',
  到达: '#1D93F2',
  登机: '#2a42ff',
  催促登机: '#b8a400',
  关闭: '#00950C',
  取消: '#BC1D1D',
  延误: '#EE4469',
  起飞: '#B3C0D6',
  到下站: '#B3C0D6',
  正常: '#ffffff',
  备降: '#F89401',
  返航: '#F89401',
  其他: '#878684',
};
// 方向
const directionCfg = { All: '全部方向', 西安: '西安', 贵阳: '贵阳', 重庆: '重庆', 拉萨: '拉萨', 兰州: '兰州', 昆明: '昆明' };
// 航空公司
const airLines = { All: '全部航司', CA: '中国航空', '3U': '四川航空', MU: '东方航空', CZ: '南方航空', EU: '成都航空', TV: '西藏航空', ZH: '深圳航空', '8L': '祥鹏航空' };
let now = memoryStore.getItem('global').now
let days = {
  '1': '明天',
  0: '今天',
  '-1': '昨天',
  '-2': moment(now)
      .subtract(2, 'days')
      .date(),
  '-3': moment(now)
      .subtract(3, 'days')
      .date(),
  '-4': moment(now)
      .subtract(4, 'days')
      .date(),
  '-5': moment(now)
      .subtract(5, 'days')
      .date(),
};
export default {
  name: "flightByHour",
  data() {
    return {
      get,
      statusHelp,
      gantan,
      eyes2,
      eyes1,
      classNames,
      normalStatus,
      statusCfg,
      flightStateColor,
      airLines,
      directionCfg,
      days,
      movement: 'D',
      direction: 'All',
      airline: 'All',
      day: 0,
      citys: [],
      city: 'All',
      flights: [],
      flightStatusA: [],
      flightStatusD: [],
      takeOffNormalStatus: [],
      showStatusHelp: false,
      adjustReduceFlights: [],
      showMaxTotal: false
    }
  },
  mounted() {

    postalStore.sub('FlightByHours.Sync', data => {
      this.flights = data
    })
    this.$request.get('delays', 'Flight/FlightSchedule/allAirport').then(res => {
      this.citys = {All: '全部机场',...res.data}
    })
    postalStore.pub('Page.FlightAdjustment.Start', '');
  },
  beforeDestroy() {
    postalStore.pub('Page.FlightAdjustment.Stop', '')
    postalStore.unsubAll()
  },
  methods: {
    moment,
    getFlightClass(f){
      return classNames('flight', {
        // cancel: f.cancel,
        cancel: f.flightStatusText === '取消',
        // finish: ac && ac !== '' && ac && ac !== '--',
        finish: f.takeOffNormalStatusText === '正常',
        unCalculate: f.takeOffNormalStatusText === '不计算',
        abnormal: f.takeOffNormalStatusText === '不正常',
        delay: f.flightStatusText === '延误',
        boarding: f.flightStatusText === '登机',
        aBoarding: f.flightStatusText === '催促登机',
        closeDoor: f.flightStatusText === '关闭',
        preTakeoff: f.flightStatusText === '前方起飞',
        arrive: f.flightStatusText === '到达',
        adjustStatus: f.adjustStatus, // 调整
        reduceStatus: f.reduceStatus, // 调减
         // TODO 等待调整调减完成
        // actualReduce: f.flightStatusText === '取消' && adjustReduceFlights.indexOf(parseInt(f.flightId)) > -1, // 实际调减
        // planReduce: some(this.state.reduceFlights, (item) => item.flightId == f.flightId), // 计划调减
        // planAdjust: some(this.state.adjustFlights, (item) => item.flightId == f.flightId), // 计划调整前
      });
    },
    updateDropdown(v, type){
      this[type] = v;
      if (type === 'day'){
        postalStore.pub('Worker', 'FlightsByHours.GetOthers', v);
      }else {
        this.flightStatusQuery()
      }

    },
    // 飞机状态
    changeTakeOffNormalStatus(status) {
      let newStatus = Object.assign([], this.takeOffNormalStatus);
      let statusTrue = newStatus.includes(status);
      if (statusTrue) {
        newStatus = pull(newStatus, status);
        this.takeOffNormalStatus = newStatus;
        this.flightStatusQuery()
      } else {
        newStatus.push(status);
        this.takeOffNormalStatus = newStatus;
        this.flightStatusQuery()
      }
    },

    // 状态查询
    changeFlightStatus(status) {
      let newStatusA = Object.assign([], this.flightStatusA);
      let newStatusD = Object.assign([], this.flightStatusD);
      let statusTrueA = newStatusA.includes(status);
      let statusTrueD = newStatusD.includes(status);
      if (this.movement === 'A') {
        if (statusTrueA) {
          newStatusA = pull(newStatusA, status);
          this.flightStatusA = newStatusA
          this.flightStatusQuery()
        } else {
          newStatusA.push(status);
          this.flightStatusA= newStatusA
          this.flightStatusQuery()
        }
      } else {
        if (statusTrueD) {
          newStatusD = pull(newStatusD, status);
          this.flightStatusD = newStatusD
          this.flightStatusQuery()
        } else {
          newStatusD.push(status);
          this.flightStatusD = newStatusD
          this.flightStatusQuery()
        }
      }
    },
    switchMovement(movement){
      this.movement = movement;
      this.flightStatusQuery()
    },
    flightStatusQuery(){
      let searchQueries = [{ movement: { $eq: this.movement } }];
      let statusParamsTemp = this.movement === 'A' ? this.flightStatusA : this.flightStatusD;
      let statusParams = Object.assign([], statusParamsTemp);
      let flightStatusTextFilter = {};
      if (statusParams.length > 0) {
        if (statusParams.indexOf('其他') > -1) {
          pull(statusParams, '其他');
          let allStatus = Object.assign([], statusCfg[this.movement]);
          pull(allStatus, '其他');
          // flightStatusTextFilter = { $nin: allStatus, $in: statusParams };
          flightStatusTextFilter = {
            $or: [
              {
                $nin: allStatus,
              },
              {
                $in: statusParams,
              },
            ],
          };
        } else {
          flightStatusTextFilter = { $in: statusParams };
        }
        searchQueries.push({ flightStatusText: flightStatusTextFilter });
      }
      if (this.takeOffNormalStatus.length > 0) {
        searchQueries.push({ takeOffNormalStatusText: { $in: this.takeOffNormalStatus } });
      }
      this.direction !== 'All' && searchQueries.push({ direction: { $eq: this.direction } });

      this.airline !== 'All' && searchQueries.push({ flightNo: { $regex: this.airline } });

      this.city !== 'All' && searchQueries.push({ router: { $regex: this.city } });
      console.log(searchQueries)
      postalStore.pub('Worker', 'flightsByHours.Filter', { searchQueries });
    },
    getFlightsBy5Min(time){
      return groupBy(this.flights[time], (item) => displayTimeHour(item.scheduleTime));
    }
  }
}
</script>

<style lang="scss" scoped>
.flightByHour {
  position: relative;
  background-image: url("~@/ui/assets/img/flightByHourBg.jpg");
  background-size: contain;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  min-height: 100%;
  height: auto!important;

  .statusHelp{
    position: absolute;
    top:20px;
    right: 19px;
    .statusHelpImg{
      width: 28px;
    }
    .h-0{
      transform: scale(0);
    }
    .statusHelpBox{
      width: 284px;
      height: 740px;
      opacity: 1;
      background: #111926;
      border: 1px solid #25395c;
      box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.50);
      position: absolute;
      top:42px;
      right: 0;
      padding: 30px 22px;
      color: #fff;
      z-index: 2;
      transition: all .5s;
      transform-origin: 100% 0%;
      .explain{
        margin-bottom: 22px;
        img{
          width: 16px;
          margin-right: 7px;
        }
        span{
          font-size: 16px;
        }
      }
      .descriptions{
        padding-left: 22px;
        .gutter{
          margin: 0;
          margin-top: 20px;
        }
        .descriptionItem{
          display: flex;
          margin-bottom: 10px;
          .flight{
            width: 81px;
            text-align: center;
            margin-right: 19px;
          }
          .statusDes{
            font-size: 16px;
          }
        }
      }
    }
    .triangleBorder{
      height: 22px;
      width: 22px;
      background-color: #111926;
      border-width: 1px 1px 0 0;
      border-color: #25395c;
      border-style: solid;
      transform: rotate(-45deg);
      position: absolute;
      right: 4.5px;
      top: -11px;
    }
  }
  .el-dropdown-link{
    padding: 2px 5px;
    background-color: #2a4d7f;
    border-radius: 3px;
  }
  // 航班控制按钮
  .flightControl {
    position: absolute;
    top: 10px;
    padding: 2px 8px;
    height: 36px;
    background: rgba(24, 41, 73, 1);
    border-radius: 27px;
    display: flex;
    align-items: center;
    place-content: center space-between;
    flex-wrap: nowrap;

    .flightControlBox {
      margin-left: 20px;
      display: flex;
      align-items: center;
      place-content: center space-between;
      flex-wrap: nowrap;
      color: #FFF;
      font-size: 10px;
      // 最后一个按钮
      .flightEnd{
        height: 28px;
        width: 28px;
        border-radius: 50%;
        background: #0182e7;
        display: flex;
        align-items: center;
        place-content: center;
        img{
          height: 100%;
        }
      }
      .dropdown-toggle {
        font-size: 10px;
      }

      .dropdown-menu {
        max-height: 900px;
        overflow-y: auto;
        //@extend .beauty-scroll
      }
    }

    .ControlBoxSwitch {
      margin-left: 0;
      width: 70px;
      height: 25px;
      background: rgba(255, 255, 255, 1);
      border-radius: 14px;
      overflow: hidden;

      .iconfont {
        font-size: 14px;
      }

      span {
        width: 50%;
        line-height: 25px;
        cursor: pointer;
        text-align: center;
        height: 100%;
      }
    }

    // 状态
    .checkStatus {
      display: flex;
      align-items: center;
      place-content: center space-between;
      flex-wrap: nowrap;

      div {
        display: flex;
        align-items: center;
        place-content: center space-between;
        flex-wrap: nowrap;
        height: 23px;
        margin: 0 2px;
        padding: 2px 7px;
        cursor: pointer;
        border: 1px solid #0182E7;
        border-radius: 2px;
        background: rgba(74, 144, 226, 0.35);
        color: #C2DEFF;
        font-size: 12px;

        div:nth-of-type(1) {
          background: rgba(215, 215, 215, 0.24);
          border-radius: 2px;
          border: 1px solid rgba(109, 109, 109, 1);
        }

        span {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 4px;
        }

        small {
          display: inline-block;
        }
      }

      .checkOut {
        color: #D7D7D7;
        background: rgba(215, 215, 215, 0.24);
        border: 1px solid #333;
      }
    }

    // 状态
    .flightStatus {
      display: flex;
      align-items: center;
      place-content: center space-between;
      flex-wrap: nowrap;

      div {
        display: flex;
        align-items: center;
        place-content: center space-between;
        flex-wrap: nowrap;
        height: 23px;
        margin: 0 2px;
        padding: 2px 7px;
        cursor: pointer;
        border: 1px solid #0182E7;
        border-radius: 2px;
        background: rgba(74, 144, 226, 0.35);
        color: #C2DEFF;

        span {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 4px;
        }

        small {
          display: inline-block;
        }
      }

      .checkOut {
        color: #D7D7D7;
        background: rgba(215, 215, 215, 0.24);
        border: 1px solid #333;
      }
    }

    // 下拉框
    .flightDropDown {
      .btn-outline-secondary {
        color: #c1ddfe;
        background-color: #2a4d7f;
        background-image: none;
        border-color: #0182e7;
        margin: 0 2px;
      }
    }

    // 最后一个按钮
    .flightEnd {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      background: #0182e7;
      display: flex;
      align-items: center;
      place-content: center;
    }

  }

  .flightBox{
    width: 100%;
    display: flex;
    // align-items: flex-end;
    place-content: flex-end space-between;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-top: 54px;
    .flightColumn{
      padding: 0 2px;
    }
    .timeGutter{
      background-color: transparent;
      display: flex;
      align-items: center;
      color: #c7b23a;
      .line{
        display: flex;
        flex: 1;
        height: 1px;
        background-color: #c7b23a;
      }
    }
    .suggestDetailBox{
      color: #fff;
      bottom:10px;
      position: absolute;
      width: 100%;
      opacity: 1;
      background: #25395c;
      border-radius: 5px;
      box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.50);
      .detailItem{
        display: flex;
        align-items: center;
        flex-direction: column;
        border-bottom: 1px solid #1e2f46;
        color: rgba(255,255,255,.6);
        font-size: 14px;
        padding: 4px 0;
      }
      .detailTime{
        color: rgba(49,114,252,1);
        font-size: 16px;
      }
      .dot{
        width: 4px;
        height: 4px;
        background: rgba(49,114,252,1);
        border-radius: 2px;
        display: inline-block;
        margin-right: 6px;
      }
    }
    .triangle{
      position: absolute;
      bottom: -10px;
      left: 50%;
      width: 0;
      height: 0;
      border-width: 10px 10px;
      border-style: solid;
      transform: rotate(180deg) translateX(50%);
      border-color: transparent transparent #25395c;
    }
  }

  .flight{
    // width:77px;
    height:22px;
    line-height: 22px;
    background: rgba(0, 238, 255, 0.2);
    color:#fff;
    margin: 1Px;
    font-size: 14px;
    cursor: default;
    box-sizing:border-box;
    white-space: nowrap;
    // border-width: 0px 4px 0px 4px !important;
    &:hover{
      box-shadow: 0px 0px 5px #00B9EEFF;
    }
    .preScheduleTime{
      $triangleSize:10px;
      width: 10px;
      height: 10px;
      background: #FFC107FF;
      position: absolute;
      .iconfont{
        font-size:8px;
        color:#333;
        margin-top: 2px;
        position: absolute;
        margin-left: -3px;
        z-index: 1;
      }
      &:before{
        content: "";
        //position: absolute;
        //bottom: -9em;
        left: 0;
        width: 0;
        height: 0;
        margin-top: 6px;
        border-top: $triangleSize solid #FFC107FF;
        border-right: $triangleSize solid transparent;
        position: absolute;
      }
      &:after{
        content: "";
        //position: absolute;
        //bottom: -9em;
        right: 0;
        width: 0;
        height: 0;
        border-top: $triangleSize solid #FFC107FF;
        border-left: $triangleSize solid transparent;
        position: absolute;
        margin-top: 6px;

      }
    }
    .iconStart{
      float: left;
      width: 9px;
      height: 14px;
      background-image: url("~@/ui/assets/img/preScheduleTime.svg");
      background-size: 14px 20px;
      background-position: -2px -3px;
    }
    .iconStartRed{
      float: left;
      width: 9px;
      height: 14px;
      background-image: url("~@/ui/assets/img/icon_mark-red.svg");
      background-size: 14px 20px;
      background-position: -2px -3px;
    }
  }

  .finish{
    background: rgba(186, 205, 230, 0.5);
    color:rgba(34,34,34,1);
    &:hover{
      box-shadow: 0px 0px 5px #fff;
    }
  }
  .abnormal{
    background:rgba(248,148,1,1);
    color:rgba(34,34,34,1);
    &:hover{box-shadow: 0px 0px 5px rgb(248, 186, 0);}
  }
  .unCalculate {
    background: #fff;
    color: rgba(34, 34, 34, 1);
    &:hover {
      box-shadow: 0px 0px 5px #fff;
    }
  }
  .delay{
    //background: #EE4469;
    border-left:2Px solid #EE4469;
    border-right:2Px solid #EE4469;

  }
  .boarding{
    // background: #2a42ff;
    border-left:2Px solid #2a42ff ;
    border-right:2Px solid #2a42ff ;
    //&:before{
    //  content: "";
    //  width:10px;
    //  background: #2a42ff;
    //}

  }
  .aBoarding{
    border-left:2Px solid #b8a400;
    border-right:2Px solid #b8a400;
  }
  .closeDoor{

    border-left:2Px solid #00950C;
    border-right:2Px solid #00950C;

  }
  .preTakeoff{

    border-left:2Px solid rgb(158, 114, 255);
    border-right:2Px solid rgb(158, 114, 255);

  }
  .arrive{

    border-left:2Px solid rgb(29, 147, 242);
    border-right:2Px solid rgb(29, 147, 242);

  }
  .arrive{

    border-left:2Px solid rgb(29, 147, 242);
    border-right:2Px solid rgb(29, 147, 242);

  }
  .maxTakeOff{
    height: 1px;
    background-color: rgba(233, 54, 112, 0.5);
  }
  .adjustStatus{
    border-top:1Px solid rgba(248,148,1,1);
    border-bottom:1Px solid rgba(248,148,1,1);
  }
  .reduceStatus{
    border-top:1Px solid #EE4469;
    border-bottom:1Px solid #EE4469;
  }

  .cancel{
    color:rgba(245, 34, 45, 1);
    &:hover{box-shadow: 0px 0px 5px red;}
  }
  .cancel2{
    border:1px solid rgba(245, 34, 45, 1);
    &:hover{ box-shadow: 0px 0px 5px red;}
  }
  .flightSuggest{
    border: 1px dashed #979797;
    background-color: transparent;
    &:hover{ box-shadow: 0px 0px 5px #979797;}
  }
  .actualAdjusted{
    background: #203149;
    &:hover{ box-shadow: 0px 0px 5px #203149;}
  }
  .planAdjust{
    border: 1px solid #f89401;
    //background: #203149;
    color: #f89401;
    &:hover{ box-shadow: 0px 0px 5px #f89401;}
  }
  .actualAdjust{
    border: 1px solid #492C00;
    background: rgba(0,0,0,0.5);
    color: #492C00;
    &:hover{ box-shadow: 0px 0px 5px #492C00;}
  }
  .planReduce{
    background: rgba(160,175,200,.4);
    color: #570005;
    &:hover{ box-shadow: 0px 0px 5px #570005;}
  }
  .actualReduce{
    background: #203149;
    color: #f5222d;
    &:hover{ box-shadow: 0px 0px 5px #f5222d;}
  }

  // 底部时间
  .time {
    width: 100%;
    height: 24px;
    background: rgba(0, 0, 0, 1);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
    font-family: '';
    color: #fff;
  }
}
</style>
<style lang="scss">
 .cityDropDown{
   height: 500px;
   overflow: auto;
   top: 0.5rem;
 }
</style>