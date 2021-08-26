<template>
  <div class="flightHistory">
    <div class="toolBar">
      <ol>
        <li>
          <router-link to="/flight">航班动态</router-link>
        </li>
        <li class="historyButton">航班历史</li>
      </ol>
      <div class="rightTool">
        <div class="tabs">
          <el-tabs @tab-click="tabClick" v-model="activeTab" tab-position="bottom">
            <el-tab-pane v-for="item in tabBarOptions" :name="item.key" :key="item.key" :label='item.name'>
          <span slot="label"> {{item.name}}
            <span class="tab-item-num">{{flightData[item.key]}}</span>
          </span>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="timePicker">
          <el-date-picker @change="timeChange"
                          v-model="time"
                          type="datetimerange"
                          range-separator="-"
                          size="mini"
                          format="yyyy-MM-dd HH:mm"
                          placeholder="选择日期时间"
                          align="right"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <el-input @input="searchInputChange" placeholder="航班号|机位|机尾号|登机口|航线" v-model="searchValue" class="input-with-search">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="toggleAdvance" title="高级搜索" type="info" size="mini"><i class="iconfont icon-gaojisousuo"/></el-button>
        <el-button @click="exportExel"  title="导出当前结果" type="info" size="mini"><i class="iconfont icon-daochuexcel"/></el-button>
        <router-link to="/flight" class="back"><el-button size="mini" type="primary">返回</el-button></router-link>
      </div>
    </div>
    <flightTable :isHistory="true" :setColumns="setColumns" :flights="flightData.flights" :columns="columns">
    </flightTable>
    <div class="paginationHistory">
      <el-pagination
          :current-page="pageIndex"
          @current-change="pageChange"
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {memoryStore} from "@/worker/lib/memoryStore";
import _, {cloneDeep, compact, extend, filter, toUpper} from "lodash";
import PostalStore from "@/ui/lib/postalStore";
import {getListHeader} from "@/ui/views/flight/components/handleColumn";
import {map} from "lodash";
import flightTable from "@/ui/views/flight/components/flightTable/flightTable";
import ColumnsDefine from "@/ui/views/flight/columnDefine";
import ColumnDefineHistory from "@/ui/views/flight/columnDefineHistory";
import {sortAble} from "@/ui/views/flight/historyConfig";
import axios from "axios";

let postalStore = new PostalStore();

