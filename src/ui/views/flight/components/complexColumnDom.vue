<template>
  <div v-if="item.key === 'examine'" slot-scope="scope">
    <el-button @click="setTop(scope.row.flightId)" :type="scope.row.setTop ? 'primary': 'info'"><i class="iconfont icon-zhiding"></i></el-button>
  </div>

  <!--displayRouter-->
  <div v-else-if="item.key === 'displayRouter'" slot-scope="scope">
    <el-select v-model="value" placeholder="请选择">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
  </div>
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
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
       value: ''
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
    }
  }
}
</script>

<style scoped>

</style>
