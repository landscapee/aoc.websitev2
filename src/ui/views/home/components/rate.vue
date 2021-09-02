<template>
    <div class="home_rate" :class="options.rate.position">
        <div class="box_content">
            <div class="selectBox">
                <el-dropdown trigger="click" @command="stateTypeSelectHandle" style="margin-right:15px">
                    <span class="el-dropdown-link">
                        {{areaObj[stateTypeSelect]}}<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="key" v-for="(item,key) in areaObj" :key="key">{{item}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click" @command="timeSelectHandle">
                    <span class="el-dropdown-link">
                        {{timeObj[timeSelect]}}<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="key" v-for="(item,key) in timeObj" :key="key">{{item}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="charBox">
                <div class="title">
                    放行正常率
                </div>
                <div class="content">
                    <div class="rotateBox"></div>
                    <div id="takeOffBox" class="chartBox" @click="getFlightHandle(rate1)"></div>
                    <div class="center" @click="getFlightHandle(rate1)">
                        <div class="top fo">
                            {{getPercent(rate1)}}<span class="fo">%</span>
                        </div>
                        <div class=" line"></div>
                        <div class="bottom fo">
                            {{rate1.numerator}}/{{rate1.denominator}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="charBox">
                <div class="title">
                    始发正常率
                </div>
                <div class="content">
                    <div class="rotateBox"></div>
                    <div id="originatedBox" class="chartBox" @click="getFlightHandle(rate2)"></div>
                    <div class="center" @click="getFlightHandle(rate2)">
                        <div class="top fo">
                            {{getPercent(rate2)}}<span class="fo">%</span>
                        </div>
                        <div class="line"></div>
                        <div class="bottom fo">
                            {{rate2.numerator}}/{{rate2.denominator}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="rateBox">
                <div v-for="item in rateLists" :key="item.rateType" v-show="item.show" @click="getFlightHandle(item)">
                    <div class="title">{{rateTypeName[item.rateType]}}</div>
                    <div class="per fo">{{getPercent(item)}}%</div>
                    <el-progress :percentage="getPercent(item)" :show-text="false" :color="colors"></el-progress>
                    <div class="process fo"><span v-show="item.rateType!=8">{{item.numerator}}/{{item.denominator}}</span></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { calcPercent } from '@/lib/helper/utility'
import Highcharts from 'highcharts/highstock'
import highchartsMore from 'highcharts/highcharts-more'
import solidgauge from 'highcharts/modules/solid-gauge'
highchartsMore(Highcharts)
solidgauge(Highcharts)
import PostalStore from '@ui_lib/postalStore'
let postalStore = new PostalStore()
export default {
    props: ['options', 'rate_data'],
    data() {
        return {
            flightDetilShow: false,
            layerName: '',
            columnConfig: [
                { key: 'ind', label: '序号', type: 'index', width: '50px' },
                {
                    key: 'flightNo',
                    label: '航班号',
                    click: ({ row }) => {
                        this.$FlightDetais.open({ flightId: row.flightId }, true)
                    },
                },
                {
                    key: 'aircraftNo',
                    label: '机尾号',
                },
                {
                    key: 'scheduleTime',
                    label: '计划时间',
                    display: ({ row }) => {
                        return this.$moment(row.scheduleTime).format('HH:mm')
                    },
                },
                {
                    key: 'actualTime',
                    label: '实际时间',
                    display: ({ row }) => {
                        return row.atd ? this.$moment(row.atd).format('HH:mm') : '-'
                    },
                },
            ],
            tableData: [],
            stateTypeSelect: 1,
            timeSelect: 4,
            colors: [
                { color: 'rgb(255, 255, 255)', percentage: 100 },
                { color: 'rgb(255, 199, 0)', percentage: 90 },
                { color: 'rgb(191, 11, 35)', percentage: 80 },
            ],
            rateLists: [
                { rateType: 8, numerator: 0, denominator: 0, show: true },
                { rateType: 1, numerator: 0, denominator: 0, show: true },
                { rateType: 7, numerator: 0, denominator: 0, show: true },
                { rateType: 6, numerator: 0, denominator: 0, show: true },
                { rateType: 4, numerator: 0, denominator: 0, show: true },
                { rateType: 5, numerator: 0, denominator: 0, show: true },
                { rateType: 2, numerator: 0, denominator: 0, show: false },
                { rateType: 3, numerator: 0, denominator: 0, show: false },
                { rateType: 9, numerator: 0, denominator: 0, show: true },
            ],
            rateTypeName: {
                1: '航班正常率',
                2: '放行正常率',
                3: '始发正常率',
                4: '早高峰始发正常率',
                5: '预计下小时放行正常率',
                6: '落地正常率',
                7: '起飞正常率',
                8: '考核正常率',
                9: '预计当天最高放行正常率',
            },
            areaObj: {
                1: '全场',
                2: '定期',
                3: '客运',
            },
            timeObj: {
                1: '年',
                2: '月',
                3: '周',
                4: '日',
            },

            loading: false,
            rate1: {},
            rate2: {},
            chart1: null,
            chart2: null,
        }
    },
    created() {},

    watch: {
        rate_data: function (val) {
            // if (!this.loading) {
            this.loadRate()
            // }
        },
    },
    methods: {
        stateTypeSelectHandle(command) {
            this.stateTypeSelect = command
            this.loadRate()
        },
        timeSelectHandle(command) {
            this.timeSelect = command
            this.loadRate()
        },
        getPercent(data) {
            let count = _.get(data, 'numerator', 0)
            let total = _.get(data, 'denominator', 0)
            let value = null
            if (count > 0 && total > 0 && count == total) {
                value = 100
            } else if (total == 0) {
                value = 100
            } else {
                value = Math.round((count * 10000) / total) / 100
            }
            return data.rateType == 8 ? this.calcCheckNormal() : value
        },
        getPercentColor(data) {
            let num = this.getPercent(data)
            if (num >= 90) {
                return 'rgb(255, 255, 255)'
            } else if (num < 80) {
                return 'rgb(191, 11, 35)'
            } else {
                return 'rgb(255, 199, 0)'
            }
        },
        loadRate(data) {
            let arrs = _.filter(this.rate_data, (list) => {
                return list.timeType == this.timeSelect && list.statType == this.stateTypeSelect
            })
            this.rateLists.map((list) => {
                arrs.map((arr) => {
                    if (arr.rateType == list.rateType) {
                        _.extend(list, arr)
                    }
                })
            })
            this.$nextTick(() => {
                // this.loading = true
                this.loadTakeOff(arrs, 2, 'takeOffPercent', 'takeOffBox', 1)
                this.loadTakeOff(arrs, 3, 'originatedDeparturePercent', 'originatedBox', 2)
            })
        },
        calcCheckNormal() {
            let takeOffObj = _.find(this.rateLists, { rateType: 2 })
            let departObj = _.find(this.rateLists, { rateType: 7 })
            let takeOffPercent = calcPercent(takeOffObj.numerator, takeOffObj.denominator)
            let departPercent = calcPercent(departObj.numerator, departObj.denominator)
            let checkNormal = takeOffPercent * 0.7 + departPercent * 0.3
            return Math.round(checkNormal * 100) / 100
        },
        loadTakeOff(arrs, rateType, percent, box, num) {
            let arr = _.find(arrs, { rateType })
            this['rate' + num] = arr
            let options = _.cloneDeep(this.options[percent].options)
            let series = this.options.takeOffPercent.options.series(arr)
            options.series = series
            if (this['chart' + num]) {
                this['chart' + num].update({
                    series: series,
                })
            } else {
                this['chart' + num] = Highcharts.chart(box, options)
            }
        },
        getFlightHandle(data) {
            if (this.timeSelect != 4 || data.rateType == 8) {
                return
            }
            postalStore.pub('Worker', 'Home.GetFlightsByIds', {
                ids: data.unNormalList || [],
                webSubName: 'Home.ToolTip.Return',
            })
        },
    },
}
</script>

<style scoped lang='scss'>
.home_rate {
    padding: 7px;
    position: absolute;
    .box_content {
        display: flex;
        position: relative;
        .selectBox {
            position: absolute;
            top: 10px;
            right: 20px;
        }
        .charBox {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 10px;
            .title {
                background: url(../static/imgs/buttonBg.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: 100px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: #fff;
                margin: 20px 0 0;
            }
            .content {
                padding: 10px;
                flex: 1;
                width: 100%;
                height: calc(100% - 40px);
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;

                .rotateBox {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin: -80px 0 0 -80px;
                    width: 160px;
                    height: 160px;
                    background: url(../static/imgs/aniBg.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center 0;
                    animation: Kc infinite 6s linear;
                    @keyframes Kc {
                        0% {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(1turn);
                        }
                    }
                }
                .chartBox {
                    width: 140px;
                    height: 140px;
                    cursor: pointer;
                }
                .center {
                    cursor: pointer;
                    height: 70px;
                    width: 70px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin: -35px 0 0 -35px;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    .line {
                        height: 1px;
                        width: 100%;
                        background: rgba(255, 255, 255, 0.1);
                        margin: 5px 0;
                    }
                    .top {
                        font-size: 24px;
                        color: #177ddc;
                        span {
                            font-size: 16px;
                        }
                    }
                    .bottom {
                        color: #477bff;
                    }
                }
            }
        }
        .rateBox {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            padding: 40px 0 10px;
            margin-left: 20px;
            & > div {
                width: 23.5%;
                background: rgba(0, 0, 0, 0.15);
                border-radius: 5px;
                height: 48%;
                padding: 6px;
                margin: 0 1.5% 1.5% 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                cursor: pointer;
                .title {
                    color: #31c2fc;
                }
                .per {
                    color: #fff;
                    font-size: 20px;
                }
                .process {
                    color: #4181e9;
                    height: 20px;
                }

                // .title {
                //     display: flex;
                //     align-items: center;
                //     justify-content: space-between;
                //     span {
                //         color: #31c2fc;
                //     }

                //     .span1 {
                //         font-size: 20px;
                //     }
                // }
            }
        }
    }
}
</style>
<style>
.rateBox .el-progress-bar__outer {
    background-color: #2a3440;
}
.el-progress-bar__outer {
    height: 2px !important;
}
</style>
