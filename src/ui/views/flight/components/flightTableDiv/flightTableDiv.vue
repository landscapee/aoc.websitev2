<template>
  <div class="flightTableDiv">
    <div class="lock" id="lock" :style="{width: lockWidth + 'rem'}">
      <div class="d-flex header">
        <div :style="{width: pxtorem(c.width) + 'rem'}" class="text-center headerItem" v-for="c in lockColumns">
          <i v-if="c.lock" @click="changeLockStatus(c, c.lock)" class="iconfont icon-suoding2 text-yellow font-xs cursor"></i>
          <i v-else class="icon-lock-2 cursor"></i>
          {{c.text}}
        </div>
      </div>
      <flightRow :data="data" :columns="lockColumns"><slot slot-scope="scope" :row="scope.row" :item="scope.item"></slot></flightRow>
    </div>


    <div class="unlockBox" :style="{width: unLockBoxWidth + 'rem', left: lockWidth + 'rem'}">
        <div :style="{width: unLockWidth + 'rem'}">
          <div class="d-flex header">
            <div :style="{width: pxtorem(c.width) + 'rem'}" class="text-center headerItem" v-for="c in unLockColumns">
              <i v-if="c.lock" @click="changeLockStatus(c, c.lock)" class="iconfont icon-suoding2 text-yellow font-xs cursor"></i>
              <i v-else @click="changeLockStatus(c, c.lock)" class="icon-lock-2 cursor"></i>
              {{c.text}}
            </div>
          </div>
          <flightRow :data="data" :columns="unLockColumns"><slot slot-scope="scope" :row="scope.row" :item="scope.item"></slot></flightRow>
        </div>
    </div>
  </div>
</template>

<script>
import _, {some} from 'lodash';
import {fixPx, fixPxBySc, pxtorem} from "@/ui/lib/viewSize";
import {updateListHeader} from "@/ui/views/flight/components/handleColumn";
export default {
  name: "flightTableDiv",
  props: ['data', 'columns','setColumns', 'isScrolling'],
  components: {
    'flightRow': () =>
        import(/*webpackChunkName:"com-toolBar"*/ './flightRow'),

  },
  data(){
    return{
      unLockScrolling: false
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
    unLockScroll: function (e){
      clearTimeout(this.timer)
      if (Math.abs(e.deltaY) >= 1){
        this.unLockScrolling = true
      }
      if (Math.abs(e.deltaX) >= 2){
        this.unLockScrolling = false
      }
      this.timer = setTimeout(()=>{
        this.unLockScrolling = false
      }, 100)
    }
  },
  computed:{
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
      console.log('clientW',pxtorem(clientW))
      console.log('this.lockWidth',this.lockWidth)
      return pxtorem(fixPxBySc(clientW)) - this.lockWidth // 减去滚动条
    }

  }
}
</script>

<style lang="scss" scoped>
@import "flightTableDiv";
</style>
