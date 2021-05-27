<template>
    <div id="home">
        <div class="home_left">
            <div class="p-0x0 s-12x1 numberBox">
                <number v-for="(item,index) in numbersArr" :key="item.type+index" :options="item" :data="data" />
            </div>
            <number2 v-for="(item,index) in numbers2Arr" :key="item.type+index" :options="item" :data="data" />
            <month-delay :options="monthData" :data="data" />
            <flight-chart :data="chartData" />

        </div>
        <div class="home_right">
            <top-flight />
            <runway />
        </div>

    </div>
</template>

<script>
import { postions } from './static/js/postions.js'
import { settings as settingsCfg } from './static/js/settingHome'
import Number from './components/number'
import Number2 from './components/number2'
import MonthDelay from './components/monthDelay'
import Topflight from './components/topflight'
import Runway from './components/runway'
import FlightChart from './components/FlightChart'

export default {
    data() {
        return {
            settings: {},
            numbersArr: [],
            numbers2Arr: [],
            monthData: {},

            dataRowsArr: [],
            chartData: {},
            data: {},
        }
    },
    components: {
        number: Number,
        number2: Number2,
        'month-delay': MonthDelay,
        'top-flight': Topflight,
        runway: Runway,
        'flight-chart': FlightChart,
    },
    created() {
        this.loadSetting()

        this.$pub('Worker', 'Page.Home.Start', '')

        this.$sub('Web', 'home.init.data', (data) => {
            console.log(data)
            this.loadData(data)
        })
        // this.$sub('Web', 'Home.Situation.response', (response) => {
        //     console.log(response)
        // })
    },
    mounted() {},
    methods: {
        loadData(data) {
            this.data = data
        },
        loadSetting() {
            this.settings = {}
            _.each(settingsCfg, (item, k) => {
                if (postions[k]) {
                    this.settings[k] = _.assign({}, item, postions[k])
                    if (postions[k]) {
                        if (item.type == 'number') {
                            this.numbersArr.push(_.assign({}, item, postions[k]))
                        }
                        if (item.type == 'number2') {
                            this.numbers2Arr.push(_.assign({}, item, postions[k]))
                        }
                        if (item.type == 'month') {
                            this.monthData = _.assign({}, item, postions[k])
                        }
                        if (item.type == 'dataRows') {
                            this.dataRowsArr.push(_.assign({}, item, postions[k]))
                        }
                        if (item.type == 'chart') {
                            this.chartData = _.assign({}, item, postions[k])
                        }
                    }
                }
            })
            console.log({
                number: this.numbersArr,
                number2: this.numbers2Arr,
                month: this.monthData,
                chart: this.chartData,
                dataRows: this.dataRowsArr,
            })
        },
    },
}
</script>

<style scoped lang='scss'>
#home {
    display: flex;
    .home_left {
        width: calc(100% - 265px);
        height: 100%;
        position: relative;
        & > div {
            overflow: hidden;
        }
    }
    .home_right {
        width: 265px;
    }
    .numberBox {
        position: absolute;
    }

    $columnTotal: 25;
    $rowTotal: 10;
    $unitWidth: 100% / $columnTotal;
    $unitHeight: 100% / $rowTotal;

    @for $row from 0 through 10 {
        @for $col from 0 through 25 {
            .p-#{$col}x#{$row} {
                left: $col * $unitWidth;
                top: $row * $unitHeight;
            }

            .s-#{$col}x#{$row} {
                width: $unitWidth * $col;
                height: $unitHeight * $row;
            }
        }
    }
}
</style>

<style lang='scss'>
.home_left {
    .el-select {
        input {
            background-color: rgba(216, 216, 216, 0.1);
            border: none;
            color: #fff;
        }
    }
}
.homeSelect {
    li {
        height: 20px;
        line-height: 20px;
        padding: 0 5px;

        span {
            font-size: 12px;
        }
    }
}
.home_right {
    .el-select {
        input {
            background-color: #101c2f;
            border: 1px solid #37455c;
            color: #fff;
            height: 30px;
        }
    }
}
.selectGroup {
    .el-select {
        input {
            border-radius: 0 4px 4px 0;
        }
    }
}
</style>
