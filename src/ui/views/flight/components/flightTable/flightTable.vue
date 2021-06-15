<template>
  <div ref="tableContainer" class="flightTable">
    <div class="scrollWrapper" v-on:scroll="onScroll">
      <div class="scrollBox" :style="{height: totalHeight + 'rem'}"/>
    </div>
    <div class="virtualFlight" :style="{pointerEvents: isScrolling ? 'none' : 'auto'}">
      <el-table
          :data="showFlights"
          border
          style="width: 100%">
        <el-table-column
            :resizable="false"
            :show-overflow-tooltip="true"
            v-for="item in columns"
            :key="item.key"
            :fixed="!!item.lock"
            :prop="item.key"
            :label="item.text"
            :width="item.width || 'auto'"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { map } from 'lodash';
import {pxtorem} from "@/ui/lib/viewSize";
import {debounce} from "@/ui/lib/common";
let itemH = 40;
export default {
  name: "flightTable",
  props: {
    columns: {
      type: Array,
      default: [],

    }
  },
  data(){
    return{
      flights: map(new Array(27), (item, index)=> ({
        date: '2016-05-03',
        name: '王小虎',
        flightIndex: index
      })),
      isScrolling: false, // 是否在滚动

    }
  },

  computed: {
    totalHeight: function(){
      let heightOfPx = (this.flights.length + 1) * itemH // 头部原因加1
      return pxtorem(heightOfPx)
    },
    showFlights: function (){
      let flights = [...this.flights];
      flights = flights.splice(1,20)
      return flights
    },
  },

  mounted() {
    // document.addEventListener('scroll',e => {
    //
    // })
    document.onmousewheel = () => {
      clearTimeout(this.timer)
      this.isScrolling = true
      this.timer = setTimeout(()=>{
        this.isScrolling = false
      }, 100)
    }
    let tableH = this.$refs.tableContainer.offsetHeight;

    let flightCount = this.flights.length;


    console.log()
  },

  methods:{
    onScroll: function (e){
      let scrollTop = e.target.scrollTop;  // 滚动了多少距离 这里获取的px已经通过rem转换成了px 所以不用根据屏幕尺寸再计算
      let scrollHeight = e.target.scrollHeight; // 外层盒子总高度
      let clientHeight = e.target.clientHeight; // 外层盒子可视高度
      let topCount = Math.floor(scrollTop / itemH); // 从哪里截取
      let showCount = Math.floor(clientHeight / itemH); // 可视多少条

      console.log(topCount, showCount)
    }
  }

}
</script>

<style scoped>
@import "flightTable.scss";


</style>
