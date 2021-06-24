<template>
  <div  id='TOBTTooltip' class="TOBTTooltip" :style="{left: getTOBTVisibility.x + 'px', top: getTOBTVisibility.y + 'px'}">
    <div class="tableContainer">
      <div class="tableRow"></div>
      <div class="tableRow contentTableRow">

      </div>
    </div>
    <div class="inputRow">
      <label>
        <span class="label">TOBT</span>
        <input placeholder="HHmm" type="text" class="default-input" ></input>
      </label>
    </div>
    <div class="inputRow">
      <label>
        <span class="label">备注</span>
        <input value="" type="text" class="default-input" />
      </label>
    </div>
    <div class="buttonBox">
      <el-button @click="cancel" size="mini">取消</el-button>
      <el-button type="primary" size="mini">确定</el-button>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import PostalStore from "@/ui/lib/postalStore";
import _, {filter, map} from "lodash";
let postalStore = new PostalStore();
export default {
  name: "TOBTTooltip",
  props:[],
  data() {
    return{
      data: []
    }
  },
  mounted() {
    console.log(this.getTOBTVisibility.flight.flightId)
    this.$request.get('adverse', 'flight/calTobt?flightId=' + this.getTOBTVisibility.flight.flightId).then(res => {
      this.data = res.data
    })
  },
  beforeDestroy() {
  },
  computed: {
    ...mapState({
      getTOBTVisibility: state => state.flight.showTOBTToolTip
    }),
    tobt: function (){
      let earliestTobt;
      let sortedData = _(this.data)
          .toPairs()
          .sortBy([0])
          .fromPairs()
          .value(); // 根据字段名排序
      let tobts = map(sortedData, (item, key) => {
        if (key.indexOf('tobtReason') < 0) {
          if (!earliestTobt) {
            earliestTobt = item;
          }
          if (item && item < earliestTobt) {
            earliestTobt = item;
          }
        }
        return { key, value: item };
      });
      tobts = filter(tobts, (item) => item.key.indexOf('tobtReason') < 0);
      return tobts
    }
  },
  methods: {
    cancel: function (){
      this.$store.commit('flight/toggleTOBTVisibility', false)
    }
  },
  watch: {

  }
}
</script>

<style scoped>

</style>
