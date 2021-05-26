<template>
    <div class="home_number2" :class="data.position">
        <div class="box_content">
            <div class="left">
                <div class="top">
                    0
                </div>
                <div class="footer">
                    {{data.title}}
                </div>
            </div>
            <div class="right">
                <icon-svg :iconClass="data.icon" />
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
.home_number2 {
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
        padding: 20px 10px 20px 30px;
        display: flex;
        justify-content: space-between;
        .left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .top {
            color: #fff;
            font-size: 28px;
            font-weight: 600;
        }
        .footer {
            color: #909090 !important;
        }
        .right {
            svg {
                font-size: 40px;
            }
        }
    }
}
</style>
<style lang='scss'>
</style>
