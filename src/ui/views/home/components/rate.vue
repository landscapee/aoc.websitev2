<template>
    <div class="home_rate" :class="options.rate.position">
        <div class="box_content">
            <div class="selectBox">
                <el-dropdown trigger="click" @command="stateTypeSelectHandle" style="margin-right:15px">
                    <span class="el-dropdown-link">
                        全场<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">全场</el-dropdown-item>
                        <el-dropdown-item command="2">定期</el-dropdown-item>
                        <el-dropdown-item command="3">客运</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click" @command="timeSelectHandle">
                    <span class="el-dropdown-link">
                        年<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">年</el-dropdown-item>
                        <el-dropdown-item command="2">月</el-dropdown-item>
                        <el-dropdown-item command="3">周</el-dropdown-item>
                        <el-dropdown-item command="4">日</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <!-- <el-select v-model="stateTypeSelect" placeholder="请选择" size="mini" @change="loadRate">
                    <el-option label="全场" :value="1"></el-option>
                    <el-option label="定期" :value="2"></el-option>
                    <el-option label="客运" :value="3"></el-option>
                </el-select>
                <el-select v-model="timeSelect" placeholder="请选择" size="mini" @change="loadRate">
                    <el-option label="年" :value="1"></el-option>
                    <el-option label="月" :value="2"></el-option>
                    <el-option label="周" :value="3"></el-option>
                    <el-option label="日" :value="4"></el-option>
                </el-select> -->
            </div>
            <div class="charBox">
                <div class="title">
                    放行正常率
                </div>
                <div class="content">
                    <div class="rotateBox"></div>
                    <div id="takeOffBox" class="chartBox"></div>
                    <div class="center">
                        <div class="top fo">
                            {{getPercent(rate1)}}%
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
                    <div id="originatedBox" class="chartBox"></div>
                    <div class="center">
                        <div class="top fo">
                            {{getPercent(rate2)}}%
                        </div>
                        <div class="line"></div>
                        <div class="bottom fo">
                            {{rate2.numerator}}/{{rate2.denominator}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="rateBox">
                <div v-for="item in rateLists" :key="item.rateType" v-show="item.show">
                    <!-- <div class="title">
                        <span :style="{color:getPercentColor(item)}">{{rateTypeName[item.rateType]}}</span>
                        <span class="span1 fo" :style="{color:getPercentColor(item)}">{{getPercent(item)}}%</span>
                    </div> -->
                    <div class="title">{{rateTypeName[item.rateType]}}</div>
                    <div class="per fo">{{getPercent(item)}}%</div>
                    <el-progress :percentage="getPercent(item)" :show-text="false" :color="colors"></el-progress>
                    <div class="process fo">{{item.numerator}}/{{item.denominator}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import highchartsMore from 'highcharts/highcharts-more'
import solidgauge from 'highcharts/modules/solid-gauge'
highchartsMore(Highcharts)
solidgauge(Highcharts)
export default {
    props: ['options', 'rate_data'],
    data() {
        return {
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
            loading: false,
            rate1: {},
            rate2: {},
        }
    },
    created() {},
    mounted() {
        console.log(this.options)
        //takeOffPercent
        //originatedDeparturePercent
    },

    watch: {
        rate_data: function (val) {
            if (!this.loading) {
                this.loadRate()
            }
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
            return value
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
            // timeType 表示4中时间类型  年月周日
            // numerator 分子
            // denominator 分母
            // timeType   1表示年  2表示月 3表示周  4表示日
            // rateType   1表示航班正常率 2表示放行正常率 3表示始发正常率  4表示早高峰正常率
            //[{denominator: 26824
            // id: "95b5cebe794143d490c004c69bb2cf78"
            // inputRate: 0
            // numerator: 22935
            // rateType: 1
            // time: "2019"
            // timeType: 1}]
            // "all": 1 全场航班
            // "regular": 2 定期航班
            // "passenger": 3 客运航班
            // 这里用rateType做了groupBy
            let arrs = _.filter(this.rate_data, (list) => {
                return list.timeType == this.timeSelect && list.statType == this.stateTypeSelect
            })
            this.rateLists.map((list) => {
                arrs.map((arr) => {
                    if (arr.rateType == list.rateType) {
                        list.numerator = arr.numerator
                        list.denominator = arr.denominator
                    }
                })
            })
            this.$nextTick(() => {
                this.loadTakeOff(arrs, 2, 'takeOffPercent', 'takeOffBox', 1)
                this.loadTakeOff(arrs, 3, 'originatedDeparturePercent', 'originatedBox', 2)
            })
        },
        loadTakeOff(arrs, rateType, percent, box, num) {
            let arr = _.find(arrs, { rateType })

            this['rate' + num] = arr
            let options = _.cloneDeep(this.options[percent].options)
            let series = this.options.takeOffPercent.options.series(arr)
            // series[0].data[0].color = this.getPercentColor(arr)
            options.series = series
            this.loading = true
            this.chart = Highcharts.chart(box, options)
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
            .title {
                background: url(../static/imgs/buttonBg.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: 100px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: #fff;
                margin: 10px 0 0;
            }
            .content {
                padding: 10px;
                flex: 1;
                width: 100%;
                height: calc(100% - 30px);
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
                }
                .center {
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
                        font-size: 26px;
                        color: #fff;
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
                width: 23%;
                background: rgba(0, 0, 0, 0.15);
                border-radius: 5px;
                height: 48%;
                padding: 6px;
                margin: 0 2% 2% 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .title {
                    color: #31c2fc;
                }
                .per {
                    color: #fff;
                    font-size: 20px;
                }
                .process {
                    color: #4181e9;
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
</style>
