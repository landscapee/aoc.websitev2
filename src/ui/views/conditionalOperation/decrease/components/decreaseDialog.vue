<template>
    <el-dialog title="调整调减" :visible.sync="dialogShow" class="nodeDialog decreaseDialog" center width="960px" :append-to-body="true">
        <div class="contentBox">
            <div class="title title1">
                <span>航班时刻协调参数</span>
                <i class="el-icon-edit"></i>
            </div>
            <div class="contentBox1">
                <div class="tableBox">
                    <ele-table :columnConfig="columnConfig1" :tableData="tableData" :thisObj="thisObj"></ele-table>
                </div>
                <div class="title">
                    <span>特殊参数</span>
                </div>
                <div class="tableBox">
                    <ele-table :columnConfig="columnConfig2" :tableData="special" :thisObj="thisObj"></ele-table>
                </div>
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
            console.log(list)

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
            console.log(this.special)
        })
        this.thisObj = this
    },
    methods: {
        initData() {
            this.dialogShow = true
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
        i {
            font-size: 18px;
            color: #409eff;
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
}
</style>