let tabBarOptions = [
  { name: '全部', key: 'total', option: null },
  { name: '进港', key: 'movementA', option: { movement: 'A' } },
  { name: '出港', key: 'movementD', option: { movement: 'D' } },
  { name: '返航', key: 'return', option: { return: true } },
  { name: '备降', key: 'alternate', option: { alternate: true } },
  { name: '取消', key: 'cancel', option: { cancel: true } },
  // { name: '关注', key: 'concern', option: { concern: true } },
  { name: '备降外场', key: 'isAlternateLandingFlight', option: { alternateLanding: true } },
  { name: '客运', key: 'isPassagerFlight', option: { passenger: true } },
  { name: '始发', key: 'originated', option: { original: true } },
  // { name: '可执行积压', key: 'isExecutableFlight', option: { isExecutableFlight: true } },
];
let opt, tempAdvance, term, sort, date, search;
export default {
  name: "flightHistory",
  components: {flightTable},
  data(){
    let _this = this;
    let nowTime = memoryStore.getItem('global').now
    let now = moment(nowTime).startOf("day");
    return{
      activeTab: 'total',
      tabBarOptions,
      searchValue: '',
      time:[moment(now).subtract(2, 'd').format(), moment(now).subtract(1, 'd').format()],
      pageSize: 21,
      pageIndex: 1,
      flightData: {},
      columns: [],
      total: 1,
      pickerOptions: {
        shortcuts: [
        //   {
        //   text: '昨天',
        //   onClick(picker) {
        //     _this.timetext = '昨天';
        //     _this.timetextFlag = true;
        //     let start = moment(now).subtract(1,'d').startOf('day').format()
        //     let end = moment(now).startOf('d').format()
        //     picker.$emit('pick', [start, end]);
        //   }
        // },
          {
          text: '前天',
          onClick(picker) {
            let start = moment(now).subtract(2,'d').startOf('day').format()
            let end = moment(now).subtract(1, 'd').startOf('day').format()
            picker.$emit('pick', [start, end]);
          }
        },
          // {
          //   text: '运营日昨天',
          //   onClick(picker) {
          //     let start = moment(now).subtract(1,'d').startOf('day').set('hour', 4).format()
          //     let end = moment(now).startOf('day').set('hour', 4).format()
          //     picker.$emit('pick', [start, end]);
          //   }
          // },
          {
            text: '运营日前天',
            onClick(picker) {
              let start = moment(now).subtract(2, 'days').set('hour', 4).format()
              let end = moment(now)
                  .subtract(1, 'days')
                  .set('hour', 4).format()
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '本周',
            onClick(picker) {
              let start = moment(now).startOf('week').format()
              let end = moment(now)
                  .startOf('week')
                  .add(7, 'days').format()
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '过去七天',
            onClick(picker) {
              let start = moment(now).subtract(6, 'days').format()
              let end = moment(now).format()
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '过去30天',
            onClick(picker) {
              let start = moment(now).subtract(29, 'days').format()
              let end = moment(now).format()
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '这个月',
            onClick(picker) {
              let start = moment(now).startOf('month').format()
              let end = moment(now).startOf('month').add(1, 'M').format()
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              let start = moment(now).subtract(1, 'month').startOf('month').format()
              let end = moment(now).startOf('month').format()
              picker.$emit('pick', [start, end]);
            }
          },
        ]
      },
    }
  },
  mounted() {
    let header = getListHeader();
    let headerArray = map(header, item => {return _.pick(item, ['text' , 'key', 'reference', 'referenceTo'])})
    postalStore.pub('Page.FlightHistory.Start', '');
    // 获取运营状态options
    this.$request.get('flight', 'Flight/status').then(res => {
      if (res.code === 200){
        this.$store.commit('flight/updateFlightRemoteOptions', {statusOptions: res.data})
      }

    })

    postalStore.sub('Flight.GetHeader.Res', (newColumns) => {
      memoryStore.setItem('global', {flightHeader: newColumns});
      this.setColumns(getListHeader())
    });

    postalStore.sub('Flight.GetHistory.Response', data => {
      this.total = data.total
      data.flights = map(data.flights, (item, index) => ({...item, flightIndex : (this.pageIndex -1) * this.pageSize + index + 1}) )
      this.flightData = data
    })
    this.setColumns(header)
    this.sendFilterOpt()
    // 同步搜索信息
    postalStore.sub('Web', 'FlightHeaderSearch.Sync', data => {
      tempAdvance = data;
      this.pageIndex = 1
      this.sendFilterOpt()
    })
    // 同步排序信息
    postalStore.sub('Web', 'SendFilterOpt', sort => {
      this.sort = sort?.sort
      this.sendFilterOpt()
    })
  },

  beforeDestroy() {
    this.$store.commit('flight/toggleShowAdvance', false)
    postalStore.pub('Page.FlightHistory.Stop', '');
    postalStore.unsubAll()
  },
  methods: {
    exportExel(){
      let flightHeaders = map(this.columns || [], (h) => {
        if (!h.hidInHistory) return { headerName: h.text, headerKey: h.key };
      });

      let http = window.httpConfig.flight
      let headers = { 'Content-Type': 'application/json', responseType: 'arraybuffer' };
      let msg = {
        // pageIndex: this.pageIndex,
        // pageSize: this.pageSize,
        startTime: moment(this.time[0]).format('x'),
        endTime: moment(this.time[1]).format('x'),
        headers: compact(flightHeaders),
      };
      this.opt && extend(msg, this.opt);
      term && extend(msg, term);
      this.date && extend(msg, this.date);
      this.search && extend(msg, this.search);
      this.sort && extend(msg, {orderKey: this.sort.key, order: this.sort.order});
      tempAdvance && extend(msg, {advanceSearch: tempAdvance});
      axios({
        method: 'post',
        headers,
        url: `http://${http.host}:${http.port}/${http.path}/Flight/search/exportHistory`,
        data: msg,
        responseType: 'arraybuffer',
      }).then(res => {
        let blob = new Blob([res], { type: 'type: "application/vnd.ms-excel"' });
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = objectUrl;
        a.download = '航班历史' + moment(memoryStore.getItem('global').now).format('YYYYMMDDHHmm') + '.xls';
        a.click();
        document.body.removeChild(a);
      })
    },
    toggleAdvance(){
      this.$store.commit('flight/toggleShowAdvance', !this.$store.state.flight.showAdvance)
    },
    pageChange(v){
      this.pageIndex = v;
      this.sendFilterOpt()
    },
    tabClick(option){
      let sel = _.find(this.tabBarOptions, item => item.name === option.label)
      this.opt = sel.option;
      this.pageIndex = 1;
      this.sendFilterOpt()
    },
    searchInputChange(v){
      if (this.timer){
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.search = {
          filed: 'all',
          value: toUpper(v),
        };
        this.pageIndex = 1
        this.sendFilterOpt()
      },400);

    },
    setColumns: function (Columns) {
      console.log(Columns.filter(item => item.key === 'delayType'))
      let newColumns = _.map(Columns, (h) => {
        h.sort = sortAble.indexOf(h.key) > -1
        let header = _.cloneDeep(h);
        if (ColumnsDefine[h.key]) {
          header = _.extend({}, h, ColumnsDefine[h.key]);
        }
        if (ColumnDefineHistory[h.key]) {
          header = _.extend({}, h, ColumnDefineHistory[h.key]);
        }
        return header;
      });
      newColumns = filter(newColumns, item => !item.hidInHistory)
      this.columns = newColumns;
      this.calcColumnWidth()
    },
    calcColumnWidth: function (){
      let oldC = this.columns;
      _.map(oldC,item => {
        item.width = item.width || 90
      })
      this.columns = oldC
    },
    timeChange(v){
      let s = moment(v[0]).format('x')
      let e = moment(v[1]).format('x')
      this.date = { startTime: s, endTime: e };
      this.pageIndex = 1
      this.sendFilterOpt()
    },
    sendFilterOpt() {
      // if (!sort) {
      //   defaultSortFun();
      // }
      let msg = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        startTime: moment(this.time[0]).format('x'),
        endTime: moment(this.time[1]).format('x'),
      };
      this.opt && extend(msg, this.opt);
      term && extend(msg, term);
      this.date && extend(msg, this.date);
      this.search && extend(msg, this.search);
      this.sort && extend(msg, {orderKey: this.sort.key, order: this.sort.order});
      tempAdvance && extend(msg, {advanceSearch: tempAdvance});
      postalStore.pub('Worker', 'Flight.GetHistory', msg);
    }
  }
}
</script>

<style lang="scss" scoped>
  .flightHistory{
    position: fixed!important;
    ::v-deep .unlockBox{
      height: 8.2rem!important;
    }
  }
  ::v-deep .paginationHistory{
    position: fixed;
    bottom: 10px;
    display: flex;
    justify-content: center;
    width: 100%;
    .btn-next, .btn-prev, .el-pagination.is-background .el-pager li{
      background-color: #2b3645;
      color: #fff;
    }
    .el-pager .active{
      background-color: #536886 !important;
    }
  }
  .toolBar{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ol{
      margin: 0;
      &::before{
        content: "";
        width: 3px;
        height: 16px;
        background-color: #2e67f6;
        display: inline-block;
        position: relative;
        //top: 2px;
        margin-right: 4px
      }

      display: flex;
      flex-wrap: wrap;
      padding: 1px 16px;
      list-style: none;
      background-color: none;
      border-radius: 2px;
      a{
        color: #666;
        text-decoration: none;
      }
      .historyButton{
        &::before{
          display: inline-block;
          padding-right: 8px;
          color: #6c757d;
          content: ">";
          margin-left: 8px;
        }
        color: #2e67f6;
      }
    }
    ::v-deep .rightTool{
      display: flex;
      align-items: center;
      .el-button{
        height: 30px;
        padding: 0 5px;
        border: 0.01rem solid #37455c !important;
      }
      .input-with-search{
        line-height: 30px;
        height: 30px;
         .el-input__inner{
          height: 30px;
          line-height: 30px;
        }
      }

      .el-date-editor.el-range-editor{
        height: 32px;
      }
      .el-input__icon, .el-range-input, .el-input__icon, .el-range-separator{
        height: 30px!important;
        line-height: 30px
      }
      .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
        width: 300px;
      }
    }
    .tabs{
      //height: 40px;
      display: flex;
      align-items: center;
      margin-right: 10px;
      .is-active .tab-item-num{
        background: #5D9CF9;
      }
      .tab-item-num{
        padding: 0 4px;
        height: 14px;
        background: #676B71;
        border-radius: 7px;
        line-height: 16px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        min-width: 30px;
        display: inline-block;
      }
    }
    .timePicker{
      margin-right: 10px;
    }
    .input-with-search{
      margin-right: 10px;
      border: 0.01rem solid #37455c !important;
    }
    .back{
      margin-right: 20px;
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
  }
</style>