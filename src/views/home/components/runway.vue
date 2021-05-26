<template>
    <div class="runway">
        <div class="box_content">
            <div class="title">
                跑道运行模式
            </div>
            <div class="direction">
                <el-select v-model="select" placeholder="请选择">
                    <el-option label="南" :value="0"></el-option>
                    <el-option label="北" :value="1"></el-option>
                </el-select>
            </div>
            <div>
                <div class="selectGroup">
                    <div class="label">
                        10
                    </div>
                    <el-select v-model="select" placeholder="请选择">
                        <el-option label="南" :value="0"></el-option>
                        <el-option label="北" :value="1"></el-option>
                    </el-select>
                </div>
                <div class="selectGroup">
                    <div class="label">
                        10
                    </div>
                    <el-select v-model="select" placeholder="请选择">
                        <el-option label="南" :value="0"></el-option>
                        <el-option label="北" :value="1"></el-option>
                    </el-select>
                </div>
                <div class="selectGroup">
                    <div class="label">
                        10
                    </div>
                    <el-select v-model="select" placeholder="请选择">
                        <el-option label="南" :value="0"></el-option>
                        <el-option label="北" :value="1"></el-option>
                    </el-select>
                </div>
                <button>提 交</button>
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
.runway {
    padding: 4px;
    height: 35%;
    .box_content {
        height: 100%;
        width: 100%;
        background: linear-gradient(
            134deg,
            rgba(26, 39, 64, 0.5) 0,
            rgba(29, 47, 67, 0.5) 30%,
            rgba(29, 47, 67, 0.5) 100%
        ) !important;
        padding: 5px 15px 0;
        .title {
            color: #fff;
            line-height: 20px;
            display: flex;
            align-items: center;
        }
        .title:before {
            content: '';
            display: inline-block;
            height: 16px;
            width: 5px;
            background: #0566ff;
            border-radius: 1px;
            margin-right: 5px;
        }
        .direction {
            padding: 20px 0;
            border-bottom: 2px dashed rgba(179, 189, 220, 0.2);
        }
        .selectGroup {
            display: flex;
            margin-top: 20px;
            .label {
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: #fff;
                border-width: 1px 0 1px 1px;
                border-color: #37455c;
                border-style: solid;
                width: 30px;
                font-size: 12px;
                background: #101c2f;
            }
        }
        button {
            width: 100%;
            height: 34px;
            opacity: 1;
            background: #2e67f6;
            border-radius: 2px;
            border: none;
            margin-top: 20px;
            color: #fff;
        }
    }
}
</style>
