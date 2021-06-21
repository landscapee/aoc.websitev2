<template>
    <div class="recommend showBox">
        <div class="title">
            <div class="name">推荐调时调减架次</div>
            <div class="right">
                <span style="margin-right:6px">反馈时长</span>
                <el-input placeholder="请输入" size="mini" style="width:70px" />
                <span style="margin:0 15px 0 5px;color: #60779b;">分钟</span>
                倒计时:
                10分10秒
            </div>
        </div>
        <div class="table">
            <ele-table :columnConfig="columnConfig" :tableData="tableData"></ele-table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            columnConfig: [
                {
                    key: 'name',
                    label: '航司',
                },
                {
                    key: 'sum',
                    label: '计划调减',
                },
                {
                    key: 'in',
                    label: '计划调整',
                },
                {
                    key: '',
                    type: 'operate',
                    label: '操作',
                    operates: [
                        {
                            display: () => {
                                return '<i class="iconfont icon-feijia"></i>'
                            },
                            click: ({ row }) => {
                                console.log(row)
                            },
                        },
                    ],
                },
            ],
            tableData: [
                { name: '计划调时', sum: 10, in: 2 },
                { name: '计划调减', sum: 12, in: 3 },
            ],
        }
    },
}
</script>
<style lang="scss" scoped>
.recommend {
    flex: 1;
    margin: 15px 0;
    padding: 0 15px;
    .title {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
            color: #fff;
            line-height: 30px;
            display: flex;
            align-items: center;
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
        .right {
            color: #fff;
            font-size: 12px;
            display: flex;
            align-items: center;
        }
    }
    .table {
    }
}
</style>