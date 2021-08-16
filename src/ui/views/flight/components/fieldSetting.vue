<template>
  <div class="fieldSetting">
    <div class="drag-top">
      <draggable
          group="flights"
          :list="showFields"
          @end="end"
          class="visibleField">
        <div v-for="(element, index) in showFields" :key="index" class="list-complete-item">
          {{element.text}}
        </div>
      </draggable>
    </div>
    <div class="drag-bottom">
      <draggable
          group="flights"
          :list="hideFields"
          @end="end"
          class="dragArea">
        <div v-for="(element,index) in hideFields" :key="index"
             :class="{unDraggable : element.flag,selectColor:element.selectColor} "
             class="list-complete-item">
          <div class="list-complete-item-handle2"> {{element.text}}</div>
        </div>
      </draggable>
    </div>
    <div class="footer">
      <el-button @click="reset" plain size="mini">重置</el-button>
      <el-button @click="close" size="mini">取消</el-button>
      <el-button @click="save" size="mini" type="success">保存</el-button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { reSetHeader, updateListHeader} from "@/ui/views/flight/components/handleColumn";
import {keyBy, map} from "lodash";
import {allField} from "@/lib/flightAllFields";
import {getListHeader} from "@/worker/lib/columns";
export default {
  name: "fieldSetting",
  components: {draggable},
  props: ['toggleFieldSetting', 'refreshColumn'],
  data(){
    let hideFields = [];
    let myFlightHeader = getListHeader();
    let headerList = keyBy(myFlightHeader, 'key');
    map(allField, (item, key) => {
      if (!headerList[key] && !item.reference) {
        item.key = key;
        hideFields.push(item);
      }
    });
    return{
      showFields: myFlightHeader,
      hideFields: hideFields
    }
  },
  created() {
    this.init()
  },
  methods:{
    end: function (v,d){
      console.log(v,d)
    },
    init: function (){
      let hideFields = [];
      let myFlightHeader = getListHeader();
      let headerList = keyBy(myFlightHeader, 'key');
      map(allField, (item, key) => {
        if (!headerList[key] && !item.reference) {
          item.key = key;
          hideFields.push(item);
        }
      });
      this.showFields = myFlightHeader;
      this.hideFields = hideFields
    },
    reset: function (){
      reSetHeader();
      this.init()
    },
    close: function (){
      this.toggleFieldSetting()
    },
    save: function (){
      // console.log(this.showFields)
      updateListHeader(this.showFields)
      this.refreshColumn()
      this.toggleFieldSetting();
    },
  }
}
</script>

<style lang="scss" scoped>
.fieldSetting{
  position: fixed;
  z-index: 300;
  left: 0;
  right: 0;
  .visibleField{
    display: flex;
    left: 0;
    right: 0;
    overflow-x: auto;
    align-items: flex-start;
  }
  .list-complete-item {
    cursor: pointer;
    position: relative;
    font-size: 14px;
    padding: 3px 5px;
    display: inline-block;
    margin: 0 8px 8px 0;
    border: 1px solid #6c757d;
    border-radius: 1px;
    color:#6c757d;
    transition: all .5s;
    flex-grow: 0;
    flex-shrink: 0;
  }
  .drag-top{
    padding: 5px;
    background: rgba(121, 120, 120, 1);
    height: 50px;
  }
  .list-complete-item{
    background: #5e6871;
    color:#fff;
    border:1px #5e6871 solid;
    border-radius: 2px;
  }

  .drag-bottom{
    padding-top:15px;
    border-bottom:1px #7d7c7c solid;
    background: rgb(90 90 90);
  }
  .footer{
    background: rgb(90 90 90);
    height: 40px;
    display: flex;
    justify-content: flex-end;
    color: #fff;
    align-items: center;
  }

  .list-complete-item.sortable-chosen {
    background: #4AB7BD;
  }
  .selectColor{
    background: #5e6871;
    color:#fff;
  }
   .list-complete-item.sortable-ghost {
    background: #30B08F;
  }

   .undraggable {
    background-color: red;
  }

   .list-complete-enter,.list-complete-leave-active {
    opacity: 0;
  }
}
</style>
