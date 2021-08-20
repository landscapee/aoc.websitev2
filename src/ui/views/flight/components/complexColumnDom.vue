<template>
  <div v-if="item.key === 'examine'" slot-scope="scope">
    <el-button class="set-top-btn" @click="setTop(scope.row.flightId)" type="info"><i :class="scope.row.setTop ? 'iconfont icon-quxiaozhiding' : 'iconfont icon-zhiding' "></i></el-button>
  </div>

  <div v-else-if="item.key === 'flightNo'" @click="$FlightDetais.open({flightId:scope.row.flightId},true)" slot-scope="scope">
    <span v-if="scope.row.markLate" class="flightLabel">晚</span>
    <span class="flightLabel">{{ flightLabel }}</span>
    <span :style="{ color: scope.row.movement === 'A' ? '#00FE4A' : 'rgba(25,197,255,1)' }" class="flightNo fo">{{ scope.row.flightNo }}</span>
  </div>

  <div v-else-if="item.key === 'flightIndex'"  class="position-relative" slot-scope="scope">
    <div :class="classNames('position-absolute', {
      'left-border-vip': get(scope.row,'mark.V') && !get(scope.row,'mark.D'),
      'left-border-delay': get(scope.row,'mark.D'),
      'left-border-none': !get(scope.row,'mark.D') && !get(scope.row,'mark.V') })" />
    <span>{{ scope.row.flightIndex }}</span>
  </div>

  <div :class="ctotClass(scope.row)" v-else-if="item.key === 'displayCTOT'" slot-scope="scope">
    <i :class="classNames('iconfont icon-zhankai', {'d-none': !getFlightDelayWarn(scope.row)})" />
    <el-popover
        :disabled="!scope.row.displayCTOT || scope.row.displayCTOT === '--'"
        popper-class="timeHistoryPopover"
        trigger="click"
        @show="historyShow(scope.row.flightId, 'ctot')"
    >
      <div v-if="timeHistoryData.length <= 0" class="text-center">
        暂无数据
      </div>
      <div v-for="item in timeHistoryData" class="historyItem">
        <span>{{displayTimeDate(item.createTime)}}</span>
        <span class="weightFont">{{scope.row.flightNo}}</span>
        <span class="weightFont">CTOT</span>
        <span class="mr-1">
          由: <span class="weightFont">{{ displayTimeDate(item.oldTime) }}</span>
        </span>
        <span>
          变更为: <span class="weightFont">{{ displayTimeDate(item.newTime) }}</span>
        </span>
      </div>
      <span slot="reference">{{ scope.row.displayCTOT }}</span>
    </el-popover>

    <i :class="classNames('iconfont icon-shouqi', {'d-none': !getFlightDelayWarn(scope.row)})" />
  </div>

  <el-popover
      v-else-if="item.key === 'displayCOBT'"
      slot-scope="scope"
      :disabled="!scope.row.displayCOBT || scope.row.displayCOBT === '--'"
      popper-class="timeHistoryPopover"
      trigger="click"
      @show="historyShow(scope.row.flightId, 'cobt')"
  >
    <div v-if="timeHistoryData.length <= 0" class="text-center">
      暂无数据
    </div>
    <div v-for="item in timeHistoryData" class="historyItem">
      <span>{{displayTimeDate(item.createTime)}}</span>
      <span class="weightFont">{{scope.row.flightNo}}</span>
      <span class="weightFont">COBT</span>
      <span class="mr-1">
          由: <span class="weightFont">{{ displayTimeDate(item.oldTime) }}</span>
        </span>
      <span>
          变更为: <span class="weightFont">{{ displayTimeDate(item.newTime) }}</span>
        </span>
    </div>
    <span slot="reference">{{ scope.row.displayCTOT }}</span>
  </el-popover>

  <permissionSwitch v-else-if="item.key === 'displayTOBT'" slot-scope="scope" role="edit-TOBT">
    <div class="d-flex flex-justify-center">
      <i @click="TOBTClick($event, scope.row)" v-if="scope.row.movement === 'D' && !isHistory" class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row.displayTOBT}}</div>
    </div>
  </permissionSwitch>

  <el-cascader
      v-else-if="item.key === 'abnormalCategory'"
      slot-scope="scope"
      :disabled="scope.row.isDelay !== true"
      :value="scope.row.delayReasonMerge ? scope.row.delayReasonMerge.split(',') : []"
      :options="delayOptions"
      @change="(v) => abnormalCategoryChange(v, scope.row)"></el-cascader>

  <div slot-scope="scope" v-else-if="item.key === 'delayMainReason'">
    <span v-if="isHistory">
      {{scope.row.delayMainReasonCn}}
    </span>
    <el-select
        v-else
        clearable
        :disabled="scope.row.isDelay !== true || !hasRole('edit-delay-category', false)"
        :value="scope.row.delayMainReason"
        @change="(v) => delayChange({delayMainReason: v, delaySubReason: null}, scope.row)">
      <el-option
          :key="option.value"
          :label="option.label"
          :value="option.value"
          v-for="option in flightRemoteSel['delayMainReason']">
      </el-option>

    </el-select>
  </div>


  <div slot-scope="scope" v-else-if="item.key === 'delaySubReason'">
    <span v-if="isHistory">
      {{scope.row.delaySubReasonCn}}
    </span>
    <el-select
        v-else
        clearable
        :disabled="scope.row.isDelay !== true || !hasRole('edit-delay-category', false)"
        :value="scope.row.delayMainReason && scope.row.delayMainReason !== '--' ? scope.row.delaySubReason : '--'"
        @change="(v) => delayChange({delaySubReason: v}, scope.row)">
      <el-option
          :key="option.value"
          :label="option.label"
          :value="option.value"
          v-for="option in getSubReason(scope.row)">
      </el-option>
    </el-select>
  </div>


  <permissionSwitch v-else-if="['airportDesc','airlineDesc'].includes(item.key)" slot-scope="scope" :role="item.role">
    <div v-if="inputField === item.key + scope.row.flightId">
      <el-input :ref="item.key + scope.row.flightId" :autofocus="true" placeholder="" @keyup.esc.native="$emit('update:inputField', '')" @keyup.enter.native="delayInputBlur(item, scope)" v-model="delayInputValue"></el-input>
    </div>
    <div v-else-if="scope.row.isDelay === true"   class="d-flex flex-justify-center">
      <i @click="delayClick(item,scope)" v-if="!isHistory" class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row[item.key]}}</div>
    </div>
    <span v-else>--</span>
  </permissionSwitch>

  <span v-else-if="item.key === 'showVideo'" class="cursor text-blue" @click="playVideo(scope.row)">
    播放
  </span>

  <permissionSwitch v-else-if="item.renderType === 'deiceTimeInput'" slot-scope="scope" role="edit-actual-STime">
    <div v-if="inputField === item.key + scope.row.flightId">
      <el-input :ref="item.key + scope.row.flightId" :autofocus="true" placeholder="HHmm" @keyup.esc.native="$emit('update:inputField', '')" @keyup.enter.native="deiceTimeInputBlur(item, scope)" v-model="deiceTimeInputValue"></el-input>
    </div>
    <div v-else  class="d-flex flex-justify-center">
      <i @click="timeClick(item,scope)" v-if="scope.row.movement === 'D' && !isHistory" class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row[item.key]}}</div>
    </div>
  </permissionSwitch>

  <permissionSwitch v-else-if="item.renderType === 'timeInput'" slot-scope="scope" role="edit-actual-STime">
    <div v-if="inputField === item.key + scope.row.flightId">
      <el-input :ref="item.key + scope.row.flightId" :autofocus="true" placeholder="HHmm" @keyup.esc.native="$emit('update:inputField', '')" @keyup.enter.native="timeInputBlur(item, scope)" v-model="timeInputValue"></el-input>
    </div>
    <div v-else   class="d-flex flex-justify-center">
      <i @click="timeClick(item,scope)" v-if="scope.row.movement === 'D' && !isHistory" class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row[item.key] || '--'}}</div>
    </div>
  </permissionSwitch>

  <permissionSwitch v-else-if="item.renderType === 'radio'" :noRoleDes="(scope.row[item.key] === '--' || !scope.row[item.key]) ? '否' : '是' " slot-scope="scope" :role="item.role">
    <template>
      <span v-if="isHistory">{{scope.row[item.key] == '1' ? '是' : scope.row[item.key] == '0' ? '否' : '--'}}</span>
      <el-popconfirm
          v-else
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
import {getFlightDelayWarn} from "@/lib/helper/flight";
import classNames from "classnames";
import {mapState} from "vuex";
import {displayTimeDate} from "@/lib/helper/utility";

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
    isHistory: {
      type: Boolean
    }
  },
  data(){
    return{
      row: this.scope.row,
      deiceTimeInputValue: '',
      timeInputValue: '',
      abnormalCategoryValue:'',
      delayInputValue:'',
      timeHistoryData: []
    }
  },
  methods: {
    get,
    hasRole,
    displayTimeDate,
    historyShow(flightId, type){
      let options = {flightId, type}
      this.$request.post('flight', 'Flight/getTimeHistory', options, true).then(res => {
        this.timeHistoryData = res.data;
      })
    },
    getSubReason:function (f){
      let {delayMainReason} = f
      let mainOptions = this.flightRemoteSel.delayMainReason;
      let options = _.find(mainOptions, i => i.value === delayMainReason);
      return options ? options.children : null
    },
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
      let field = item.key;
      let compareValue, isStart;
      switch (field){
        case 'displayActualStartTime':
          compareValue = scope.row['displayActualEndTime'];
          isStart = true;break;
        case 'displayEstimateStartTime':
          compareValue = scope.row['displayEstimateEndTime'];
          isStart = true; break;
        case 'displayActualEndTime':
          compareValue = scope.row['displayActualStartTime'];break
        case 'displayEstimateEndTime':
          compareValue = scope.row['displayEstimateStartTime'];break
      }
      compareValue = compareValue === '--' ? '' : compareValue
      compareValue = compareValue.split(':').join('')
      if (compareValue){
        if (isStart){
          if (value > compareValue){
            this.$message({type: 'error', message: '开始时间不能晚于结束时间!'})
            return;
          }
        }else {
          if (value < compareValue){
            this.$message({type: 'error', message: '结束时间不能早于开始时间!'})
            return;
          }
        }
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

    // 延误分类事件
    delayChange: function (reason, row){
      let options = { ...reason, flightId: row.flightId };
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
    },
    classNames: classNames,
    getFlightDelayWarn,
    ctotClass: function (row){
      let departWarn = getFlightDelayWarn(row);
      let cClass = classNames('d-flex flex-justify-center flex-items-center', {
        warnTextGreen: departWarn === 'departWarnGreen',
        warnTextRed: departWarn === 'departWarnRed',
        warnTextYellow: departWarn === 'departWarnYellow',
      });
      return cClass
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
    ...mapState('flight',{
      flightRemoteSel: 'flightRemoteSel'
    })
    // hasRole: function (){
    //   return (role) => {
    //     hasRole(role, false)
    //   }
    // }
  }
}
</script>

<style scoped>

</style>
