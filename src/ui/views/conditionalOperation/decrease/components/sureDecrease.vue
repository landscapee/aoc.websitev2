<template>
    <div class="sureDecrease showBox">
        <div class="title">
            <div class="name alib">
                确认调整调减
            </div>
        </div>
        <el-row tag="ul" class="showDetails">
            <el-col tag="li" :span="6" v-for="(value,key) in airLinesGroup" :class="key==confirmAdjustFilter?'active':''" @click.native="navHandle(key)" :key="key">{{value}}({{getKeyNum(key)}}/{{getTotleNum(key)}})</el-col>
        </el-row>
        <div class="tab">
            调减航班({{get(reduceFlightObj,'R.length', 0)}}/{{RPlanLength}})
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig2" :tableData="reduceFlightObj.R"></ele-table>
        </div>
        <div class="tab">
            调整航班({{get(reduceFlightObj,'A.length', 0)}}/{{APlanLength}})
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig1" :tableData="reduceFlightObj.A"></ele-table>
        </div>

        <div class="buttonBox">
            <el-button type="danger" size="mini" @click="backData" :disabled="!$hasRole('edit-audit',false)||getBack()">驳回</el-button>
            <!-- ||currentReduce.reduceInfo.status==1 -->
            <el-button type="primary" size="mini" @click="submitData" :disabled="!$hasRole('edit-audit',false)||sureShow">发布</el-button>
        </div>
    </div>
</template>
<script>
import { sureDecrease_columnConfig1, sureDecrease_columnConfig2 } from '../config'
export default {
    props: ['currentReduce', 'airLinesGroup', 'postalStore'],
    data() {
        return {
            columnConfig1: sureDecrease_columnConfig1,
            columnConfig2: sureDecrease_columnConfig2,
            reduceFlightObj: {
                A: [],
                R: [],
            },
            RPlanLength: 0,
            APlanLength: 0,
            get: _.get,
            confirmAdjustFilter: '',
            sureShow: false,
            reduceFlight: {},
        }
    },
    mounted() {},
    watch: {
        currentReduce: function (val) {
            this.sureShow = _.get(val, 'reduceInfo.status') === 1
            this.getReduceFlights()
            this.getPlanLength()
        },
    },
    methods: {
        navHandle(key) {
            this.confirmAdjustFilter = key == this.confirmAdjustFilter ? '' : key
            this.getAllReduceFlight()
            this.getPlanLength()
        },
        backData() {
            this.$confirm(
                `确认驳回${this.airLinesGroup[this.confirmAdjustFilter]}的调时调减?`,
                '提示',
                {
                    type: 'warning',
                    center: true,
                }
            ).then(() => {
                let airlineReduceId = this.currentReduce.plan[this.confirmAdjustFilter].id
                this.$request
                    .post(
                        'adverse',
                        `adjust/airlineDetail/action?action=reject&airlineReduceId=${airlineReduceId}`,
                        null,
                        false,
                        'PUT'
                    )
                    .then((res) => {
                        this.$alert(res.message, '提示', {
                            type: 'success',
                            center: true,
                        })
                        this.$emit('updateNowCur', this.currentReduce)
                    })
            })
        },
        submitData() {
            this.$confirm('确认发送到fims?', '提示', {
                type: 'warning',
                center: true,
            }).then(() => {
                this.$request
                    .post(
                        'adverse',
                        'adjust/sendToFims?reduceId=' + this.currentReduce.reduceId,
                        null,
                        false,
                        'PUT'
                    )
                    .then((res) => {
                        this.$alert(res.message, '提示', {
                            type: 'success',
                            center: true,
                        })
                        this.$emit('updateNowCur', this.currentReduce)
                    })
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
            let totalPlanAdjust = 0
            let totalPlanReduce = 0

            if (key == 'all') {
                _.map(this.currentReduce.plan, (item) => {
                    totalPlanAdjust += item.totalPlanAdjust
                    totalPlanReduce += item.totalPlanReduce
                })
            } else {
                totalPlanAdjust = _.get(this.currentReduce, `plan.${key}.totalPlanAdjust`, 0)
                totalPlanReduce = _.get(this.currentReduce, `plan.${key}.totalPlanReduce`, 0)
            }
            return totalPlanAdjust + totalPlanReduce
        },
        getPlanLength() {
            this.APlanLength = 0
            this.RPlanLength = 0

            if (this.confirmAdjustFilter && this.confirmAdjustFilter != 'all') {
                this.APlanLength = _.get(
                    this.currentReduce,
                    `plan.${this.confirmAdjustFilter}.totalPlanAdjust`,
                    0
                )
                this.RPlanLength = _.get(
                    this.currentReduce,
                    `plan.${this.confirmAdjustFilter}.totalPlanReduce`,
                    0
                )
            } else {
                _.map(this.currentReduce.plan, (item) => {
                    this.RPlanLength += item.totalPlanReduce
                    this.APlanLength += item.totalPlanAdjust
                })
            }
        },
        getAllReduceFlight() {
            let allReduceFlight = []
            this.reduceFlightObj = {
                A: [],
                R: [],
            }
            if (this.confirmAdjustFilter && this.confirmAdjustFilter != 'all') {
                allReduceFlight = this.reduceFlight[this.confirmAdjustFilter] || []
            } else {
                _.map(this.reduceFlight, (item, key) => {
                    _.map(item, (flight) => {
                        allReduceFlight.push({ ...flight, airlineCode: key })
                    })
                })
            }
            allReduceFlight.map((flight) => {
                this.reduceFlightObj[flight.type].push(flight)
            })
        },
        getBack() {
            return (
                !this.confirmAdjustFilter ||
                _.get(this.currentReduce, 'reduceInfo.status') === 1 ||
                _.get(this.currentReduce, ['plan', this.confirmAdjustFilter, 'sendType']) !== 2
            )
        },
        getReduceFlights() {
            // 发送状态 0:未发送 1:已发送给航司 2:航司已发给指挥室
            let planDetail = _.get(this.currentReduce, 'planDetail', {})
            let plan = _.get(this.currentReduce, 'plan', {})
            let reduceShouldShow = _.mapValues(planDetail, (item, key) => {
                if (plan[key].sendType == 2) {
                    return item
                }
                return []
            })
            this.postalStore.pub('Worker', 'Decrease.GetReduceFlights', reduceShouldShow)
            this.postalStore.sub(
                'Web',
                'Decrease.GetReduceFlights.Response',
                (flightWithAirline) => {
                    this.reduceFlight = flightWithAirline
                    this.getAllReduceFlight()
                }
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.sureDecrease {
    height: 100%;
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
            cursor: pointer;
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
        li.active {
            color: #4181e9;
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
    .tableBox {
        height: calc(50% - 100px);
    }
}
</style>