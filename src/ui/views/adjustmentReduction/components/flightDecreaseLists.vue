<template>
    <div class="flightDecreaseLists showBox">
        <div class="title">
            <ul>
                <li v-for="(nav,idx) in navLists" :key="idx" :class="navFalg==idx?'active':''" @click="navHandle(idx)">{{nav.name}}({{nav.count}})</li>
            </ul>
            <div class="right">
                <el-input placeholder="请输入航班号" style="width:150px" size="mini" />
                <div class="div1">
                    <div></div>
                    调时
                </div>
                <div class="div2">
                    <div></div>
                    调减
                </div>
            </div>
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig" :tableData="tableData" :setRowClassName="setRowClassName"></ele-table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            navLists: [
                { name: '全部', count: '5' },
                { name: '进港', count: '5' },
                { name: '出港', count: '5' },
            ],
            navFalg: 0,
            columnConfig: [
                { key: 'ind', label: '序号', type: 'index', width: '50px' },
                {
                    key: 'flightNo',
                    label: '航班号',
                },
                {
                    key: 'sta',
                    label: '计划',
                },
                {
                    key: 'code',
                    label: '航司',
                },
                {
                    key: 'flightType',
                    label: '航班类型',
                },
                {
                    key: 'flightLine',
                    label: '航线',
                },
                {
                    key: 'type',
                    label: '国际性质',
                },
                {
                    key: 'in',
                    label: '调时/调减',
                },
            ],
            tableData: [],
        }
    },
    mounted() {
        this.tableData = [
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
                inType: 0,
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
                inType: 1,
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
            {
                flightNo: '3U8888',
                sta: '09:00(23)',
                code: ' 国航',
                flightType: '正班',
                flightLine: ' 成都-上海',
                type: '地区',
                in: '调时',
            },
        ]
    },
    methods: {
        navHandle(idx) {
            this.navFalg = idx
        },
        setRowClassName(data) {
            if (data.row.inType === 0) {
                return 'row0'
            }
            if (data.row.inType === 1) {
                return 'row1'
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.flightDecreaseLists {
    color: #fff;
    height: 100%;
    .title {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        ul {
            height: 30px;
            li {
                background: rgba(115, 134, 167, 0.15);
                border-radius: 17px;
                cursor: pointer;
                color: #fff;
                padding: 0 15px;
                line-height: 30px;
                display: inline-block;
                margin-right: 12px;
            }
            li.active {
                background: #4181e9;
            }
        }
        .right {
            display: flex;
            height: 30px;
            align-items: center;
            .div1 {
                margin: 0 10px;
                display: flex;
                div {
                    width: 14px;
                    height: 14px;
                    opacity: 1;
                    background: #2c3f6d;
                    margin-right: 5px;
                }
            }
            .div2 {
                display: flex;
                div {
                    width: 14px;
                    height: 14px;
                    opacity: 1;
                    background: #194955;
                    margin-right: 5px;
                }
            }
        }
    }
    .tableBox {
        height: calc(100% - 40px);
        margin-top: 10px;
    }
}
</style>
<style lang="scss">
.flightDecreaseLists {
    .row0 {
        td {
            background-color: #2c3f6d;
        }
    }
    .row1 {
        td {
            background-color: #194955;
        }
    }
}
</style>