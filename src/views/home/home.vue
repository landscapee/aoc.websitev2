<template>
    <div id="home">
        <number v-for="(item,index) in numbersArr" :key="index" :data="item" />
        <number2 v-for="(item,index) in numbers2Arr" :key="index" :data="item" />
    </div>
</template>

<script>
import { postions } from './static/postions.js'
import { settings as settingsCfg } from '../../common/setting'
import Number from './components/number'
import Number2 from './components/number2'
export default {
    data() {
        return {
            settings: {},
            numbersArr: [],
            numbers2Arr: [],
        }
    },
    components: {
        number: Number,
        number2: Number2,
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
                    }
                }
            })
            console.log(this.settings, this.numbers2Arr)
        },
    },
}
</script>

<style scoped lang='scss'>
#home {
    position: relative;

    .p-0x0 {
        left: 0;
        top: 0;
    }
    .p-1x0 {
        left: 10%;
        top: 0;
    }
    .p-2x0 {
        left: 20%;
        top: 0;
    }
    .p-3x0 {
        left: 30%;
        top: 0;
    }
    .p-4x0 {
        left: 40%;
        top: 0;
    }
}
</style>
