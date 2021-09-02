<template>
    <div class="home_number" :class="options.position">
        <div class="box_content">
            <div class="top">
                <el-dropdown trigger="click" size="mini" @command="load_flight_home">
                    <span class="el-dropdown-link">
                        {{itemsObj[select]}}<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="key" v-for="(item,key) in itemsObj" :key="key">{{item}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
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
            itemsObj: {
                all: '全场',
                domestic: '国内',
                international: '国际',
            },
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
        load_flight_home(command = 'all') {
            this.select = command
            this.activeData = this.options.value(this.flight_home, command)
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
    padding: 7px;
    width: 20%;
    height: 100%;
    .box_content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0;
        .top {
            display: flex;
            justify-content: space-between;
            padding: 3px 10px 0;
            .pre {
                color: #fff;
                font-size: 12px;
            }
            .el-dropdown-link {
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
                .actual {
                    font-size: 20px;
                }
                .plan {
                    font-size: 16px;
                }
            }
            .name {
                color: #fff;
            }
            .right {
                svg,
                use {
                    font-size: 48px;
                }
            }
        }
        .footer {
            width: 100%;
            height: 8px;
            .bar {
                height: 100%;
                border-radius: 0 8px 8px 0;
            }
        }
    }
}
</style>
