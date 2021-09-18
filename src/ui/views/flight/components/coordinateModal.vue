<template>
  <el-dialog :title="'航班协调'"
             width="700px"
             center
             :append-to-body="true"
             :visible.sync="modalVisible"
             :before-close="close">
    <div class="coordinateModal">
      <div class="d-flex mt-2">
        <div class="mr-3">协调对象:</div>
        <div class="d-flex flex-auto">
          <el-checkbox-group :disabled="!hasRole" v-model="target">
            <el-checkbox label="0">机坪塔台</el-checkbox>
            <el-checkbox label="1">空管塔台</el-checkbox>
            <el-checkbox label="3">航空公司</el-checkbox>
            <el-checkbox label="4">流量室</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="d-flex mt-2">
        <div class="mr-3">是否成功:</div>
        <div class="d-flex flex-auto">
          <el-radio :disabled="!hasRole" v-model="isSuccess" label="1">是</el-radio>
          <el-radio :disabled="!hasRole" v-model="isSuccess" label="0">否</el-radio>
        </div>
      </div>
      <div class="d-flex mt-2 flex-items-center">
        <div class="mr-3">协调备注:</div>
        <div class="d-flex flex-auto">
          <el-input :disabled="!hasRole" v-model="remark" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="d-flex mt-2">
        <div class="mr-3">上报领导:</div>
        <div class="d-flex flex-auto">
          <el-radio :disabled="!hasRole" v-model="isReport" label="1">是</el-radio>
          <el-radio :disabled="!hasRole" v-model="isReport" label="0">否</el-radio>
        </div>
      </div>

      <div class="d-flex mt-4 flex-justify-center">
        <el-button @click="doubleConfirm = true" type="danger" size="mini">取消</el-button>
        <el-button :disabled="!hasRole" @click="commit" type="primary" size="mini">确定</el-button>
      </div>

      <div class="d-flex mt-2 flex-column">
        <div class="mr-3 titleSX">协调记录:</div>
        <div class="d-flex flex-auto coordinateList">
<!--          <AdvTable :tab-data="coordinateList" :columnConfig="tableColumn"></AdvTable>-->
          <ele-table :columnConfig="tableColumn" :tableData="coordinateList">
            <el-table-column  label="协调对象" slot="target" align="center" width="100px">
              <div slot-scope="{row,index}" :title="map(row.target.split(','), (item) => {
                return targetMap[item];
              }).join(',')" class="overflowEllipsis">
                {{map(row.target.split(','), (item) => {
                return targetMap[item];
              }).join(',')}}
              </div>
            </el-table-column>

            <el-table-column label="协调备注" slot="remark" align="center" width="90px">
              <div class="overflowEllipsis" :title="row.remark" slot-scope="{row,index}">
                {{row.remark || '--'}}
              </div>
            </el-table-column>

            <el-table-column label="记录人" slot="recorder" align="center" min-width="10%">
              <div class="overflowEllipsis" :title="row.recorder" slot-scope="{row,index}">
                {{row.recorder}}
              </div>
            </el-table-column>

          </ele-table>
        </div>
      </div>
    </div>
    <el-dialog width="400px" :title="'提示'" :append-to-body="true" :visible.sync="doubleConfirm">
      <div class="doubleConfirmModal" >
        <div class="text-center">
          确认关闭协调窗口?
        </div>
        <div class="d-flex flex-justify-center mt-3">
          <el-button @click="doubleConfirm = false" type="danger" size="mini">取消</el-button>
          <el-button @click="doubleConfirm = false; modalVisible = false" type="primary" size="mini">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {mapState} from "vuex";
import PostalStore from "@/ui/lib/postalStore";
import _, {filter, map} from "lodash";
import {displayTimeDate, displayTimeHour} from "@/lib/helper/utility";
let postalStore = new PostalStore();
import AdvTable from "@/ui/components/advTable.vue";
import {hasRole} from "@ui_lib/common";
import {memoryStore} from "@/worker/lib/memoryStore";
import {getUserSerializ} from "@ui_lib/localStorageTemp";

