<template>
    <div class="home_direction" :class="options.direction.position">
        <div class="box_content">
            <div class="left">
                <div class="chartBox">
                    <div class="title">
                        <div>
                            <el-select v-model="select" placeholder="请选择" @change="selectHandle" size="mini">
                                <el-option v-for="item in selectArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div id="direction_chart_box"></div>
                </div>
                <div class="bottomBox">
                    <div class="title">
                        <div class="alib">
                            {{selectNameObj[select]}}不正常城市排名
                        </div>
                        <div class="rightBox" @click="nowHandle">
                            <div>
                                <i class="iconfont icon-qiehuan"></i>
                            </div>
                            <span class="alib" v-if="nowShow">当前延误</span>
                            <span class="alib" v-else>实时延误</span>
                        </div>

                    </div>
                    <div class="content">
                        <div v-for="(item,index) in showTable" :key="item.hallway" class="li_content">

                            <div class="nameBox" :style="{color:getPercentColor(activeData[item])}"><span>{{activeData[item].displayHallway}}方向</span><span>{{activeData[item].delay}}</span><span class="fo">{{getPercent(activeData[item])}}%</span></div>

                            <div class="dataBox" :class="'dataBox'+index">
                                <div style="width:8000px;height:100%;">
                                    <ul :class="'dataBox'+index+'_1'">
                                        <li v-for="list in activeData[item].citys" :key="list.cityCode" @click="cityHandle(list)">
                                            <div>{{list.cityName}}<span>{{list.count}}</span></div>
                                        </li>
                                    </ul>
                                    <ul :class="'dataBox'+index+'_2'">
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="top">
                    <div class="title">
                        <div class="name">
                            <div>流控信息</div>
                        </div>
                        <i class="iconfont icon-yujing"></i>
                    </div>
                    <div class="content dataBox6">
                        <ul class="dataBox6_1">
                            <li v-for="item in noticeData['流控信息']" :key="item.id">
                                {{item.content}}
                            </li>
                        </ul>
                        <ul class="dataBox6_2"></ul>
                    </div>

                </div>
                <div class="bottom">
                    <div class="title">
                        <div class="name">
                            <div>MDRS预警</div>
                        </div>
                    </div>
                    <div class="content dataBox7">
                        <ul class="dataBox7_1">
                            <li v-for="item in noticeData['MDRS预警']" :key="item.id">
                                {{item.content}}
                            </li>
                        </ul>
                        <ul class="dataBox7_2"></ul>
                    </div>

                </div>
            </div>
        </div>
        <el-dialog :title="layerName" :visible.sync="flightDetilShow" class="nodeDialog" center width="700px" :append-to-body="true">
            <!-- <template slot="title">
                <div class="blankDiv"></div>
                <div class="el-dialog__title"> {{layerName}}</div>
                <div class="blankDiv"><i class="el-icon-circle-close" @click="flightDetilShow = false"></i></div>
            </template> -->
            <div class="contentbox">
                <ele-table :columnConfig="columnConfig" :tableData="flightDetilLists"></ele-table>
            </div>
        </el-dialog>

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
            columnConfig: [
                { key: 'ind', label: '序号', type: 'index', width: '50px' },
                {
                    key: 'flightNo',
                    label: '航班号',
                },
                {
                    key: 'scheduleTime',
                    label: '计划起飞',
                    display: ({ row }) => {
                        return this.$moment(row.scheduleTime).format('HH:mm')
                    },
                },
                {
                    key: 'actualTime',
                    label: '计划起飞',
                    display: ({ row }) => {
                        return row.actualTime ? this.$moment(row.actualTime).format('HH:mm') : '-'
                    },
                },
                {
                    key: 'displayRouter',
                    label: '航线',
                    display: ({ row }) => {
                        return row.displayRouter ? row.displayRouter.join('->') : '-'
                    },
                },
            ],
            select: 'normal',
            selectArr: [
                { name: '航班正常率', value: 'normal' },
                { name: '始发正常率', value: 'originalAllowTakeOff' },
                { name: '落地正常率', value: 'arriveNormal' },
                { name: '起飞正常率', value: 'departureNormal' },
                { name: '早高峰正常率', value: 'originalInMorning' },
                { name: '放行正常率', value: 'takeOffNormal' },
            ],
            selectNameObj: {
                normal: '航班',
                originalAllowTakeOff: '始发',
                arriveNormal: '落地',
                departureNormal: '起飞',
                originalInMorning: '早高峰',
                takeOffNormal: '放行',
            },
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
            marqueeVar0: null,
            marqueeVar1: null,
            marqueeVar2: null,
            marqueeVar3: null,
            marqueeVar4: null,
            marqueeVar5: null,
            marqueeVar6: null,
            marqueeVar7: null,
            noticeData: {
                流控信息: [],
                MDRS预警: [],
            },
            flightDetilShow: false,
            flightDetilLists: [],
            layerName: '',

            //key当前业务value实时业务
        }
    },
    created() {
        this.getFindCurrentNotice()
    },
    mounted() {},
    watch: {
        flight_direction: function (val) {
            this.loadMap()
        },
    },
    destroyed() {
        for (var i = 0; i <= 7; i++) {
            if (this['marqueeVar' + i]) {
                clearInterval(this['marqueeVar' + i])
            }
        }
    },
    methods: {
        cityHandle(city) {
            this.layerName = city.cityName + '方向延误'
            this.flightDetilShow = true
            let flightids = city.flightIdList.join(',')
            this.$request
                .post(
                    'situation',
                    'direction/flightDetail',
                    {
                        flightids,
                    },
                    true
                )
                .then((res) => {
                    if (res.data) {
                        console.log(res.data)
                        this.flightDetilShow = true
                        this.flightDetilLists = res.data
                    }
                })
        },
        getFindCurrentNotice() {
            this.$request.get('msg', 'notice/findCurrentNotice').then((res) => {
                if (res.data) {
                    this.noticeData = _.groupBy(res.data, 'category')

                    this.$nextTick(() => {
                        for (var i = 6; i <= 7; i++) {
                            this.loadDataBoxAni(i, 'vertical')
                        }
                    })
                }
            })
        },
        nowHandle() {
            this.nowShow = !this.nowShow

            this.loadActiveData(true)
        },
        selectHandle() {
            this.loadMap()
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
            let series = this.options.map.options.series(this.flight_direction.key[this.select])
            if (!this.loadMaping) {
                this.loadMaping = true
                let options = _.cloneDeep(this.options.map.options)
                options.series = series
                options.plotOptions.series.marker.lineColor = '#397DFF'
                options.series[2].color = '#397DFF'
                options.series[1].data[0].marker.lineColor = '#397DFF'
                options.series[0].nullColor = '#e4f7ff'
                this.chart = Highcharts.mapChart('direction_chart_box', options)
            } else {
                this.chart.update({ series: series })
            }
            this.loadActiveData(false)
        },
        loadActiveData() {
            this.activeData = this.nowShow
                ? _.keyBy(this.flight_direction.key[this.select], 'hallway')
                : _.keyBy(this.flight_direction.value[this.select], 'hallway')
            this.$nextTick(() => {
                for (var i = 0; i <= 5; i++) {
                    this.loadDataBoxAni(i, 'transverse')
                }
            })
        },
        loadDataBoxAni(idx, direction) {
            if (this['marqueeVar' + idx]) {
                clearInterval(this['marqueeVar' + idx])
            }
            var obj = document.getElementsByClassName('dataBox' + idx)[0]
            var obj1 = document.getElementsByClassName('dataBox' + idx + '_1')[0]
            var obj2 = document.getElementsByClassName('dataBox' + idx + '_2')[0]

            if (direction == 'transverse') {
                if (obj1.clientWidth > obj.clientWidth) {
                    this.loadRoll(idx, direction)
                } else {
                    obj2.innerHTML = ''
                    obj.scrollLeft = 0
                }
            } else {
                if (obj1.clientHeight > obj.clientHeight) {
                    this.loadRoll(idx, direction)
                } else {
                    obj2.innerHTML = ''
                    obj.scrollLeft = 0
                }
            }
        },
        loadRoll(idx, direction) {
            var obj = document.getElementsByClassName('dataBox' + idx)[0]
            var obj1 = document.getElementsByClassName('dataBox' + idx + '_1')[0]
            var obj2 = document.getElementsByClassName('dataBox' + idx + '_2')[0]

            obj2.innerHTML = obj1.innerHTML
            this['marqueeVar' + idx] = setInterval(() => {
                if (direction == 'transverse') {
                    if (obj2.offsetWidth <= obj.scrollLeft) {
                        obj.scrollLeft = 1
                    } else {
                        obj.scrollLeft++
                    }
                } else {
                    if (obj.scrollTop >= obj1.scrollHeight) {
                        obj.scrollTop = 1
                    } else {
                        obj.scrollTop++
                    }
                }
            }, 30)
            obj.onmouseover = () => {
                clearInterval(this['marqueeVar' + idx])
            }
            obj.onmouseout = () => {
                this['marqueeVar' + idx] = setInterval(() => {
                    if (direction == 'transverse') {
                        if (obj2.offsetWidth <= obj.scrollLeft) {
                            obj.scrollLeft = 1
                        } else {
                            obj.scrollLeft++
                        }
                    } else {
                        if (obj.scrollTop >= obj1.scrollHeight) {
                            obj.scrollTop = 1
                        } else {
                            obj.scrollTop++
                        }
                    }
                }, 30)
            }
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
            width: 75%;
            height: 100%;
            border-right: 2px dashed rgba(179, 189, 220, 0.2);
            .chartBox {
                height: calc(100% - 280px);
                padding: 15px 15px 0;
                overflow: hidden;

                .title {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    z-index: 99;
                    & > div {
                        display: flex;
                        align-items: center;
                    }
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
                    cursor: pointer;
                    span {
                        color: #f67351;
                    }
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
                            width: calc(100% - 160px);
                            overflow: hidden;
                            height: 100%;
                            position: relative;
                        }
                        ul {
                            height: 100%;
                            white-space: nowrap;
                            float: left;

                            li {
                                height: 100%;
                                min-width: 120px;
                                padding: 1px;
                                display: inline-block;
                                cursor: pointer;
                                div {
                                    height: 100%;
                                    background: rgba(42, 58, 95, 0.6);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: #fff;
                                    padding: 10px;
                                    span {
                                        margin-left: 10px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .right {
            width: 25%;
            & > div {
                height: 50%;
                padding: 15px;
            }
            .title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 26px;
                .name {
                    display: flex;
                }
                .name div {
                    height: 26px;
                    padding: 0 30px 0 10px;
                    border-radius: 0px 13px 13px 0px;
                    line-height: 26px;
                    color: #fff;
                }
                .name:before {
                    content: '';
                    display: inline-block;
                    height: 26px;
                    width: 2px;
                    margin-right: 3px;
                }
                i {
                    font-size: 20px;
                    color: #ffa500;
                }
            }
            .content {
                padding-left: 15px;
                height: calc(100% - 26px);
                overflow: hidden;
                li {
                    line-height: 30px;
                    margin: 5px 0;
                    list-style: inherit;
                }
            }
            .top {
                .name div {
                    background: #ffa500;
                }
                .name:before {
                    background: #ffa500;
                }
                .content {
                    li {
                        color: #ffa600;
                    }
                }
            }
            .bottom {
                .name div {
                    background: #940d5b;
                }
                .name:before {
                    background: #940d5b;
                }
                .content {
                    li {
                        color: #ff63c6;
                    }
                }
            }
        }
    }
}
</style>

