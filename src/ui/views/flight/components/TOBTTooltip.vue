<template>
  <div  id='TOBTTooltip' class="TOBTTooltip" :style="style">
    <div class="tableContainer">
      <div class="tableRow">
        <div v-for="(item, index) in tobt" :class="['tableItem tabletTitle', index === tobt.length - 1 && 'border-right-0']">
          {{item.des}}
        </div>
      </div>
      <div class="tableRow contentTableRow">
        <div @click="valueClick(item.value)" v-for="(item, index) in tobt" :class="['tableItem', index === tobt.length - 1 && 'border-right-0']">
          {{item.timeHour}}
        </div>
      </div>
    </div>
    <div class="inputRow">
      <label>
        <span class="label">TOBT</span>
        <el-input size="mini" v-model="input" class="default-input" placeholder="HHmm"></el-input>
      </label>
    </div>
    <div class="inputRow">
      <label>
        <span class="label">备注</span>
        <el-input size="mini" v-model="remark" class="default-input" placeholder="请输入备注"></el-input>
      </label>
    </div>
    <div class="buttonBox">
      <el-button @click="cancel" size="mini">取消</el-button>
      <el-button @click="submit" type="primary" size="mini">确定</el-button>
    </div>

    <el-dialog width="400px" title="过站延误提示" :visible.sync="overstationVisible" append-to-body>
      <div class="text-white">
        {{overstationVisible}}
      </div>
      <div slot="footer" class="d-flex flex-justify-center">
        <el-button size="mini" @click="secondSubmit(true, 0)">取消</el-button>
        <el-button size="mini" @click="secondSubmit(true, 1)" type="primary">确定</el-button>
      </div>
    </el-dialog>

<!--    临界延误 -->
    <el-dialog width="400px" title="临界延误提示" :visible.sync="criticalDelayVisible" append-to-body>
      <div class="text-white">
        {{criticalDelayVisible}}
      </div>
      <div slot="footer" class="d-flex flex-justify-center">
        <el-button size="mini" @click="secondSubmit(false, 0)">取消</el-button>
        <el-button size="mini" @click="secondSubmit(false, 1)" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import PostalStore from "@/ui/lib/postalStore";
import _, {filter, map} from "lodash";
import {displayTimeHour} from "@/lib/helper/utility";
let postalStore = new PostalStore();
import moment from 'moment'
export default {
  name: "TOBTTooltip",
  props:[],
  data() {
    return{
      data: [],
      input:'',
      remark:'',
      overstationVisible: false,
      criticalDelayVisible: false,
      style: {}
    }
  },
  mounted() {
    this.getInitData();
    this.calcPosition()
  },
  beforeDestroy() {
  },
  computed: {
    ...mapState({
      getTOBTVisibility: state => state.flight.showTOBTToolTip
    }),
    tobt: function (){
      let sortedData = _(this.data)
          .toPairs()
          .sortBy([0])
          .fromPairs()
          .value(); // 根据字段名排序
      let tobts = map(sortedData, (item, key) => {
        if (key.indexOf('tobtReason') < 0) {
          if (!this.earliestTobt) {
            this.earliestTobt = item;
          }
          if (item && item < this.earliestTobt) {
            this.earliestTobt = item;
          }
        }
        return { key, value: item, des: _.toUpper(key), timeHour: displayTimeHour(item) };
      });
      tobts = filter(tobts, (item) => item.key.indexOf('tobtReason') < 0);
      return tobts
    }
  },
  methods: {
    valueClick: function (value){
      this.input = moment(value).format('HHmm')
    },
    getInitData: function (){
      this.$request.get('adverse', 'flight/calTobt?flightId=' + this.getTOBTVisibility.flight.flightId).then(res => {
        this.data = res.data
      })
    },
    cancel: function (){
      this.$store.commit('flight/toggleTOBTVisibility', false)
    },
    submit : function () {
      const reg = /^(20|21|22|23|[0-1]\d)[0-5]{1}(\d)$/;
      let tobt = this.input
      if (!reg.test(tobt)) {
        this.$message.error('TOBT格式错误');
        return;
      }
      let tobtTime = moment()
          .set('hour', tobt.substring(0, 2))
          .set('minute', tobt.substring(2, 4))
          .format('x');
      // 人工录入的TOBT必须＞＝计算出来三个TOBT中最早的那个－15分钟
      if (tobtTime > this.earliestTobt - 15 * 60 * 1000) {
        // postal.publish({
        //   channel: 'Worker',
        //   topic: 'Flight.UpdateTOBT',
        //   data: { tobt: parseInt(tobtTime), flightId: props.flightId, tobtReason: this.remark },
        // });
        // props.hide();
        this.$request.post('flight', 'Flight/tobtEdit',{
          editor: this.$store.state.userMsg?.userName,
          tobt: parseInt(tobtTime),
          flightId: this.getTOBTVisibility.flight.flightId,
          tobtReason: this.remark
        }).then(res=> {
          if (res.code === 200){
            let data = res.data
            if (data.overstation == 1){
              this.overstationVisible = `${data.flightNo}航班已录入TOBT：${displayTimeHour(data.tobt)}，放行标准保障时间为${displayTimeHour(data.dsgt)}，是否启动快速过站？`
            }
            if (data.criticalDelay == 1){
              this.criticalDelayVisible =  `${data.flightNo}航班已录入TOBT：${displayTimeHour(data.tobt)}，放行标准保障时间为${displayTimeHour(data.dsgt)}，是否启动临界延误？`
            }
            if (data.overstation != 1 && data.criticalDelay != 1){
              this.$message.success('操作成功');
              this.cancel()
            }

          }
        })
        // this.cancel()
      } else {
        this.$message.error('人工录入的TOBT必须大于推荐的最早TOBT - 15分钟');
      }
    },
    secondSubmit: function (isOverStation, enable){
      let flightId = this.getTOBTVisibility.flight.flightId;
      let url = isOverStation ? 'addOverStationByTobt' : 'addCriticalDelayByTobt';
      this.$request.get('flight', url, {flightId,confirm: enable}).then(res=> {
        let des = enable ? '启用' : '取消启用';
        let type = isOverStation ? '过站' : '临界'
        if (res.code === 200){
          this.$message.success(`${des + type}延误成功!`);
          isOverStation ? (this.overstationVisible = false) : (this.criticalDelayVisible = false)
          if (!this.overstationVisible && !this.criticalDelayVisible){
            this.cancel()
          }
        }else {
          this.$message.success(`${des + type}延误失败!`);
        }
      })
    },
    calcPosition: function (){
      let clientWidth = document.body.clientWidth;
      let clientHeight = document.body.clientHeight;
      let style = {left: this.getTOBTVisibility.x + 'px', top: this.getTOBTVisibility.y + 'px'}
      let dom = document.getElementById('TOBTTooltip');
      let domWidth = dom.offsetWidth || 237.3632; // 1080下 宽度是:237.3632
      let domHeight = dom.offsetHeight || 183.94;
      if (this.getTOBTVisibility.x + domWidth > clientWidth) {
        style.right = '10px';
        delete style.left;
      }
      if (this.getTOBTVisibility.y + domHeight > clientHeight) {
        style.bottom = '10px';
        delete style.top;
      }
      console.log(style)
      this.style = style
    }
  },
  watch: {
    getTOBTVisibility:function (newVal, oldVal){
      if (newVal.flight.flightId !== oldVal.flight.flightId){
        this.getInitData();
        this.calcPosition()
      }
    }
  }
}
</script>

<style scoped>

</style>
