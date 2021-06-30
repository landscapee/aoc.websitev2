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

  <el-cascader
      v-else-if="item.key === 'abnormalCategory'"
      slot-scope="scope"
      :value="scope.row.delayReasonMerge ? scope.row.delayReasonMerge.split(',') : []"
      :options="delayOptions"
      @change="(v) => abnormalCategoryChange(v, scope.row)"></el-cascader>

  <permissionSwitch v-else-if="['airportDesc','airlineDesc'].includes(item.key)" slot-scope="scope" :role="item.role">
    <div v-if="inputField === item.key + scope.row.flightId">
      <el-input :ref="item.key + scope.row.flightId" :autofocus="true" placeholder="" @keyup.esc.native="$emit('update:inputField', '')" @keyup.enter.native="delayInputBlur(item, scope)" v-model="delayInputValue"></el-input>
    </div>
    <div v-else  @click="delayClick(item,scope)" class="d-flex flex-justify-center">
      <i class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row[item.key]}}</div>
    </div>
  </permissionSwitch>

  <span v-else-if="item.key === 'showVideo'" class="cursor text-blue" @click="playVideo(scope.row)">
    播放
  </span>

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

  <permissionSwitch v-else-if="item.renderType === 'radio'" :noRoleDes="(scope.row[item.key] === '--' || !scope.row[item.key]) ? '否' : '是' " slot-scope="scope" :role="item.role">
    <template>
      <el-popconfirm
          :title="`是否确认${scope.row[item.key] == '1' ? '取消' : '设置'}航班${scope.row.flightNo}为${item.text}`"
          @confirm="radioConfirm(scope.row, item)"
      >
        <div  slot="reference">
          <el-radio @click.native.prevent="radioClick($event)" :value="scope.row[item.key]" label="1"></el-radio>
        </div>
      </el-popconfirm>
    </template>

  </permissionSwitch>



  <div slot-scope="scope" v-else-if="item.formatter" v-html="item.formatter(scope.row)">
  </div>
  <div v-else slot-scope="scope">
    <div>
      {{scope.row[item.key] || ''}}
    </div>
  </div>
</template>

<script>
import {memoryStore} from "@/worker/lib/memoryStore";
import moment from "moment";
import {get} from "lodash";
import PostalStore from "@/ui/lib/postalStore";
import {hasRole} from "@/ui/lib/common";

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
      abnormalCategoryValue:'',
      delayInputValue:'',
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
      this.$request.post('adverse',`deice/deiceAction?flightId=${row.flightId}`, [{key: item.referenceTo, value: value}]).then(res => {
          if (res.code == 200){
            this.$emit('update:inputField', '')
          }
      }).catch()
    },

    // 延误类输入框提交事件
    delayInputBlur: function (item, scope){
      let now = memoryStore.getItem('global').now;
      let value = this.delayInputValue
      if (!value) {
        this.$emit('update:inputField', '')
        return;
      }
      const row = scope.row;
      this.$request.post('situation',`situation/runningState/edit`, {flightId: row.flightId, [item.key]: value}, true).then(res => {
          if (res.code == 200){
            this.$emit('update:inputField', '')
          }
      }).catch()
    },

    delayClick: function (item,scope){
      if (scope.row.movement !== 'D'){
        return
      }
      let value = scope.row[item.key]
      value = (value === '--' || !value) ? '' : value;
      this.$emit('update:inputField', item.key + scope.row.flightId);
      this.delayInputValue = value
      this.$nextTick(()=> {
        this.$refs[item.key + scope.row.flightId].focus()
      });
    },
    radioConfirm: function (row, headerItem){
      console.log('ssss')
      let oldV = row[headerItem.key]
      console.log(oldV)
      this.$request.post('flight','Flight/tag',{flightId: row.flightId, [headerItem.key]: oldV === '1' ? '0' : '1'}).then(res => {
        if (res.code === 200){
          this.$message({ message: '操作成功!', type: 'success' })
        }
      }).catch()
      // console.log(row)
    },
    radioClick: function (e){
      console.log('radioClick')
    },

    // 延误分类事件
    abnormalCategoryChange: function (v, row){
      let options = { delayMainReason: `${v[0]}`, delaySubReason: `${v[1]}`, flightId: row.flightId };
      this.$request.post('situation', 'runningState/edit', options, true).then(res => {
        if (res.code === 200){
          this.$message({message: '操作成功!', type: 'success'})
        }
      })
    },

    // 播放视频
    playVideo: function (row){
      this.$request.post('flight', 'Flight/video/' + row.flightId).then(res => {
        if (res.code === 200){
          this.$message({message:'播放成功!',type: 'success'})
        }
      })
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
    },
    delayOptions: function (){
      return this.$store.state.flight.delayOptions
    },
    hasRole: function (){
      return (role) => {
        hasRole(role, false)
      }
    }
  }
}
</script>

<style scoped>

</style>
