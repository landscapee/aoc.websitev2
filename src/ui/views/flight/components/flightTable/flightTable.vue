<template>
  <div class="flightTable">
    <el-table
        :data="tableData"
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
</template>

<script>
import { map } from 'lodash';
export default {
  name: "flightTable",
  props: {
    columns: {
      type: Array,
      default: []
    }
  },
  data(){
    return{
      tableData: map(new Array(28), item=> ({
        date: '2016-05-03',
        name: '王小虎',
        flightIndex: '上海市普陀区金沙江路 1518 弄'
      }))
    }
  },

  methods:{

  }

}
</script>

<style scoped>
@import "flightTable.scss";


</style>
