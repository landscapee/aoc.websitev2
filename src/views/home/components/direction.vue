<template>
    <div class="home_direction" :class="options.direction.position">
        <div class="box_content">
            <div class="left">
                <div class="chartBox">
                    <div class="title">
                        <div>
                            <el-select v-model="select" placeholder="请选择">
                                <el-option v-for="item in selectArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                            </el-select>
                        </div>

                    </div>
                    <div id="direction_chart_box"></div>
                </div>
                <div class="bottomBox">
                    <div class="title">
                        <div>
                            方向放行不正常城市排名
                        </div>
                        <div class="rightBox" @click="nowHandle">
                            <div>
                                <i class="iconfont icon-qiehuan"></i>
                            </div>
                            <span v-if="nowShow">当前延误</span>
                            <span v-else>实时延误</span>
                        </div>

                    </div>
                    <div class="content">
                        <div v-for="item in showTable" :key="item.hallway" class="li_content">

                            <div class="nameBox" :style="{color:getPercentColor(activeData[item])}"><span>{{activeData[item].displayHallway}}方向</span><span>{{activeData[item].delay}}</span><span>{{getPercent(activeData[item])}}%</span></div>
                            <div class="dataBox">
                                <ul>
                                    <li v-for="list in activeData[item].citys" :key="list.cityCode">
                                        <div>{{list.cityName}}<span>{{list.count}}</span></div>

                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">

            </div>
        </div>
    </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import map from 'highcharts/modules/map'

map(Highcharts)
export default {
    props: ['options', 'flight_direction'],
    data() {
        return {
            select: 'normal',
            selectArr: [
                { name: '航班正常率', value: 'normal' },
                { name: '始发正常率', value: 'originalAllowTakeOff' },
                { name: '落地正常率', value: 'arriveNormal' },
                { name: '起飞正常率', value: 'departureNormal' },
                { name: '早高峰正常率', value: 'originalInMorning' },
                { name: '放行正常率', value: 'takeOffNormal' },
            ],
            loadMaping: false,
            nowShow: true,
            activeData: {
                1: {},
                2: {},
                3: {},
                4: {},
                5: {},
                6: {},
            },
            showTable: [3, 4, 5, 1, 2, 6],

            //key当前业务value实时业务
        }
    },
    created() {},
    mounted() {},
    watch: {
        flight_direction: function (val) {
            console.log(val)
            if (!this.loadMaping) {
                this.loadMap()
            }
        },
    },
    methods: {
        nowHandle() {
            this.nowShow = !this.nowShow

            this.activeData = this.nowShow
                ? _.keyBy(this.flight_direction.key[this.select], 'hallway')
                : _.keyBy(this.flight_direction.value[this.select], 'hallway')
        },
        getPercent(data) {
            let count = _.get(data, 'delay', 0)
            let total = _.get(data, 'delayCount', 0)
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
            if (num <= 10) {
                return '#477bff'
            } else if (num > 20) {
                return '#e751b0'
            } else {
                return '#35a6ff'
            }
        },
        loadMap() {
            // let options = {}
            // let def = this.options.map
            // _.each(def.options, (v, k) => {
            //     if (_.isFunction(v)) {
            //         console.log(k)
            //         // options[k] = v.call(null, data)
            //     } else {
            //         options[k] = v
            //     }
            // })
            let options = _.cloneDeep(this.options.map.options)

            let series = this.options.map.options.series(this.flight_direction.key[this.select])
            options.series = series
            options.plotOptions.series.marker.lineColor = '#397DFF'
            options.series[2].color = '#397DFF'
            options.series[1].data[0].marker.lineColor = '#397DFF'
            options.series[0].nullColor = '#e4f7ff'
            console.log(options)
            this.loadMaping = true
            this.chart = Highcharts.mapChart('direction_chart_box', options)

            this.activeData = this.nowShow
                ? _.keyBy(this.flight_direction.key[this.select], 'hallway')
                : _.keyBy(this.flight_direction.value[this.select], 'hallway')
            console.log(this.activeData)
        },
    },
}
</script>

<style scoped lang='scss'>
.home_direction {
    padding: 4px;
    position: absolute;
    .box_content {
        display: flex;
        .left {
            width: 80%;
            height: 100%;
            border-right: 2px dashed rgba(179, 189, 220, 0.2);
            .chartBox {
                height: calc(100% - 280px);
                padding: 0 15px;
                overflow: hidden;
                .title {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    z-index: 99;
                    & > div:before {
                        content: '';
                        display: inline-block;
                        height: 16px;
                        width: 5px;
                        background: #0566ff;
                        border-radius: 1px;
                        margin-right: 5px;
                    }
                }
            }
            .bottomBox {
                height: 280px;
                padding: 0 15px;
                .title {
                    display: flex;
                    justify-content: space-between;
                    color: #fff;
                    font-weight: 700;
                    height: 30px;
                    align-items: center;
                }

                .rightBox {
                    display: flex;
                    height: 24px;
                    align-items: center;
                    background: rgba(246, 115, 81, 0.3);
                    padding: 0 7px 0 4px;
                    border-radius: 20px;
                    & > div {
                        height: 18px;
                        width: 18px;
                        border-radius: 18px;
                        background: #f67351;
                        color: #fff;
                        justify-content: center;
                        display: flex;
                        align-items: center;
                        margin-right: 7px;
                        i {
                            font-size: 12px;
                            font-weight: 100;
                        }
                    }
                }
                .content {
                    .li_content {
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .nameBox {
                            width: 140px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .dataBox {
                            width: calc(100% - 120px);
                            overflow: hidden;
                            height: 100%;
                        }
                        ul {
                            display: flex;
                            height: 100%;
                            overflow: auto;

                            li {
                                height: 100%;
                                width: 120px;

                                padding: 1px;
                                div {
                                    height: 100%;
                                    background: rgba(42, 58, 95, 0.6);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: #fff;
                                }
                            }
                        }
                    }
                }
            }
        }
        .right {
            width: 20%;
        }
    }
}
</style>

