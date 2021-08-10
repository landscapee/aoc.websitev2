<template>
    <div class="monthDelay" :class="options.position">
        <div class="box_content">
            <div class="left">
                <div class="top">
                    <icon-svg iconClass="monthdelay" />
                    <span class="name alib">月度放行正常率目标：{{flight_monthClearance.targetRate}}%</span>
                    <el-input class="iconshowInput" v-model="monthRate" size="mini" v-show="monthDRateInput" @keyup.enter.native="editMonthRateHandle"></el-input>
                    <i class="iconfont icon-bianji" @click="monthDRateInput = true" v-show="!monthDRateInput"></i>
                </div>
                <div class="mid">
                    <div>
                        <p>当月累计放行正常率：{{flight_monthClearance.value?flight_monthClearance.value.average:0}}%</p>
                        <p>后续每日放行正常率最低目标：{{flight_monthClearance.value?flight_monthClearance.value.lowest:0}}%</p>
                    </div>
                    <div>
                        <p class="p2">今天限制延误架次：{{flight_monthClearance.value?flight_monthClearance.value.limitDelay:0}}</p>
                        <p class="p2">今日已延误架次：<span @click="flightDialogHandle" :class="getDelayName">{{flight_monthClearance.value?flight_monthClearance.value.delay:0}}</span></p>
                    </div>
                </div>
                <div class="footer">
                    <div class="top">
                        <icon-svg iconClass="monthtitle" />
                        <span class="name alib">延误航班统计</span>
                        <el-select v-model="select" placeholder="请选择" size="mini" @change="load_flight_home">
                            <el-option v-for="item in selectArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <table class="">
                            <thead>
                                <tr>
                                    <th>0.5小时</th>
                                    <th>0.5-1小时</th>
                                    <th>1-2小时</th>
                                    <th>2小时以上</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span @click="showToolTipByIDs('ltHalfHour')">{{activeData.ltHalfHour}}</span></td>
                                    <td><span @click="showToolTipByIDs('ltOneHour')">{{activeData.ltOneHour}}</span></td>
                                    <td><span @click="showToolTipByIDs('ltTwoHour')">{{activeData.ltTwoHour}}</span></td>
                                    <td><span @click="showToolTipByIDs('gtTwoHour')">{{activeData.gtTwoHour}}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="right">
                <div>
                    <div class="title alib">
                        最近实际落地航班
                        <icon-svg iconClass="intitle" />
                    </div>
                    <el-row v-for="flight in flight_lastestAta" :key="flight.flightId" tag="ul">
                        <el-col tag="li" :span="10">{{flight.flightNo}}</el-col>
                        <el-col tag="li" :span="6">{{flight.runway}}</el-col>
                        <el-col tag="li" :span="6">{{$moment(flight.actualTime).format('HH:mm')}}</el-col>
                    </el-row>
                </div>
                <div>
                    <div class="title alib">
                        最近实际起飞航班
                        <icon-svg iconClass="movementD" />
                    </div>
                    <el-row v-for="flight in flight_lastestAtd" :key="flight.flightId" tag="ul">
                        <el-col tag="li" :span="10">{{flight.flightNo}}</el-col>
                        <el-col tag="li" :span="6">{{flight.runway}}</el-col>
                        <el-col tag="li" :span="6">{{$moment(flight.actualTime).format('HH:mm')}}</el-col>
                    </el-row>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { matchPercentNum } from 'lib/helper/utility'
