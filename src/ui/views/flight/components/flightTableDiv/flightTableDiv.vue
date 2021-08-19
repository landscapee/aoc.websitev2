<template>
  <div class="flightTableDiv">
    <div class="lock" id="lock" :style="{width: lockWidth + 'rem'}">
      <flightHeader :activeKey.sync="activeKey" :isHistory="isHistory" :order.sync="order" :changeLockStatus="changeLockStatus" :columns="lockColumns"></flightHeader>
      <flightRow :checkFlightId="checkFlightId" :hoverId.sync="hoverId" :clickId.sync="clickId"  :data="data" :columns="lockColumns"><slot slot-scope="scope" :row="scope.row" :item="scope.item"></slot></flightRow>
    </div>


    <div class="unlockBox" :style="{width: unLockBoxWidth + 'rem', left: lockWidth + 'rem', height: isHistory ? 'auto' : flightHeight + 'rem'}">
        <div :style="{width: unLockWidth + 'rem'}">
          <flightHeader :activeKey.sync="activeKey" :isHistory="isHistory" :order.sync="order" :changeLockStatus="changeLockStatus" :columns="unLockColumns" ></flightHeader>
          <flightRow :checkFlightId="checkFlightId" :hoverId.sync="hoverId" :clickId.sync="clickId" :data="data" :columns="unLockColumns"><slot slot-scope="scope" :row="scope.row" :item="scope.item"></slot></flightRow>
        </div>
    </div>
  </div>
</template>

<script>
import _, {map, some} from 'lodash';
import {fixPx, fixPxBySc, pxtorem} from "@/ui/lib/viewSize";
import {updateListHeader} from "@/ui/views/flight/components/handleColumn";
import flightHeader from '../flightHeader'
export default {
  name: "flightTableDiv",
  props: ['data', 'columns','setColumns', 'isScrolling', 'checkFlightId', 'showCount', 'isHistory'],
  components: {
    flightHeader,
    'flightRow': () =>
        import(/*webpackChunkName:"com-toolBar"*/ './flightRow'),

  },
  data(){
    return{
      unLockScrolling: false,
      hoverId: '',
      clickId: '',
      activeKey: '',
      order: ''
    }
  },
  mounted(){

  },
  methods: {
    pxtorem(px){
      return pxtorem(parseInt(px))
    },
    changeLockStatus: function (column, lock){
      let lockColumnsLength = _.filter(this.columns, item => item.lock).length
      let newColumns = this.columns;
      if ((!lock && lockColumnsLength <= 14) || (lock && lockColumnsLength >= 0)) {
        some(newColumns, (c) => {
          if (c.key == column.key) {
            c.lock = !c.lock;
            return true;
          }
        });
        this.setColumns(newColumns)
        updateListHeader(newColumns);
      }
    },
  },
  computed:{
    flightHeight: function (){
      return (this.showCount + 1) * pxtorem(35) + 0.1
    },
    lockColumns: function (){
      return _.filter(this.columns, item => item.lock)
    },
    unLockColumns: function (){
      return _.filter(this.columns, item => !item.lock)
    },
    lockWidth: function (){
      let lockW = 0;
      _.each(this.lockColumns, c => {
        lockW += parseInt(c.width)
      })
      return pxtorem(lockW)
    },
    unLockWidth: function (){
      let lockW = 0;
      _.each(this.unLockColumns, c => {
        lockW += parseInt(c.width)
      })
      return pxtorem(lockW)
    },
    unLockBoxWidth: function (){
      // let lockW = 0;
      // _.each(this.lockColumns, c => {
      //   lockW += parseInt(c.width)
      // })
      let clientW = document.documentElement.clientWidth || document.clientWidth
      return pxtorem(fixPxBySc(clientW)) - this.lockWidth // 减去滚动条
    }

  }
}
</script>

<style lang="scss" scoped>
@import "flightTableDiv";
</style>
