<template>
    <div class="sureDecrease showBox">
        <div class="title">
            <div class="name alib">
                确认调时调减
            </div>
        </div>
        <el-row tag="ul" class="showDetails">
            <el-col tag="li" :span="6" v-for="(value,key) in airLinesGroup" :key="key">{{value}}({{getKeyNum(key)}}/{{getTotleNum(key)}})</el-col>
        </el-row>
        <div class="tab">
            调时航班({{get(reduceFlightObj,'A.length', 0)}}/{{APlanLength}})
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig1" :tableData="reduceFlightObj.A"></ele-table>
        </div>
        <div class="tab">
            调减航班({{get(reduceFlightObj,'R.length', 0)}}/{{RPlanLength}})
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig2" :tableData="reduceFlightObj.R"></ele-table>
        </div>
        <div class="buttonBox">
            <el-button type="danger" size="mini" :disabled="!$hasRole('edit-audit',false)">驳回</el-button>
            <!-- ||currentReduce.reduceInfo.status==1 -->
            <el-button type="primary" size="mini" @click="submitData" :disabled="!$hasRole('edit-audit',false)">发布</el-button>
        </div>
    </div>
</template>
<script>
export default {
    props: ['currentReduce', 'reduceFlight', 'airLinesGroup'],
    data() {
        return {
            columnConfig1: [
                {
                    key: 'flightNo',
                    label: '航班号',
                    width: '80px',
                },
                {
                    key: '',
                    label: '计划时间',
                    width: '90px',
                    display: ({ row }) => {
                        return this.$moment(row.scheduleTime).format('HH:mm(DD)')
                    },
                },
                {
                    key: '',
                    label: '航线',
                    display: ({ row }) => {
                        return row.displayRouter.join('-')
                    },
                },
                {
                    key: 'flightType',
                    label: '航班类型',
                    width: '90px',
                },
            ],
            columnConfig2: [
                {
                    key: 'flightNo',
                    label: '航班号',
                    width: '80px',
                },
                {
                    key: '',
                    label: '计划时间',
                    width: '90px',
                    display: ({ row }) => {
                        return this.$moment(row.scheduleTime).format('HH:mm(DD)')
                    },
                },
                {
                    key: '',
                    label: '航线',
                    display: ({ row }) => {
                        return row.displayRouter.join('-')
                    },
                },
                {
                    key: '',
                    label: '调减时刻',
                    width: '90px',
                    display: ({ row }) => {
                        return this.$moment(row.updateScheduleTime).format('HH:mm(DD)')
                    },
                },
            ],
            reduceFlightObj: {
                A: [],
                R: [],
            },
            RPlanLength: 0,
            APlanLength: 0,
            get: _.get,
        }
    },
    mounted() {},
    watch: {
        currentReduce: function (val) {
            this.RPlanLength = 0
            this.APlanLength = 0
            ;(this.reduceFlightObj = {
                A: [],
                R: [],
            }),
                this.getAllReduceFlight()
            this.getPlanLength()
        },
    },
    methods: {
        submitData() {
            this.$confirm('确认发送到fims?', '提示', {
                type: 'warning',
                center: true,
            }).then(() => {
                this.$request
                    .post(
                        'adverse',
                        'adjust/sendToFims',
                        {
                            reduceId: this.currentReduce.reduceId,
                        },
                        false,
                        'PUT'
                    )
                    .then((res) => {})
            })
        },
        getKeyNum(key) {
            let num = this.reduceFlight[key] ? this.reduceFlight[key].length : 0
            if (key == 'all') {
                _.map(this.reduceFlight, (value, key) => {
                    num += value.length
                })
            }
            return num
        },
        getTotleNum(key) {
            let totalPlanAdjust = _.get(this.currentReduce, `plan.${key}.totalPlanAdjust`, 0)
            let totalPlanReduce = _.get(this.currentReduce, `plan.${key}.totalPlanReduce`, 0)

            let num = totalPlanAdjust + totalPlanReduce
            if (key == 'all') {
                num = this.RPlanLength + this.APlanLength
            }
            return num
        },
        getPlanLength() {
            _.map(this.currentReduce.plan, (item) => {
                this.RPlanLength += item.totalPlanReduce
                this.APlanLength += item.totalPlanAdjust
            })
        },
        getAllReduceFlight() {
            let allReduceFlight = []
            _.map(this.reduceFlight, (item, key) => {
                _.map(item, (flight) => {
                    allReduceFlight.push({ ...flight, airlineCode: key })
                })
            })
            allReduceFlight.map((flight) => {
                this.reduceFlightObj[flight.type].push(flight)
            })
            console.log(this.reduceFlightObj)
        },
    },
}
</script>

<style lang="scss" scoped>
.sureDecrease {
    flex: 1;
    margin-bottom: 15px;
    padding: 15px;
    .title {
        display: flex;
        align-items: center;

        color: #fff;
        .name {
            color: #fff;
            line-height: 30px;
            display: flex;
            align-items: center;
            margin-right: 15px;
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
    }
    .showDetails {
        color: #fff;
        padding-left: 10px;
        li {
            font-size: 12px;
            display: flex;
            align-items: center;
            height: 20px;
        }
        li:before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 4px;
            background: #4181e9;
            border-radius: 2px;
            margin-right: 5px;
        }
    }
    .tab {
        background-image: url(../imgs/tabBg.png);
        background-size: 100% 100%;
        display: inline-block;
        height: 24px;
        line-height: 26px;
        font-size: 12px;
        padding: 0 15px;
        margin: 10px 0;
        color: #fff;
    }
    .buttonBox {
        padding: 10px 0 0;
        display: flex;
        justify-content: center;
    }
    // .tableBox {
    //     height: 300px;
    // }
}
</style>