<template>
    <div class="home_number" :class="options.position">
        <div class="box_content">
            <div class="top">
                <el-select v-model="select" placeholder="请选择" size="mini" popper-class="homeSelect" @change="load_flight_home">
                    <el-option label="全场" value="all"></el-option>
                    <el-option label="国内" value="domestic"></el-option>
                    <el-option label="国际" value="international"></el-option>
                </el-select>
                <span class="pre fo">{{percentage}}%</span>
            </div>
            <div class="mid">
                <div class="left">
                    <div class="num">
                        <span class="actual fo">{{activeData[0]}}</span>
                        <span class="plan fo">/{{activeData[1]}}</span>
                    </div>
                    <div class="name">
                        {{options.title}}
                    </div>
                </div>
                <div class="right">
                    <icon-svg :iconClass="options.icon" />
                </div>

            </div>
            <div class="footer" :style="{'background-color':options.barBg}">
                <div class="bar" :style="{background:options.barColor,width:percentage+'%'}"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['options', 'flight_home'],
    data() {
        return {
            select: 'all',
            activeData: [0, 0],
            percentage: '0',
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
            this.activeData = this.options.value(this.flight_home, this.select)

            this.percentage =
                this.activeData[1] == 0
                    ? 0
                    : Math.ceil((this.activeData[0] / this.activeData[1]) * 10000) / 100
        },
    },
}
</script>

<style scoped lang='scss'>
.home_number {
    padding: 4px;
    position: absolute;
    .box_content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0;
        .top {
            display: flex;
            justify-content: space-between;
            padding: 5px 10px 0;
            .pre {
                color: #fff;
                font-size: 12px;
            }
        }
        .mid {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            .left {
                display: flex;
                flex-direction: column;
            }
            .num {
                color: #fff;
                margin-bottom: 4px;
                .actual {
                    font-size: 24px;
                }
            }
            .name {
                color: #fff;
                font-size: 12px;
            }
            .right {
                svg,
                use {
                    font-size: 44px;
                }
            }
        }
        .footer {
            width: 100%;
            height: 5px;
            .bar {
                height: 100%;
                border-radius: 0 5px 5px 0;
            }
        }
    }
}
</style>
<style lang='scss'>
.home_number {
    .top {
        .el-select {
            width: 50px;
        }
        input {
            font-size: 12px;
            height: 16px;
            padding: 3px;
            color: rgba(255, 255, 255, 0.5);
            background: none;
            height: 20px;
        }
        .el-input__icon {
            width: auto;
            line-height: 20px;
            font-size: 12px;
        }
    }
}
</style>
