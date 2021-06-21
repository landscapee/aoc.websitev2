<template>
    <div class="flightDelay showBox">
        <div class="title">
            <div class="name">
                已延误航班统计<span>(点击柱状图查看详情)</span>
            </div>
        </div>
        <div class="content">
            <div id="flightDelay_charts"></div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.flightDelay {
    flex: 1;
    margin: 15px 0;
    padding: 15px;
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
            font-weight: 600;
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
            width: 5px;
            background: #0566ff;
            border-radius: 1px;
            margin-right: 5px;
        }
    }
    .content {
    }
}
</style>