<template>
    <div id="home">
        <div class="home_left">
            <number v-for="(item,index) in numbersArr" :key="item.type+index" :data="item" />
            <number2 v-for="(item,index) in numbers2Arr" :key="item.type+index" :data="item" />
            <month-delay />

        </div>
        <div class="home_right">
            <top-flight />
            <runway />
        </div>

    </div>
</template>

<script>
import { postions } from './static/postions.js'
import { settings as settingsCfg } from '../../common/settingHome'
import Number from './components/number'
import Number2 from './components/number2'
import MonthDelay from './components/monthDelay'
import Topflight from './components/topflight'
import Runway from './components/runway'

export default {
    data() {
        return {
            settings: {},
            numbersArr: [],
            numbers2Arr: [],
            dataRowsArr: [],
            chartArr: [],
        }
    },
    components: {
        number: Number,
        number2: Number2,
        'month-delay': MonthDelay,
        'top-flight': Topflight,
        runway: Runway,
    },
    created() {
        this.loadSetting()
    },
    mounted() {},
    methods: {
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
                        if (item.type == 'dataRows') {
                            this.dataRowsArr.push(_.assign({}, item, postions[k]))
                        }
                        if (item.type == 'chart') {
                            this.chartArr.push(_.assign({}, item, postions[k]))
                        }
                    }
                }
            })
            console.log({
                number: this.numbersArr,
                number2: this.numbers2Arr,
                dataRows: this.dataRowsArr,
                chart: this.chartArr,
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

    .p-0x0 {
        left: 0;
        top: 0;
    }
    .p-10x0 {
        left: 10%;
        top: 0;
    }
    .p-20x0 {
        left: 20%;
        top: 0;
    }
    .p-30x0 {
        left: 30%;
        top: 0;
    }
    .p-40x0 {
        left: 40%;
        top: 0;
    }
    .p-0x10 {
        left: 0;
        top: 10%;
    }
    .p-0x10 {
        left: 0;
        top: 10%;
    }
    .p-12_5x10 {
        left: 12.5%;
        top: 10%;
    }
    .p-25x10 {
        left: 25%;
        top: 10%;
    }
    .p-37_5x10 {
        left: 37.5%;
        top: 10%;
    }
    .p-0x20 {
        left: 0;
        top: 20%;
    }

    .s-10x10 {
        width: 10%;
        height: 10%;
    }
    .s-12_5x10 {
        width: 12.5%;
        height: 10%;
    }

    .s-50x40 {
        width: 50%;
        height: 40%;
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
