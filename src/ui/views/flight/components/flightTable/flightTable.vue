<template>
  <div ref="tableContainer" class="flightTable">
    <div class="scrollWrapper" ref="scrollOut">
      <div class="scrollBox" :style="{height: totalHeight + 'rem'}">
        <div class="virtualFlight" id="flightTable" >
<!--          <el-table-->
<!--              :row-class-name="rowClass"-->
<!--              :data="showFlights"-->
<!--              border-->
<!--              style="width: 100%">-->
<!--            <el-table-column-->
<!--                :resizable="false"-->
<!--                :show-overflow-tooltip="true"-->
<!--                v-for="item in columns"-->
<!--                :key="item.key"-->
<!--                :fixed="!!item.lock"-->
<!--                :prop="item.key"-->
<!--                :label="item.text"-->
<!--                align="center"-->
<!--                :width="item.width ? fixPx(item.width) : 'auto'"-->
<!--            >-->

<!--              <complex-column :inputField.sync="inputField" slot-scope="scope" :item="item" :scope="scope"/>-->
<!--              &lt;!&ndash;              自定义表头 &ndash;&gt;-->
<!--              <template slot="header" slot-scope="scope">-->
<!--                <div>-->
<!--                  <i v-if="scope.column.fixed" @click="changeLockStatus(scope.column,scope.column.fixed)" class="iconfont icon-suoding2 text-yellow font-xs cursor"></i>-->
<!--                  <i v-else @click="changeLockStatus(scope.column,scope.column.fixed)" class="icon-lock-2 cursor"></i>-->
<!--                  <span>{{scope.column.label}}</span>-->
<!--                </div>-->
<!--              </template>-->

<!--            </el-table-column>-->
<!--          </el-table>-->
          <flightTableDiv :isScrolling="isScrolling" :setColumns="setColumns" :data="showFlights" :columns="columns">
            <complex-column :inputField.sync="inputField" slot-scope="scope" :item="scope.item" :scope="scope"/>
          </flightTableDiv>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
import {map, slice, some} from 'lodash';
import {fixPx, pxtorem} from "@/ui/lib/viewSize";
import {debounce} from "@/ui/lib/common";
import {updateListHeader} from "@/ui/views/flight/components/handleColumn";
let itemH = 36;
export default {
  name: "flightTable",
  props: {
    columns: {
      type: Array,
      default: [],
    },
    flights: {
      type: Array,
      default: [],
    },
    setColumns: {
      type: Function
    }
  },
  components: {
    'complex-column': () =>
        import(/*webpackChunkName:"complex-column"*/ '../complexColumnDom'),
    'flightTableDiv': () =>
        import(/*webpackChunkName:"flightTableDiv"*/ '../flightTableDiv/flightTableDiv'),
  },
  data(){
    return{
      // flights: map(new Array(500), (item, index)=> ({
      //   date: '2016-05-03',
      //   direction: '王小虎',
      //   flightIndex: index
      // })),
      inputField:'', // 正在编辑的字段
      isScrolling: false, // 是否在滚动
      offSetY: 0,
      topCount: 0,
      showCount: 22,
      value: '',
      showFlights: []
    }
  },

  computed: {
    totalHeight: function(){
      let heightOfPx = (this.flights.length + 1) * itemH // 头部原因加1
      return heightOfPx / 100
    },
    // showFlights: function (){
    //   let flights = [...this.flights];
    //   // flights = flights.splice(this.topCount,this.showCount)
    //   // return flights
    //
    //   let rowHeight = fixPx(itemH);
    //   let begin = Math.floor(window.scrollY / rowHeight);
    //   let end = Math.ceil((window.innerHeight - fixPx(120 + 30 + 40 )) / rowHeight);
    //   flights = slice(flights, begin, begin + end);
    //   return flights;
    // }
  },

  mounted() {
    this.getVisibleFlights()
    window.addEventListener('scroll', () => {
      this.getVisibleFlights();
    })
    // document.onmousewheel = (e) => {
    //   clearTimeout(this.timer)
    //   if (Math.abs(e.deltaY) >= 1){
    //     this.isScrolling = true
    //   }
    //   if (Math.abs(e.deltaX) >= 2){
    //     this.isScrolling = false
    //   }
    //   this.timer = setTimeout(()=>{
    //     this.isScrolling = false
    //   }, 300)
    // }
  },

  methods:{
    fixPx: function (px){
      return fixPx(px)
    },
    getVisibleFlights: function (){
      let flights = [...this.flights];
      // flights = flights.splice(this.topCount,this.showCount)
      // return flights

      let rowHeight = fixPx(itemH);
      let begin = Math.floor(window.scrollY / rowHeight);
      let end = Math.ceil((window.innerHeight - fixPx(120 + 30 + 40 )) / rowHeight);
      flights = slice(flights, begin, begin + end);
      this.showFlights = flights
    },
    onScroll: function (e){
      // let scrollTop = e.target.scrollTop;  // 滚动了多少距离 这里获取的px已经通过rem转换成了px 所以不用根据屏幕尺寸再计算
      // let clientHeight = e.target.clientHeight; // 外层盒子可视高度
      // let scrollHeight = e.target.scrollHeight; // 外层盒子总高度
      // this.offSetY = scrollTop;
      // let topCount = Math.ceil(scrollTop / fixPx(itemH)); // 从哪里截取
      // let showCount = Math.floor(clientHeight / fixPx(itemH)) - 1; // 可视多少条 因表头减一
      // // if ((topCount + showCount) > this.flights.length){
      // //   this.topCount = this.flights.length - showCount;
      // //   return
      // // }
      // this.topCount = topCount;
      // this.showCount = showCount;
      // // console.log(topCount, showCount)
    },

    changeLockStatus: function (column, lock){
      let lockColumnsLength = _.filter(this.columns, item => item.lock).length
      let newColumns = this.columns;
      if ((!lock && lockColumnsLength <= 14) || (lock && lockColumnsLength >= 0)) {
        some(newColumns, (c) => {
          if (c.key == column.property) {
            c.lock = !c.lock;
            return true;
          }
        });
        this.setColumns(newColumns)
        updateListHeader(newColumns);
      }
    },
    // cellMouseEnter: function (row){
    //   console.log(row.flightId)
    //   this.hoverFlightId = row.flightId
    // },
    rowClass: function ({row}){
      return row.movement === 'D' ? 'hoverD' : 'hoverA'
    }
  },
  watch:{
    flights: function() {
      this.getVisibleFlights()
    }
  }

}
</script>

<style scoped>
@import "flightTable.scss";

::v-deep html, body { scroll-behavior:smooth; }
</style>
