<template>
    <div class="recommend showBox">
        <div class="title">
            <div class="name alib">推荐调整调减架次</div>
            <div class="right">
                <span style="margin-right:6px">反馈时长</span>
                <el-input placeholder="请输入" size="mini" style="width:70px" v-model="feedBackTime" @change="feedbackTimeChange" :disabled="!$hasRole('edit-handle-suggest',false)" />
            </div>
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig" :tableData="tableData" :key="tableKey" :setCellClassName="setCellClassName"></ele-table>
        </div>
    </div>
</template>
<script>
import { recommend_columnConfig } from '../config'
export default {
    props: ['currentReduce', 'airLinesGroup'],
    data() {
        return {
            tableKey: 0,
            feedBackTime: 30,
            showInput: '',
            columnConfig: recommend_columnConfig,
            tableData: [],
            ctx: this,
        }
    },
    watch: {
        currentReduce: function (val) {
            if (!val) return
            this.plan = val.plan
            this.tableData =
                JSON.stringify(val.plan) != '{}' ? this.formatSuggestForEdit(val.plan) : []
            this.feedBackTime = val.reduceInfo ? val.reduceInfo.feedbackTime : 30
        },
    },
    mounted() {},
    methods: {
        setCellClassName(data) {
            if (data.column.label == '调后时刻') {
                return 'inputCell'
            }
        },
        decRecommendInputHandle(row, type) {
            return (event) => {
                row[type] = event.value ? parseInt(event.value) : 0
                this.tableInputChange(row)
            }
        },
        formatSuggestForEdit(suggestForEdit) {
            const formatData = (data) => {
                let totalA = 0
                let totalR = 0
                _.map(data, (item) => {
                    totalA += item.totalPlanAdjust || 0
                    totalR += item.totalPlanReduce || 0
                })
                return {
                    ..._.mapValues(data, (item) => ({
                        ...item,
                        A: item.totalPlanAdjust,
                        R: item.totalPlanReduce,
                    })),
                    all: { A: totalA, R: totalR },
                }
            }

            let formated = formatData(suggestForEdit)
            return _.map(this.airLinesGroup, (item, key) => {
                let current = formated[key]
                return {
                    ...current,
                    airline: item,
                    A: current ? current.A : 0,
                    R: current ? current.R : 0,
                }
            })
        },
        tableInputChange(row) {
            this.$request
                .post(
                    'adverse',
                    'adjust/editPlan',
                    {
                        id: row.id,
                        totalPlanAdjust: row.A,
                        totalPlanReduce: row.R,
                    },
                    false,
                    'PUT'
                )
                .then((res) => {
                    this.$message({
                        message: res.message,
                        type: 'success',
                    })
                    this.showInput = ''
                })
        },
        rowSend(row) {
            let idArrs = []
            if (row.airline == '全部') {
                this.tableData.map((list) => {
                    if (list && list.id && list.sendType === 0) {
                        idArrs.push(list.id)
                    }
                })
            } else {
                idArrs.push(row.id)
            }

            this.$confirm('确认发送调整调减计划到航司?', '提示', {
                type: 'warning',
                center: true,
            }).then(() => {
                this.$request
                    .post('adverse', 'adjust/publish', idArrs, false, 'PUT')
                    .then((res) => {
                        this.$message({
                            message: res.message,
                            type: 'success',
                        })
                        this.$emit('updateNowCur')
                    })
            })
        },
        feedbackTimeChange() {
            this.$request
                .post(
                    'adverse',
                    'adjust/editFeedBackTime?reduceId=' +
                        this.currentReduce.reduceId +
                        '&feedBackTime=' +
                        this.feedBackTime,
                    null,
                    false,
                    'PUT'
                )
                .then((res) => {
                    this.$message({
                        message: res.message,
                        type: 'success',
                    })
                })
        },
    },
}
</script>
<style lang="scss" scoped>
.recommend {
    flex: 1;
    margin: 15px 0;
    padding: 0 15px;
    height: calc(100% - 545px);
    .title {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
            color: #fff;
            line-height: 30px;
            display: flex;
            align-items: center;
            font-size: 18px;
        }
        .name:before {
            content: '';
            display: inline-block;
            height: 16px;
            width: 4px;
            background: #0566ff;
            border-radius: 1px;
            margin-right: 5px;
        }
        .right {
            color: #fff;
            font-size: 12px;
            display: flex;
            align-items: center;
        }
    }
    .tableBox {
        height: calc(100% - 60px);
    }
}
</style>
<style lang="scss">
</style>