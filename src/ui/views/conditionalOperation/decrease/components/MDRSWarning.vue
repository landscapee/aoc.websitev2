<template>
    <div class="MDRSWarning showBox">
        <div class="title">
            <div class="name">MDRS预警</div>
            <div class="status">生效</div>
        </div>
        <div class="content">
            <span>IDEPO海口预计</span>
            <span class="time">11:38-12:38</span>
            <span>受时刻影响，通行能力下降</span>
            <span class="time">2%</span>
            <span>，发布IDEPO海口航班延误</span>
            <span class="color">黄色预警</span>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.MDRSWarning {
    padding: 15px;
    margin-bottom: 15px;
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
        .status {
            width: 53px;
            height: 20px;
            opacity: 1;
            background: rgba(0, 255, 82, 0.17);
            border: 1px solid #24ca87;
            border-radius: 10px 10px 10px 0px;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
        }
    }
    .content {
        color: rgb(255, 255, 255, 0.8);
        line-height: 20px;
        padding: 10px;
        .time {
            font-size: 16px;
            color: #fff;
        }
        .color {
            color: #e93670;
        }
    }
}
</style>
