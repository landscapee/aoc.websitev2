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
          <flightTableDiv :checkFlightId="checkFlightId" :isScrolling="isScrolling" :setColumns="setColumns" :data="showFlights" :columns="columns">
            <complex-column :inputField.sync="inputField" slot-scope="scope" :item="scope.item" :scope="scope"/>
          </flightTableDiv>
          <contextMenu :clickItem="contextClick"></contextMenu>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import {map, slice, some} from 'lodash';
import {fixPx, pxtorem} from "@/ui/lib/viewSize";
import contextMenu from '../contextMenu'
import {updateListHeader} from "@/ui/views/flight/components/handleColumn";
import PostalStore from "@/ui/lib/postalStore";
import {mapState} from "vuex";
let postalStore = new PostalStore();
let itemH = 37;
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
    contextMenu,
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
      showCount: 23,
      value: '',
      showFlights: [],
      checkFlightId: []
    }
  },

  computed: {
    ...mapState({
      showAdvance: state => state.flight.showAdvance
    }),
    totalHeight: function(){
      let showAdvance = this.showAdvance
      // 因为header的原因,没有打开高级搜索的情况就应该 -1 ,如果打开高级搜索就应该在正常情况下-1 这里就不减一
      let flightLength = showAdvance ? this.flights.length : this.flights.length - 1
      let heightOfPx = (flightLength) * itemH + 120
      return pxtorem(heightOfPx)
    },

  },

  mounted() {
    this.getVisibleFlights()
    window.addEventListener('scroll', () => {
      this.getVisibleFlights();
    })
    postalStore.sub('Web', 'OnAltClick', f => {
      let {flightId} = f;
      // xor 返回两个数组中唯一的值
      this.checkFlightId = _.xor(this.checkFlightId, [flightId])
    })
  },

  methods:{
    fixPx: function (px){
      return fixPx(px)
    },
    contextClick(name, flight){
      switch (name) {
        case 'publish':
          this.$request.post('situation', 'flight/batchConcern', {flightids: this.checkFlightId.join(',')}, true).then(res => {
            if (res.code === 200){
              this.$message.success('操作成功');
              this.checkFlightId = []
            }
          })
          break;
        case 'unSelectAll':
          this.checkFlightId = []
          break;
        case 'selectAll': {
          const all = map(this.flights, 'flightId');
          this.checkFlightId = all
          break;
        }
      }
    },
    getVisibleFlights: function (){
      let flights = [...this.flights];
      // flights = flights.splice(this.topCount,this.showCount)
      // return flights
      let showAdvance = this.showAdvance
      let rowHeight = fixPx(itemH);
      let begin = Math.floor(window.scrollY / rowHeight);
      let end = Math.ceil((window.innerHeight - fixPx(120 )) / rowHeight) - 1;
      end = showAdvance ? end - 1 : end
      // if (begin + end > flights.length){
      //   end = flights.length;
      //   begin = flights.length - end
      // }
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
    },
    showAdvance: function (){
      this.getVisibleFlights()
    }
  }

}
</script>

<style lang="scss" scoped>
@import "flightTable.scss";
::v-deep .contextMenu {
  z-index: 1112222222;
  background-color: #fff;
  border:1px solid rgba(200,204,207,1);
  width:auto;
  // height:256px;
  box-shadow:0px 0px 11px 3px rgba(0,0,0,0.19);
  border-radius:2px;
  position: fixed;
  // padding:9px;
  font-size: 12px;
  color: #000;
  .contextItem {
    height: 25px;
    line-height: 25px;
    padding: 0 7px;
    cursor: pointer;
    &:hover {
      background-color: #e7e7e7;
    }
    span {
      margin-left: 7px;
      display: inline-block;
    }
  }
  .active {
    background-color: #e7e7e7;
  }
}
::v-deep html, body { scroll-behavior:smooth; }
</style>
