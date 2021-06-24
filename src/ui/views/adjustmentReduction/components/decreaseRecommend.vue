<template>
    <div class="decreaseRecommend showBox">
        <div class="title">
            <div class="name alib">推荐调时时刻<span class="alir">(点击柱状图查看详情)</span></div>
        </div>
        <div class="content">
            <div id="flightDelay_charts"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.decreaseRecommend {
    .title {
        display: flex;
        align-items: center;
        color: #fff;
        .name {
            color: #fff;
            line-height: 30px;
            display: flex;
            align-items: center;
            margin-right: 15px;
            font-size: 18px;
            span {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
                margin-left: 10px;
            }
        }
        .name:before {
            content: '';
            display: inline-block;
            height: 16px;
            width: 4px;
            background: #0566ff;
            border-radius: 1px;
            margin-right: 5px;
        }
    }
}
</style>