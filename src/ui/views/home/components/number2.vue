<template>
    <div class="home_number2" :class="options.position">
        <div class="box_content">
            <div class="left">
                <div class="top fo">
                    {{activeData}}
                </div>
                <div class="footer">
                    {{options.title}}
                </div>
            </div>
            <div class="right">
                <icon-svg :iconClass="options.icon" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['options', 'flight_home'],
    data() {
        return {
            select: 0,
            activeData: 0,
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
        load_flight_home() {
            this.activeData = this.options.value(this.flight_home)
        },
    },
}
</script>

<style scoped lang='scss'>
.home_number2 {
    padding: 4px;
    position: absolute;
    .box_content {
        padding: 20px 10px 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