import PostalStore from '@ui_lib/postalStore'
let postalStore = new PostalStore()
export default {
    props: [
        'options',
        'flight_home',
        'flight_monthClearance',
        'flight_lastestAta',
        'flight_lastestAtd',
    ],
    data() {
        return {
            select: 'takeOffNormal',
            selectArr: [
                { name: '放行延误', value: 'takeOffNormal' },
                { name: '始发延误', value: 'originalAllowTakeOff' },
                { name: '航班延误', value: 'normal' },
                { name: '起飞延误', value: 'departureNormal' },
                { name: '落地延误', value: 'arriveNormal' },
                { name: '早高峰延误', value: 'originalInMorning' },
            ],
            activeData: {
                gtTwoHour: 0,
                ltHalfHour: 0,
                ltOneHour: 0,
                ltTwoHour: 0,
            },
            monthDRateInput: false,
            monthRate: '',
            activeDataDetails: {
                gtTwoHour: [],
                ltHalfHour: [],
                ltOneHour: [],
                ltTwoHour: [],
            },
        }
    },
    created() {},
    mounted() {},
    watch: {
        flight_home: function () {
            this.load_flight_home()
        },
    },
    methods: {
        showToolTipByIDs(type) {
            let ids = this.activeDataDetails[type]
            postalStore.pub('Worker', 'Home.GetFlightsByIds', {
                ids: ids || [],
                webSubName: 'Home.ToolTip.Return',
            })
        },
        getDelayName() {
            let limitDelay = this.flight_monthClearance.value
                ? this.flight_monthClearance.value.limitDelay
                : 0
            let delay = this.flight_monthClearance.value
                ? this.flight_monthClearance.value.delay
                : 0

            if (delay > limitDelay) {
                return 'redBg'
            } else {
                return ''
            }
        },
        load_flight_home() {
            this.activeData = this.flight_home.rateDelay
                ? this.flight_home.rateDelay[this.select]
                : {
                      gtTwoHour: 0,
                      ltHalfHour: 0,
                      ltOneHour: 0,
                      ltTwoHour: 0,
                  }
            this.activeDataDetails = this.flight_home.rateDelayDetails
                ? this.flight_home.rateDelayDetails[this.select]
                : {
                      gtTwoHour: [],
                      ltHalfHour: [],
                      ltOneHour: [],
                      ltTwoHour: [],
                  }
        },
        editMonthRateHandle() {
            matchPercentNum(this.monthRate, () => {
                this.$request.get('situation', 'runningState/monthClearance/' + this.monthRate)
            })
        },
        flightDialogHandle() {
            this.$emit('flight-dialog-handle', {
                key: 'delay',
                toolTip: 'Flight/delayInfo',
                title: '延误',
            })
        },
    },
}
</script>

<style scoped lang='scss'>
.monthDelay {
    padding: 7px;
    position: absolute;
    .box_content {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        .left {
            display: flex;
            flex-direction: column;
            border-right: 2px dashed rgba(179, 189, 220, 0.2);
            width: 80%;
            padding-right: 30px;
            .top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px dashed rgba(179, 189, 220, 0.2);
                padding-bottom: 10px;
                height: 40px;
                i {
                    font-size: 16px;
                    color: #ccc;
                }
                svg {
                    font-size: 25px;
                }
                .name {
                    flex: 1;
                    margin-left: 10px;
                    color: #fff;
                }
                .el-input {
                    width: 60px;

                    input {
                        background: #39404b;
                    }
                }
                span {
                    font-size: 16px;
                }
            }
            .mid {
                padding: 16px 0;
                border-bottom: 2px dashed rgba(179, 189, 220, 0.2);
                & > div {
                    display: flex;
                    p {
                        width: 50%;
                        color: #fff;
                        font-size: 16px;
                        margin: 0;
                        span {
                            cursor: pointer;
                            font-size: 16px;
                            display: inline-block;
                            height: 24px;
                            width: 24px;
                            border-radius: 24px;
                            line-height: 24px;
                            text-align: center;
                        }
                        span.redBg {
                            background: #940d5b;
                        }
                    }
                    .p2 {
                        margin-top: 16px;
                    }
                }
            }
            .footer {
                margin-top: 20px;
                .top {
                    border: none;
                    margin-bottom: 20px;
                    span {
                        font-size: 16px;
                    }
                }
                table {
                    width: 100%;
                    thead {
                        background: #37455c;
                    }
                    tbody {
                        background: #1f2c42;
                    }
                    th,
                    td {
                        color: #fff;
                        height: 40px;
                        text-align: center;
                        font-weight: 400;
                        span {
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        .right {
            padding-left: 8px;
            width: 20%;
            & > div {
                height: 50%;
                width: 100%;
                .title {
                    height: 30px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    svg {
                        font-size: 24px;
                        margin-left: 5px;
                    }
                }
                ul {
                    height: 16%;
                    li {
                        color: #fff;
                        height: 24px;
                        line-height: 24px;
                    }
                }
            }
        }
    }
}
</style>
<style lang='scss'>
.monthDelay {
    .iconshowInput {
        width: 60px;

        input {
            background: #39404b;
            border: none;
            color: #fff;
        }
    }
}
</style>
