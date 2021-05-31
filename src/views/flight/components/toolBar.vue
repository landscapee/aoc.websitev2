<template>
  <div class="toolbar">
    <div class="tabs">
      <el-tabs tab-position="bottom">
        <el-tab-pane v-for="item in tabBarOptions" :label='item.name'>
          <span slot="label"> {{item.name}}
            <span class="tab-item-num">2</span>
          </span>

        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="right-box">
      <el-radio-group v-model="operationType" style="margin-right: 5px">
        <el-radio-button label="OperationDay">运营日</el-radio-button>
        <el-radio-button label="naturalDay">自然日</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="timeType" style="margin-right: 5px">
        <el-radio-button label="Yesterday">昨天</el-radio-button>
        <el-radio-button label="Today">今天</el-radio-button>
        <el-radio-button label="Tomorrow">明天</el-radio-button>
      </el-radio-group>
      <div class="search">

      </div>
    </div>

  </div>
</template>

<script>
import PostalStore from "lib/postalStore";
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
  data() {
    return {
      tabBarOptions,
      operationType:'',
      timeType:'',
    }
  },
  components: {

  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {

  },
}
</script>

<style scoped lang="scss">
 .toolbar{
   display: flex;
   justify-content: space-between;
   .tabs{
     height: 50px;
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
     height: 50px;
     display: flex;
     align-items: center;
     .search{
       //width: 0p;
       padding: 8px 10px;
       color: #fff;
       background: #2b3645;
       border-color: #2b3645;
     }
   }
 }
</style>
