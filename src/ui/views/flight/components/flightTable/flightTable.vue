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
                align="center"
                :width="item.width ? fixPx(item.width) : 'auto'"
            >

              <complex-column :inputField.sync="inputField" slot-scope="scope" :item="item" :scope="scope"/>
              <!--              自定义表头 -->
              <template slot="header" slot-scope="scope">
                <div>
                  <i v-if="scope.column.fixed" @click="changeLockStatus(scope.column,scope.column.fixed)" class="iconfont icon-suoding2 text-yellow font-xs cursor"></i>
                  <i v-else @click="changeLockStatus(scope.column,scope.column.fixed)" class="icon-lock-2 cursor"></i>
                  <span>{{scope.column.label}}</span>
                </div>
              </template>

            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import {map, some} from 'lodash';
import {fixPx, pxtorem} from "@/ui/lib/viewSize";
import {debounce} from "@/ui/lib/common";
import {updateListHeader} from "@/ui/views/flight/components/flightTable/handleColumn";
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
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      },
      ],
      value: ''
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
      clearTimeout(this.timer)
      if (Math.abs(e.deltaY) >= 1){
        this.isScrolling = true
      }
      if (Math.abs(e.deltaX) >= 2){
        this.isScrolling = false
      }
      this.timer = setTimeout(()=>{
        this.isScrolling = false
      }, 100)
    }
  },

  methods:{
    fixPx: function (px){
      return fixPx(px)
    },
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
  }

}
</script>

<style scoped>
@import "flightTable.scss";

::v-deep html, body { scroll-behavior:smooth; }
</style>
