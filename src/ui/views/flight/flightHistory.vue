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
            <el-tab-pane v-for="item in tabBarOptions" :option="item.option" :name="item.key" :key="item.name" :label='item.name'>
          <span slot="label"> {{item.name}}
            <span class="tab-item-num">20</span>
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
        <router-link to="/flight" class="back"><el-button size="mini" type="primary">返回</el-button></router-link>
      </div>
    </div>
    <flightTable :setColumns="setColumns" :flights="flightData.flights" :columns="columns">
    </flightTable>
  </div>
</template>

<script>
import moment from "moment";
import {memoryStore} from "@/worker/lib/memoryStore";
import _, {extend} from "lodash";
import PostalStore from "@/ui/lib/postalStore";
import {getListHeader} from "@/ui/views/flight/components/handleColumn";
import {map} from "lodash";
import flightTable from "@/ui/views/flight/components/flightTable/flightTable";
import ColumnsDefine from "@/ui/views/flight/columnDefine";

let postalStore = new PostalStore();

let tabBarOptions = [
  { name: '全部', key: 'total', option: null },
  { name: '进港', key: 'movementA', option: { movement: 'A' } },
  { name: '出港', key: 'movementD', option: { movement: 'D' } },
  { name: '返航', key: 'return', option: { return: true } },
  { name: '备降', key: 'alternate', option: { alternate: true } },
  { name: '取消', key: 'cancel', option: { cancel: true } },
  { name: '关注', key: 'concern', option: { concern: true } },
  { name: '备降外场', key: 'isAlternateLandingFlight', option: { isAlternateLandingFlight: true } },
  { name: '客运', key: 'isPassagerFlight', option: { isPassagerFlight: true } },
  { name: '始发', key: 'originated', option: { originated: true } },
  // { name: '可执行积压', key: 'isExecutableFlight', option: { isExecutableFlight: true } },
];
let opt, defaultSortFun, term, sort, date, search;
export default {
  name: "flightHistory",
  components: {flightTable},
  data(){
    let _this = this;
    let nowTime = memoryStore.getItem('global').now
    let now = moment(nowTime).startOf("day");
    return{
      tabBarOptions,
      time:[moment(now).subtract(1, 'd').format(), moment(now).format()],
      pageSize: 22,
      flightData: {},
      columns: [],
      pickerOptions: {
        shortcuts: [
          {
          text: '昨天',
          onClick(picker) {
            _this.timetext = '昨天';
            _this.timetextFlag = true;
            let start = moment(now).subtract(1,'d').startOf('day').format()
            let end = moment(now).startOf('d').format()
            picker.$emit('pick', [start, end]);
          }
        },
          {
          text: '前天',
          onClick(picker) {
            let start = moment(now).subtract(2,'d').startOf('day').format()
            let end = moment(now).subtract(1, 'd').startOf('day').format()
            picker.$emit('pick', [start, end]);
          }
        },
          {
            text: '运营日昨天',
            onClick(picker) {
              let start = moment(now).subtract(1,'d').startOf('day').set('hour', 4).format()
              let end = moment(now).startOf('day').set('hour', 4).format()
              picker.$emit('pick', [start, end]);
            }
          },
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
    postalStore.pub('Page.FlightHistory.Start', headerArray);
    postalStore.sub('Flight.GetHistory.Response', data => {
      this.flightData = data
    })
    this.sendFilterOpt()
  },
  beforeDestroy() {
    postalStore.pub('Page.FlightHistory.Stop', '');
    postalStore.unsubAll()
  },
  methods: {
    setColumns: function (Columns) {
      let newColumns = _.map(Columns, (h) => {
        if (ColumnsDefine[h.key]) {
          return _.extend({}, h, ColumnsDefine[h.key]);
        } else {
          return h;
        }
      });
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
      console.log(v)
    },
    sendFilterOpt(sort) {
      // if (!sort) {
      //   defaultSortFun();
      // }
      let msg = {
        pageIndex: 1,
        pageSize: this.pageSize,
        startTime: moment(this.time[0]).format('x'),
        endTime: moment(this.time[1]).format('x'),
      };
      opt && extend(msg, opt);
      term && extend(msg, term);
      date && extend(msg, date);
      search && extend(msg, search);
      sort && extend(msg, sort);
      postalStore.pub('Worker', 'Flight.GetHistory', msg);
    }
  }
}
</script>

<style lang="scss" scoped>
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
      .el-date-editor.el-range-editor{
        height: 36px;
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
      display: flex;
      align-items: center;
    }
  }
</style>