export default {
  name: "coordinateModal",
  props:['coordinateModalParent'],
  data() {
    let targetMap = {
      0: '机坪塔台',
      1: '空管塔台',
      2: '航空公司',
      3: '流量室',
    };

    let boolMap = {
      0: '否',
      1: '是',
    };

    let tableColumn = [
      {
        key: 'flightIndex',
        label: '序号',
        type: 'index',
      },
      {
        key: 'createTime',
        label: '时间',
        type: 'simple',
        display: ({row}) => {
          return displayTimeDate(row.createTime);
        },
      },
      {
        key: 'target',
        label: '协调对象',
        slot: 'target',
        width: '100px',

      },
      {
        key: 'isSuccess',
        label: '是否成功',
        type: 'simple',
        display: ({row}) => {
          return boolMap[row.isSuccess];
        },
      },
      {
        key: 'remark',
        label: '协调备注',
        slot: 'remark'
      },
      {
        key: 'isReport',
        label: '是否上报领导',
        type: 'simple',
        width: '100px',
        display: ({row}) => {
          return boolMap[row.isReport];
        },
      },
      {
        key: 'recorder',
        label: '记录人',
        slot: 'recorder',
      },
    ]


    return{
      doubleConfirm: false,
      targetMap,
      tableColumn: tableColumn,
      coordinateList: [],
      modalVisible: false,
      target: [],
      isSuccess: '1',
      isReport: '0',
      remark: '',
      hasRole:hasRole('edit-coordinate-status', false)
    }
  },
  components: {AdvTable},
  mounted() {

    postalStore.sub('Web', 'Coordinate.Show', (flightId) => {
      this.flightId = flightId;
      this.resetData();
      this.getCoordinateList(flightId)
      this.modalVisible = true
    })
  },
  beforeDestroy() {
    postalStore.unsubAll()
  },

  methods: {
    map,
    close(){
      this.doubleConfirm = true
    },
    commit(){
      if (!hasRole('edit-coordinate-status', false)){
        return
      }
      if (this.remark.length > 250) {
        this.$message.error('协调备注不能超过250个中文字符!')
        return;
      }

      if (this.target.length <= 0) {
        this.$message.error('请选择协调对象!')
        return;
      }
      let target = this.target.join(',');
      let user =getUserSerializ()
      let params = { flightId: this.flightId, target, isSuccess: this.isSuccess, remark: this.remark, isReport: this.isReport, recorder: user.name };
      this.$request.post('flight', 'Flight/coordinate/save', params, true).then(res => {
        if (res.code === 200){
          this.$message.success('操作成功!')
          this.modalVisible = false
        }
      })

    },
    resetData(){
      this.target = [];
      this.isSuccess = '1';
      this.remark = '';
      this.isReport = '0';
      this.coordinateList = [];
    },
    getCoordinateList(flightId){
      this.$request.get('flight', `Flight/coordinate/${flightId}`).then(res => {
        if (res.code === 200){
          let data = res.data
          this.coordinateList = data
          let currentCoordinate = data[0]
          if (currentCoordinate){
            this.isReport = currentCoordinate.isReport
            this.target = currentCoordinate.target.split(',')
            this.isSuccess = currentCoordinate.isSuccess
            this.remark = currentCoordinate.remark
          }
        }

      })
    }
  },


}
</script>

<style lang="scss" scoped>
  ::v-deep .doubleConfirmModal{
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  ::v-deep .coordinateModal{
    color: #fff;
    .el-checkbox{
      color: #fff;
    }
    .el-checkbox__inner{
      background: #ffffff !important;
      border: 0.01rem #ffffff solid;
    }
    .el-checkbox__input.is-checked{
      .el-checkbox__inner{
        background-color: #409EFF!important;
        border-color: #409EFF;
      }
    }
    .el-radio{
      color: #fff;
    }
    .coordinateList{
      margin-top: 10px;
      height: 200px;
      position: relative;
      .overflowEllipsis{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 4px;
      }
    }
  }
</style>
