<template>
    <div class="reduceFlightLists showBox">
        <div class="title">
            <div class="name alib">调减航班</div>
            <div class="title_right fo">
                <span class="fo">{{reduceFlightObj.R.length}}</span>/{{currentPlan.totalPlanReduce||0}}
            </div>
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig1" :tableData="reduceFlightObj.R"></ele-table>
        </div>
        <div class="title">
            <div class="name alib">调整航班</div>
            <div class="title_right fo">
                <span class="fo">{{reduceFlightObj.A.length}}</span>/{{currentPlan.totalPlanAdjust||0}}
            </div>
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig2" :tableData="reduceFlightObj.A" :setCellClassName="setCellClassName"></ele-table>
        </div>
        <div class="btnBox">
            <el-button type="primary" size="mini" @click="airlineSubmit" :disabled="currentPlan.sendType!=1">{{currentPlan.sendType==1?'提交':'已发送'}}</el-button>
        </div>
    </div>
</template>
<script>
import { reduceFlightListssColumnConfig1, reduceFlightListssColumnConfig2 } from '../config'
export default {
    props: ['currentPlan', 'reduceFlight'],
    data() {
        return {
            columnConfig1: reduceFlightListssColumnConfig1,
            columnConfig2: reduceFlightListssColumnConfig2,
            reduceFlightObj: {
                R: [],
                A: [],
            },
            showInput: '',
        }
    },
    watch: {
        reduceFlight: function (val) {
            this.reduceFlightObj = {
                R: [],
                A: [],
            }
            val.map((list) => {
                if (list.type == 'R') {
                    this.reduceFlightObj.R.push(list)
                }
                if (list.type == 'A') {
                    this.reduceFlightObj.A.push(list)
                }
            })
        },
    },
    mounted() {},
    methods: {
        updateScheduleTimeChange(row) {
            return (event) => {
                let updateScheduleTime = this.editReduceTime(event.value)
                if (updateScheduleTime) {
                    this.showInput = ''
                    let data = {
                        flightId: row.flightId,
                        id: row.id,
                        reduceAirlineId: row.reduceAirlineId,
                        reduceId: row.reduceId,
                        type: row.type,
                        updateScheduleTime: updateScheduleTime,
                    }
                    this.$emit('airlineDetails', data)
                }
            }
        },
        setCellClassName(data) {
            if (data.column.label == '调后时刻') {
                return 'inputCell'
            }
        },
        editReduceTime(value) {
            const reg = /^(20|21|22|23|[0-1]\d)[0-5]{1}(5|0)$/
            if (reg.test(value)) {
                let updateScheduleTime = this.$moment()
                    .set('hour', value.substring(0, 2))
                    .set('minute', value.substring(2, 4))
                    .format('x')

                return updateScheduleTime
            } else {
                this.$message({
                    message:
                        '调后时刻输入格式不正确,请输入HHmm格式的时间,并以0或5结尾!例:1135或者1130',
                    type: 'error',
                })
                return false
            }
        },
        airlineSubmit() {
            let hasEmptyTime = _.some(this.reduceFlightObj.A, (item) => !item.updateScheduleTime)
            if (hasEmptyTime) {
                this.$alert('调后时刻不能为空!', '提示', {
                    type: 'warning',
                    center: true,
                })
                return
            }
            this.$request
                .post(
                    'adverse',
                    'adjust/airlineDetail/action?action=publish&&airlineReduceId=' +
                        this.currentPlan.id,
                    null,
                    false,
                    'PUT'
                )
                .then((res) => {
                    this.$message({
                        message: res.message,
                        type: 'success',
                    })
                    this.$emit('update')
                })
        },
    },
}
</script>



<style lang="scss" scoped>
.reduceFlightLists {
    height: calc(70% - 15px);
    width: 100%;
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        margin: 5px 0;
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
        .title_right {
            span {
                color: #0566ff;
            }
        }
    }
    .tableBox {
        height: calc(50% - 60px);
        width: 100%;
    }
    .btnBox {
        display: flex;
        justify-content: center;
        padding-top: 10px;
    }
}
</style>