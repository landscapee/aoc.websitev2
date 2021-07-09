<template>
    <div class="recommend showBox">
        <div class="title">
            <div class="name alib">推荐调时调减架次</div>
            <div class="right">
                <span style="margin-right:6px">反馈时长</span>
                <el-input placeholder="请输入" size="mini" style="width:70px" v-model="feedBackTime" @change="feedbackTimeChange" :disabled="!$hasRole('edit-handle-suggest',false)" />
            </div>
        </div>
        <div class="table">
            <ele-table :columnConfig="columnConfig" :tableData="tableData" :key="tableKey" @table-input-change="tableInputChange"></ele-table>
        </div>
    </div>
</template>
<script>
export default {
    props: ['currentReduce', 'airLinesGroup'],
    data() {
        return {
            tableKey: 0,
            feedBackTime: 30,
            columnConfig: [
                {
                    key: 'airline',
                    label: '航司',
                },
                {
                    key: 'R',
                    label: '计划调减',
                    input: true,
                    inputShow: 'RInputShow',
                    click: ({ row }) => {
                        this.trHandle(row, 'R')
                    },
                },
                {
                    key: 'A',
                    label: '计划调整',
                    input: true,
                    inputShow: 'AInputShow',

                    click: ({ row }) => {
                        this.trHandle(row, 'A')
                    },
                },
                {
                    key: '',
                    type: 'operate',
                    label: '操作',
                    operates: [
                        {
                            display: () => {
                                return '<i class="iconfont icon-fasong"></i>'
                            },
                            disabled: (row) => {
                                let result = false
                                if (
                                    row.sendType != 0 ||
                                    this.currentReduce.reduceInfo.status == 1
                                ) {
                                    result = true
                                }
                                return result
                            },
                            click: ({ row }) => {
                                console.log(row)
                                this.rowSend(row)
                            },
                        },
                    ],
                },
            ],
            tableData: [],
        }
    },
    watch: {
        currentReduce: function (val) {
            if (!val) return
            this.plan = val.plan
            this.tableData = this.formatSuggestForEdit(val.plan)
            console.log(this.tableData)
            this.feedBackTime = val.reduceInfo ? val.reduceInfo.feedbackTime : 30
        },
    },
    mounted() {},
    methods: {
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
        trHandle(row, type) {
            let index = _.findIndex(this.tableData, { id: row.id })
            if (!this.tableData[index][type + 'InputShow']) {
                this.tableData.map((list) => {
                    list.AInputShow = false
                    list.RInputShow = false
                })
                this.tableData[index][type + 'InputShow'] = true
                this.tableKey++
            }
        },
        tableInputChange({ row }) {
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
                    this.tableData.map((list) => {
                        list.AInputShow = false
                        list.RInputShow = false
                    })
                    this.tableKey++
                })
        },
        rowSend(row) {
            console.log(row)
            let idArrs = []
            if (row.airline == '全部') {
                this.tableData.map((list) => {
                    if (list) {
                        idArrs.push(list.id)
                    }
                })
            } else {
                idArrs.push(row.id)
            }
            this.$confirm('确认发送调时调减计划到航司?', '提示', {
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
                        this.tableData.map((list) => {
                            list.AInputShow = false
                            list.RInputShow = false
                        })
                        this.tableKey++
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
    .table {
    }
}
</style>