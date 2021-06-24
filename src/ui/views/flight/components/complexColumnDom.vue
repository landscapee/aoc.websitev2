<template>
  <div v-if="item.key === 'examine'" slot-scope="scope">
    <el-button class="set-top-btn" @click="setTop(scope.row.flightId)" type="info"><i :class="scope.row.setTop ? 'iconfont icon-quxiaozhiding' : 'iconfont icon-zhiding' "></i></el-button>
  </div>

  <div v-else-if="item.key === 'flightNo'" slot-scope="scope">
    <span v-if="scope.row.markLate" class="flightLabel">晚</span>
    <span class="flightLabel">{{ flightLabel }}</span>
    <span :style="{ color: scope.row.movement === 'A' ? '#00FE4A' : 'rgba(25,197,255,1)' }" class="flightNo fo">{{ scope.row.flightNo }}</span>
  </div>

  <permissionSwitch v-else-if="item.key === 'displayTOBT'" slot-scope="scope" role="edit-TOBT">
    <div @click="TOBTClick($event, scope.row)" class="d-flex flex-justify-center">
      <i v-if="scope.row.movement === 'D'" class="iconfont icon-bianji text-blue" ></i>
      <div>{{scope.row.displayTOBT}}</div>
    </div>
  </permissionSwitch>

  <div slot-scope="scope" v-else-if="item.formatter" v-html="item.formatter(scope.row)">
  </div>
  <div v-else slot-scope="scope">
    <div>
      {{scope.row[item.key]}}
    </div>
  </div>
</template>

<script>
import {memoryStore} from "@/worker/lib/memoryStore";
import moment from "moment";
import {get} from "lodash";
import PostalStore from "@/ui/lib/postalStore";

let postalStore = new PostalStore()
export default {
  name: "complex-column",
  components: {
    'permissionSwitch': () =>
        import(/*webpackChunkName:"permissionSwitch"*/ './permissionSwitch'),
  },
  props: {
    scope: {
      type: Object,
      default: {}
    },
    item: {
      type: Object,
      default: {}
    }
  },
  data(){
    return{
      row: this.scope.row
    }
  },
  methods: {
    setTop: function (flightId){
      let now = memoryStore.getItem('global').now
      let day = moment(now).format('YYYYMMDD');
      let flightSetTop = localStorage.getItem('flightSetTop');
      flightSetTop = flightSetTop ? JSON.parse(flightSetTop) : {};
      let todayTopFlights = get(flightSetTop, day, {});
      todayTopFlights[flightId] = todayTopFlights[flightId] ? false : true;
      localStorage.removeItem('flightSetTop');
      localStorage.setItem('flightSetTop', JSON.stringify({ [day]: todayTopFlights }));
      console.log(todayTopFlights)
      postalStore.pub( 'Flight.Personal.SetTop', todayTopFlights)
      // this.pub('Worker', 'Flight.Personal.SetTop', todayTopFlights);
    },
    TOBTClick: function (e,flight){
      let x = e.clientX;
      let y = e.clientY;
      let payload = {
        x,
        y,
        flight
      }
      this.$store.commit('flight/toggleTOBTVisibility', payload)
    }
  },
  computed: {
    flightLabel: function (){
      let flightLabel = '';
      switch (this.scope.row.flightLabel) {
        case '过站':
          flightLabel = '站';
          break;
        case '始发':
          flightLabel = '始';
          break;
        case '过夜':
          flightLabel = '夜';
          break;
      }
      return flightLabel
    }
  }
}
</script>

<style scoped>

</style>
