<template>
    <div class="home_number" :class="data.position">
        <div class="box_content">
            <div class="top">
                <el-select v-model="select" placeholder="请选择" size="mini" popper-class="homeSelect">
                    <el-option label="全场" :value="0"></el-option>
                    <el-option label="国内" :value="1"></el-option>
                    <el-option label="国际" :value="2"></el-option>
                </el-select>
                <span class="pre">58.96%</span>
            </div>
            <div class="mid">
                <div class="left">
                    <div class="num">
                        <span class="actual">651</span>
                        <span class="plan">/1055</span>
                    </div>
                    <div class="name">
                        {{data.title}}
                    </div>
                </div>
                <div class="right">
                    <i class="iconfont" :class="data.icon"></i>
                </div>

            </div>
            <div class="footer" :style="{'background-color':data.barBg}">
                <div class="bar" :style="{'background':data.barColor}"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data'],
    data() {
        return {
            select: 0,
        }
    },
    created() {},
    mounted() {},
    methods: {},
}
</script>

<style scoped lang='scss'>
.home_number {
    height: 10%;
    width: 10%;
    padding: 4px;
    position: absolute;
    .box_content {
        height: 100%;
        width: 100%;
        background: linear-gradient(
            134deg,
            rgba(26, 39, 64, 0.5) 0,
            rgba(29, 47, 67, 0.5) 30%,
            rgba(29, 47, 67, 0.5) 100%
        ) !important;
        padding: 5px;
    }
    .title {
        // input {
        //     font-size: 12px;
        //     height: 20px;
        // }
    }
}
</style>
<style lang='scss'>
.box_content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .top {
        display: flex;
        justify-content: space-between;
        .el-select {
            width: 50px;
        }
        input {
            font-size: 12px;
            height: 16px;
            padding: 3px;
        }
        .el-input__icon {
            width: auto;
            line-height: 16px;
            font-size: 12px;
        }
        .pre {
            color: #fff;
            font-weight: 600;
            font-size: 12px;
        }
    }
    .mid {
        display: flex;
        justify-content: space-between;
        .left {
            display: flex;
            flex-direction: column;
        }
        .num {
            color: #fff;
            margin-bottom: 4px;
            .actual {
                font-size: 14px;
                font-weight: 600;
            }
            .plan {
                font-size: 12px;
            }
        }
        .name {
            color: #fff;
            font-size: 12px;
        }
        .right {
            i {
                font-size: 26px;
            }
        }
    }
    .footer {
        width: 100%;
        height: 5px;
        .bar {
            height: 100%;
            border-radius: 0 5px 5px 0;
            width: 20%;
        }
    }
}
</style>
