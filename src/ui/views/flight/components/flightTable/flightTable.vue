<template>
  <div ref="tableContainer" class="flightTable">
    <div class="scrollWrapper" ref="scrollOut" v-on:scroll="onScroll">
      <div class="scrollBox" :style="{height: totalHeight + 'rem'}">
        <div class="virtualFlight" id="flightTable" :style="{pointerEvents: isScrolling ? 'none' : 'auto'}">
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
                :formatter="item.formatter"
            >
              <template v-if="item.formatter" slot-scope="scope">
                <span :v-html="item.formatter(scope.row, scope.column) "></span>
<!--                <span style="margin-left: 10px">{{ scope.row.date }}</span>-->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { map } from 'lodash';
import {fixPx, pxtorem} from "@/ui/lib/viewSize";
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
      flights: map(new Array(500), (item, index)=> ({
        date: '2016-05-03',
        name: '王小虎',
        flightIndex: index
      })),
      isScrolling: false, // 是否在滚动
      offSetY: 0,
      topCount: 0,
      showCount: 20
    }
  },

  computed: {
    totalHeight: function(){
      let heightOfPx = (this.flights.length + 1) * itemH // 头部原因加1
      return heightOfPx / 100
    },
    showFlights: function (){
      let flights = [...this.flights];
      flights = flights.splice(this.topCount,this.showCount)
      return flights
    }
  },

  mounted() {
    document.onmousewheel = (e) => {
      // let scrollTop = this.offSetY + e.deltaY;
      // console.log( 'scrollHeight:',this.$refs.scrollOut.scrollHeight)
      // console.log('scrollTop:', scrollTop)
      // this.offSetY = scrollTop
      console.log(e)
      clearTimeout(this.timer)
      this.isScrolling = true
      this.timer = setTimeout(()=>{
        this.isScrolling = false
      }, 100)
      // let clientHeight = this.$refs.scrollOut.clientHeight; // 外层盒子可视高度
      // // let scrollHeight = this.$refs.scrollOut.scrollHeight; // 外层盒子总高度
      // let topCount = Math.ceil(scrollTop / fixPx(itemH)); // 从哪里截取
      // let showCount = Math.floor(clientHeight / fixPx(itemH)) - 1; // 可视多少条 因表头减一
      // if ((topCount + showCount) > this.flights.length){
      //   this.topCount = this.flights.length - showCount;
      //   return
      // }
      // this.topCount = topCount;
      // this.showCount = showCount;
      // console.log(topCount, showCount)
      // e.stopPropagation()
      // this.$refs.scrollOut.scrollTo(0,scrollTop)
      // return false
    }
  },

  methods:{
    onScroll: function (e){
      let scrollTop = e.target.scrollTop;  // 滚动了多少距离 这里获取的px已经通过rem转换成了px 所以不用根据屏幕尺寸再计算
      let clientHeight = e.target.clientHeight; // 外层盒子可视高度
      let scrollHeight = e.target.scrollHeight; // 外层盒子总高度
      this.offSetY = scrollTop;
      let topCount = Math.ceil(scrollTop / fixPx(itemH)); // 从哪里截取
      let showCount = Math.floor(clientHeight / fixPx(itemH)) - 1; // 可视多少条 因表头减一
      // if ((topCount + showCount) > this.flights.length){
      //   this.topCount = this.flights.length - showCount;
      //   return
      // }
      this.topCount = topCount;
      this.showCount = showCount;
      // console.log(topCount, showCount)
    }
  }

}
</script>

<style scoped>
@import "flightTable.scss";

::v-deep html, body { scroll-behavior:smooth; }
</style>
