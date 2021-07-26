<template>
  <div class="toolbar">
    <div class="tabs">
      <el-tabs @tab-click="tabClick" v-model="activeTab" tab-position="bottom">
        <el-tab-pane v-for="item in tabBarOptions" :option="item.option" :name="item.key" :key="item.name" :label='item.name'>
          <span slot="label"> {{item.name}}
            <span class="tab-item-num">{{statistics[item.key]}}</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="right-box">
      <el-radio-group @change="operationChange" v-model="operationType" style="margin-right: 5px">
        <el-radio-button label="OperationDay">运营日</el-radio-button>
        <el-radio-button label="naturalDay">自然日</el-radio-button>
      </el-radio-group>
      <el-radio-group @change="dayChange" v-model="timeType" style="margin-right: 5px">
        <el-radio-button label="Yesterday">昨天</el-radio-button>
        <el-radio-button label="Today">今天</el-radio-button>
        <el-radio-button label="Tomorrow">明天</el-radio-button>
      </el-radio-group>
      <div class="search">
        <div>
          <el-input @input="searchInputChange" placeholder="航班号|机位|机尾号|登机口|航线" v-model="searchValue" class="input-with-search">
            <el-select @change="searchTypeChange" v-model="searchType" slot="prepend" placeholder="请选择">
              <el-option label="全部" value="all"></el-option>
              <el-option label="航班号" value="flightNo"></el-option>
              <el-option label="机位" value="seat"></el-option>
              <el-option label="机尾号" value="tailNo"></el-option>
              <el-option label="登机口" value="displayGate"></el-option>
              <el-option label="航线" value="displayRouter"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="buttons">
        <el-button @click="toggleAdvance" title="高级搜索" type="info" size="mini"><i class="iconfont icon-gaojisousuo"/></el-button>
        <el-button title="查看航班历史" type="info" size="mini"><i class="iconfont icon-lishi"/></el-button>
        <el-button @click="toggleFieldSetting" title="列表配置" type="info" size="mini"><i class="iconfont icon-zidingyi"/></el-button>
        <el-button @click="exportExel" title="导出当前结果" type="info" size="mini"><i class="iconfont icon-daochuexcel"/></el-button>
      </div>
    </div>

  </div>
</template>

<script>
import PostalStore from "@/ui/lib/postalStore";
import {extend} from "lodash";
import XLSX from 'xlsx';
import {memoryStore} from "@/worker/lib/memoryStore";
import moment from "moment";
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
  { name: '可执行积压', key: 'isExecutableFlight', option: { isExecutableFlight: true } },
]
export default {
  props: ['toggleFieldSetting', 'statistics'],
  data() {
    return {
      tabBarOptions,
      operationType:'naturalDay',
      timeType:'Today',
      searchType: 'all',
      searchValue: '',
      opt: {},
      dayProperty: null,
      activeTab:'total'
    }
  },
  components: {

  },
  mounted() {
    postalStore.sub('Web', 'SendFilterOpt', this.sendFilterOpt)
    postalStore.sub('Web', 'Flight.Export', result => {
      let worksheet = XLSX.utils.aoa_to_sheet(result);
      let new_workbook = XLSX.utils.book_new();
      let now = memoryStore.getItem('global').now
      XLSX.utils.book_append_sheet(new_workbook, worksheet, `航班动态`);
      XLSX.writeFile(new_workbook, `航班动态 ${moment(now).format('YYYY-MM-DD HHmm')}.xlsx`);
    })
  },
  beforeDestroy() {

  },
  methods: {
    exportExel(){
      postalStore.pub('Worker', 'Flight.Export', '')
    },
    tabClick:function (el){
      this.opt = el.$attrs.option
      this.sendFilterOpt()
    },
    searchTypeChange:function (){
      this.activeTab = 'total';
      this.opt = tabBarOptions[0].option
      // this.sendFilterOpt();
      this.onSearchFlight()
    },
    dayChange: function (label){
      this.dayProperty = label;
      this.sendFilterOpt();
      postalStore.pub('Web', 'Flight.SetDay', label);
    },
    sendFilterOpt: function (sort) {
      console.log(sort)
      if (!sort){
        postalStore.pub('Web', 'ClearSort', '')
      }
      let msg = {
        searchKey: null,
        movement: null,
        return: null,
        cancel: null,
        alternate: null,
        concern: null,
        isAlternateLandingFlight: null,
        isPassagerFlight: null,
        isExecutableFlight: null,
        originated: null,
        collect: null,
        all: null,
        dayProperty: null,
      };
      this.opt && extend(msg, this.opt);
      this.operationType && extend(msg, {dayProperty: this.operationType});
      this.dayProperty && extend(msg, {day: this.dayProperty});
      sort && extend(msg, sort);
      if (!sort){
        msg.sort = null
      }
      postalStore.pub('Worker', 'Flight.Filter', msg);
    },
    operationChange: function (label){
      this.operationType = label;
      this.sendFilterOpt()
    },

    // 搜索航班
    onSearchFlight: function (){
      postalStore.pub('Worker', 'Flight.Filter', {
        searchKey: this.searchValue,
        searchType: this.searchType,
        movement: null,
        attention: null,
        originated: null,
        isExecutableFlight: null,
        collect: null,
        all: 'All',
      });
    },
    searchInputChange: function (){
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        this.onSearchFlight();
      }, 500);
    },
    toggleAdvance(){
      this.$store.commit('flight/toggleShowAdvance', !this.$store.state.flight.showAdvance)
    }
  },
}
</script>

<style scoped lang="scss">
 .toolbar{
   display: flex;
   top: 0.4rem;
   width: 100%;
   padding-right: 18px;
   position: fixed;
   justify-content: space-between;
   background: #111926;
   z-index: 10;
   .tabs{
     height: 40px;
     display: flex;
     align-items: center;
   }
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
   .right-box{
     height: 40px;
     display: flex;
     align-items: center;
     .search{
       width: 228px;
       height: 34px;
       color: #fff;
       background: #2b3645;
       border-color: #2b3645;
      margin-right: 3px;
     }
   }
   .el-button--info{
     margin-left: 0;
     width: 30px;
     padding: 0;
     .iconfont{
       font-size: 12px;
     }
   }
 }
</style>
