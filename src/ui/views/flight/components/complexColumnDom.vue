<template>
  <div v-if="item.key === 'examine'" slot-scope="scope">
    <el-button class="set-top-btn" @click="setTop(scope.row.flightId)" type="info"><i :class="scope.row.setTop ? 'iconfont icon-quxiaozhiding' : 'iconfont icon-zhiding' "></i></el-button>
  </div>

  <div v-else-if="item.key === 'flightNo'" slot-scope="scope">
    <span v-if="scope.row.markLate" class="flightLabel">晚</span>
    <span class="flightLabel">{{ flightLabel }}</span>
    <span :style="{ color: scope.row.movement === 'A' ? '#00FE4A' : 'rgba(25,197,255,1)' }" class="flightNo fo">{{ scope.row.flightNo }}</span>
  </div>

  <permissionSwitch v-else-if="item.key === 'displayTOBT'" slot-scope="scope" role="edit-TOBT">
    <div @click="TOBTClick($event, scope.row)" class="d-flex flex-justify-center">
      <i v-if="scope.row.movement === 'D'" class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row.displayTOBT}}</div>
    </div>
  </permissionSwitch>

  <permissionSwitch v-else-if="item.renderType === 'deiceTimeInput'" slot-scope="scope" role="edit-actual-STime">
    <div v-if="inputField === item.key + scope.row.flightId">
      <el-input :ref="item.key + scope.row.flightId" :autofocus="true" placeholder="HHmm" @keyup.esc.native="$emit('update:inputField', '')" @keyup.enter.native="deiceTimeInputBlur(item, scope)" v-model="deiceTimeInputValue"></el-input>
    </div>
    <div v-else  @click="timeClick(item,scope)" class="d-flex flex-justify-center">
      <i v-if="scope.row.movement === 'D'" class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row[item.key]}}</div>
    </div>
  </permissionSwitch>

  <permissionSwitch v-else-if="item.renderType === 'timeInput'" slot-scope="scope" role="edit-actual-STime">
    <div v-if="inputField === item.key + scope.row.flightId">
      <el-input :ref="item.key + scope.row.flightId" :autofocus="true" placeholder="HHmm" @keyup.esc.native="$emit('update:inputField', '')" @keyup.enter.native="timeInputBlur(item, scope)" v-model="timeInputValue"></el-input>
    </div>
    <div v-else  @click="timeClick(item,scope)" class="d-flex flex-justify-center">
      <i v-if="scope.row.movement === 'D'" class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row[item.key] || '--'}}</div>
    </div>
  </permissionSwitch>

  <permissionSwitch v-else-if="item.renderType === 'radio'" slot-scope="scope" role="edit-actual-STime">
    <el-radio :value="'1'" label="1"></el-radio>
  </permissionSwitch>

  <div slot-scope="scope" v-else-if="item.formatter" v-html="item.formatter(scope.row)">
  </div>
  <div v-else slot-scope="scope">
    <div>
      {{scope.row[item.key]}}
    </div>
  </div>
</template>

<script>
import {memoryStore} from "@/worker/lib/memoryStore";
import moment from "moment";
import {get} from "lodash";
import PostalStore from "@/ui/lib/postalStore";

let postalStore = new PostalStore()
export default {
  name: "complex-column",
  components: {
    'permissionSwitch': () =>
        import(/*webpackChunkName:"permissionSwitch"*/ './permissionSwitch'),
  },
  props: {
    scope: {
      type: Object,
      default: {}
    },
    item: {
      type: Object,
      default: {}
    },
    inputField: {
      type: String
    },
  },
  data(){
    return{
      row: this.scope.row,
      deiceTimeInputValue: '',
      timeInputValue: '',
    }
  },
  methods: {
    setTop: function (flightId){
      let now = memoryStore.getItem('global').now
      let day = moment(now).format('YYYYMMDD');
      let flightSetTop = localStorage.getItem('flightSetTop');
      flightSetTop = flightSetTop ? JSON.parse(flightSetTop) : {};
      let todayTopFlights = get(flightSetTop, day, {});
      todayTopFlights[flightId] = todayTopFlights[flightId] ? false : true;
      localStorage.removeItem('flightSetTop');
      localStorage.setItem('flightSetTop', JSON.stringify({ [day]: todayTopFlights }));
      console.log(todayTopFlights)
      postalStore.pub( 'Flight.Personal.SetTop', todayTopFlights)
      // this.pub('Worker', 'Flight.Personal.SetTop', todayTopFlights);
    },
    TOBTClick: function (e,flight){
      if (flight.movement !== 'D'){
        return
      }
      let x = e.clientX;
      let y = e.clientY;
      let payload = {
        x,
        y,
        flight
      }
      this.$store.commit('flight/toggleTOBTVisibility', payload)
    },
    timeClick: function (item,scope){
      if (scope.row.movement !== 'D'){
        return
      }
      let value = scope.row[item.key]
      value = (value === '--' || !value) ? '' : value;
      value = value.split(':').join('')
      value = !value ? moment().format('HHmm') : value
      this.$emit('update:inputField', item.key + scope.row.flightId);
      this.deiceTimeInputValue = value
      this.$nextTick(()=> {
        this.$refs[item.key + scope.row.flightId].focus()
      });
    },
    // 除冰专用事件
    deiceTimeInputBlur: function (item, scope){
      let now = memoryStore.getItem('global').now;
      let value = this.deiceTimeInputValue
      if (!/^(\+|-)?([0-1]?[0-9]|2[0-3])([0-5][0-9])(\+|-)?$/.test(value)) {
        this.$message({type: 'error', message: '格式错误！'});
        return;
      }
      value = moment(now).set('hour',value.substr(0,2)).set('minute',value.substr(2,2)).startOf('minute').valueOf()
      const row = scope.row;
      this.$request.post('adverse',`deice/deiceAction?flightId=${row.flightId}`, [{key: item.referenceTo, value: value}]).then(res => {
          if (res.code == 200){
            this.$emit('update:inputField', '')
          }
      }).catch()
    },

    // 时间类打tag事件
    timeInputBlur: function (item, scope){
      let now = memoryStore.getItem('global').now;
      let value = this.timeInputValue
      if (!/^(\+|-)?([0-1]?[0-9]|2[0-3])([0-5][0-9])(\+|-)?$/.test(value)) {
        this.$message({type: 'error', message: '格式错误！'});
        return;
      }
      value = moment(now).set('hour',value.substr(0,2)).set('minute',value.substr(2,2)).startOf('minute').valueOf()
      const row = scope.row;
      console.log({key: item.referenceTo, value: value})
      this.$request.post('adverse',`deice/deiceAction?flightId=${row.flightId}`, [{key: item.referenceTo, value: value}]).then(res => {
          if (res.code == 200){
            this.$emit('update:inputField', '')
          }
      }).catch()
    }
  },
  computed: {
    flightLabel: function (){
      let flightLabel = '';
      switch (this.scope.row.flightLabel) {
        case '过站':
          flightLabel = '站';
          break;
        case '始发':
          flightLabel = '始';
          break;
        case '过夜':
          flightLabel = '夜';
          break;
      }
      return flightLabel
    }
  }
}
</script>

<style scoped>

</style>
