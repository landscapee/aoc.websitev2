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
      </div>
    </div>
  </div>
</template>

<script>
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
]
export default {
  name: "flightHistory",
  data(){
    return{
      tabBarOptions
    }
  }
}
</script>

<style lang="scss" scoped>
  .toolBar{
    height: 35px;
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
    .tabs{
      //height: 40px;
      display: flex;
      align-items: center;
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
  }
</style>