<template>
    <div class="home_number2" :class="options.position">
        <div class="box_content" @click="flightDialogHandle">
            <div class="left">
                <div class="top fo">
                    {{activeData}}
                </div>
                <div class="footer">
                    {{options.title}}
                </div>
            </div>
            <div class="right">
                <img :src="src" alt="">
            </div>
        </div>
    </div>
</template>

<script>
const fanhang = require('../../../assets/img/home/fanhang.png')
const benchang = require('../../../assets/img/home/benchang.png')
const waichang = require('../../../assets/img/home/waichang.png')
const quxiao = require('../../../assets/img/home/quxiao.png')
export default {
    props: ['options', 'flight_home'],
    data() {
        return {
            select: 0,
            activeData: 0,
            detail: [],
            stat: {},
            fanhang,
            benchang,
            waichang,
            quxiao,
            src: '',
        }
    },
    created() {},
    mounted() {
        this.src = this[this.options.icon]
    },
    watch: {
        flight_home: function () {
            this.load_flight_home()
        },
    },
    methods: {
        load_flight_home() {
            this.activeData = this.options.value(this.flight_home)
        },
        flightDialogHandle() {
            this.$emit('flight-dialog-handle', this.options)
        },
    },
}
</script>

<style scoped lang='scss'>
.home_number2 {
    padding: 7px;
    position: absolute;
    .box_content {
        padding: 8px 20px 8px 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .top {
            color: #fff;
            font-size: 28px;
            margin-bottom: 5px;
        }
        .footer {
            color: #909090 !important;
        }
        .right {
            svg {
                font-size: 50px;
            }
        }
    }
}
</style>
<style lang='scss'>
</style>
