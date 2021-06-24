<template>
    <div class="recommend showBox">
        <div class="title">
            <div class="name alib">推荐调时调减架次</div>
            <div class="right">
                <span style="margin-right:6px">反馈时长</span>
                <el-input placeholder="请输入" size="mini" style="width:70px" />
                <span style="margin:0 15px 0 5px;color: #60779b;">分钟</span>
                倒计时:
                10分10秒
            </div>
        </div>
        <div class="table">
            <ele-table :columnConfig="columnConfig" :tableData="tableData"></ele-table>
        </div>
    </div>
</template>
<script>
export default {
    props: ['currentReduce'],
    data() {
        return {
            airLines: [],
            columnConfig: [
                {
                    key: 'airline',
                    label: '航司',
                },
                {
                    key: 'R',
                    label: '计划调减',
                },
                {
                    key: 'A',
                    label: '计划调整',
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
                            click: ({ row }) => {
                                console.log(row)
                            },
                        },
                    ],
                },
            ],
            tableData: [
                { key: 'total', cnName: '全部' },
                { key: 'CA', cnName: '国航' },
                { key: '3U', cnName: '川航' },
                { key: 'MU', cnName: '东航' },
                { key: 'CZ', cnName: '南航' },
                { key: 'EU', cnName: '成航' },
                { key: '8L', cnName: '祥航' },
                { key: 'other', cnName: '其他' },
            ],
        }
    },
    watch: {
        currentReduce: function (val) {
            this.plan = val.plan
            this.tableData = this.formatSuggestForEdit(val.plan)
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
                    total: { A: totalA, R: totalR },
                }
            }
            const airLines = [
                { key: 'total', cnName: '全部' },
                { key: 'CA', cnName: '国航' },
                { key: '3U', cnName: '川航' },
                { key: 'MU', cnName: '东航' },
                { key: 'CZ', cnName: '南航' },
                { key: 'EU', cnName: '成航' },
                { key: '8L', cnName: '祥航' },
                { key: 'other', cnName: '其他' },
            ]
            let formated = formatData(suggestForEdit)
            return _.map(airLines, (item, key) => {
                let current = formated[item.key]
                return { ...current, airline: item.cnName, A: current.A, R: current.R }
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