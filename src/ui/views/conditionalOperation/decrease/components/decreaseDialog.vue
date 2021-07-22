<template>
    <el-dialog title="调整调减" :visible.sync="dialogShow" class="nodeDialog decreaseDialog" center width="960px" :append-to-body="true">
        <div class="contentBox">
            <div class="title title1">
                <span>航班时刻协调参数</span>
                <div>
                    <i class="el-icon-edit" v-if="editShow==false" @click="editShow=true"></i>
                    <span v-else @click="editShow=false">取消</span>
                </div>
            </div>
            <div class="contentBox1">
                <div class="tableBox">
                    <ele-table :columnConfig="columnConfig1" :tableData="tableData" :thisObj="thisObj"></ele-table>
                </div>
                <div class="title">
                    <span>特殊参数<i class="iconfont icon-xinzeng"></i></span>
                </div>
                <div class="tableBox">
                    <ele-table :columnConfig="columnConfig2" :tableData="special" :thisObj="thisObj">
                        <el-table-column label="时段" slot="week" align="center">
                            <template slot-scope="{row,$index}">
                                <div v-if="editShow">
                                    <el-dropdown trigger="click" @command="weekChange">
                                        <span class="el-dropdown-link">
                                            {{weeks[row.type]}}<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="$index+'_'+key" v-for="(item,key) in weeks" :key="key">{{item}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                <div v-else>
                                    {{weeks[row.type]}}
                                </div>
                            </template>
                        </el-table-column>
                    </ele-table>
                </div>
            </div>

            <div class="buttonBox">
                <el-button type="primary" size="mini" @click="submitData">保存</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import PostalStore from '@/ui/lib/postalStore'
let postalStore = new PostalStore()
import { decreaseDialog_columnConfig1, decreaseDialog_columnConfig2 } from '../config'
export default {
    data() {
        return {
            dialogShow: false,
            columnConfig1: decreaseDialog_columnConfig1,
            columnConfig2: decreaseDialog_columnConfig2,
            tableData: [],
            special: [],
            editShow: false,
            weeks: {
                1: '星期一',
                2: '星期二',
                3: '星期三',
                4: '星期四',
                5: '星期五',
                6: '星期六',
                7: '星期天',
            },
            thisObj: {},
        }
    },
    mounted() {
        postalStore.pub('Worker', 'Flight.GetCoordinateArg', null)
        postalStore.sub('Flight.GetCoordinateArg.Response', (list) => {
            this.tableData = _.sortBy(
                _.filter(list, (l) => {
                    return (l.type === 0 || l.type === '0') && l.endTime != 2500
                }),
                'startTime'
            )
            this.special = _.sortBy(
                _.filter(list, (l) => {
                    return l.type != 0 || l.type != '0'
                }),
                'startTime'
            )
        })
        this.thisObj = this

        window.coordinateArgChange = (e, listName, index, key) => {
            this.coordinateArgChange(e, listName, index, key)
        }
    },
    methods: {
        submitData() {
            console.log(this.tableData, this.special)
        },
        initData() {
            this.editShow = false
            this.dialogShow = true
        },
        coordinateArgChange(event, listName, index, key) {
            if (key == 'time') {
                let timeArr = event.value.split('-')
                let pass = true
                if (timeArr.length < 2) {
                    this.$message({
                        message: '时间格式不正确',
                        type: 'warning',
                    })
                    pass = false
                }
                if (pass && parseInt(timeArr[0]) > parseInt(timeArr[1])) {
                    this.$message({
                        message: '开始时间不能大于结束时间',
                        type: 'warning',
                    })
                    pass = false
                }
                if (!pass) {
                    this[listName][index].startTime = ''
                    this[listName][index].endTime = ''
                    return
                }
                this[listName][index].startTime = timeArr[0]
                this[listName][index].endTime = timeArr[1]
                return
            }
            this[listName][index][key] = event.value
        },
        weekChange(command) {
            let indexArr = command.split('_')
            this.special[indexArr[0]].type = indexArr[1]
        },
    },
}
</script>
<style lang="scss" scoped>
.decreaseDialog {
    .contentBox {
        position: relative;
    }
    .title {
        height: 40px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 20px;
        & > span {
            display: flex;
            align-items: center;
            i {
                color: #409eff;
                margin-left: 15px;
                cursor: pointer;
            }
        }
        div {
            i {
                font-size: 18px;
                color: #409eff;
                cursor: pointer;
            }
            span {
                color: #409eff;
                cursor: pointer;
            }
        }
    }
    .title1 {
        position: fixed;
        width: calc(100% - 50px);
        top: 65px;
    }
    .contentBox1 {
        margin-top: 40px;
        overflow: auto;
        height: 460px;
    }
    .buttonBox {
        padding: 10px 0 0;
        display: flex;
        justify-content: center;
    }
}
</style>