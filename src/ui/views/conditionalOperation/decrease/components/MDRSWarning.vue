<template>
    <div class="MDRSWarning showBox">
        <div class="title">
            <div class="name alib">MDRS预警</div>
            <div class="status" :class="mdrsWarnOpt[mdrsWarn.status] ">{{mdrsWarn.text}}</div>
        </div>
        <div class="content" v-html="dataCotent.content"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dataCotent: {},
            mdrsWarnOpt: {
                1: { text: '生效', className: 'effect' },
                2: { text: '待生效', className: 'noEffect' },
                3: { text: '失效', className: 'invalid' },
            },
            mdrsWarn: {},
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            this.$request.get('msg', 'notice/findCurrentNotice').then((res) => {
                if (res.data) {
                    this.dataCotent = res.data ? _.find(res.data, { category: 'MDRS预警' }) : {}
                    this.mdrsWarn = this.mdrsWarnOpt[this.dataCotent.status]
                }
            })
        },
    },
}
</script>
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
            font-size: 18px;
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
        .effect {
            border-color: #24ca87;
            color: #24ca87;
        }
        .noEffect {
            border-color: #3280e7;
            color: #3280e7;
        }
        .invalid {
            border-color: #888;
            color: #888;
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
