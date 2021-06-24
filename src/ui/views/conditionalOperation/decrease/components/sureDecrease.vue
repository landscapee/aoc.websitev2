<template>
    <div class="sureDecrease showBox">
        <div class="title">
            <div class="name alib">
                确认调时调减
            </div>
        </div>
        <el-row tag="ul" class="showDetails">
            <el-col tag="li" :span="6">全部(27/27)</el-col>
            <el-col tag="li" :span="6">川航(7/7)</el-col>
            <el-col tag="li" :span="6">东航(7/7)</el-col>
            <el-col tag="li" :span="6">南航(7/7)</el-col>
        </el-row>
        <el-row tag="ul" class="showDetails">
            <el-col tag="li" :span="6">成航(7/7)</el-col>
            <el-col tag="li" :span="6">藏航(7/7)</el-col>
            <el-col tag="li" :span="6">深航(7/7)</el-col>
            <el-col tag="li" :span="6">祥航(7/7)</el-col>
        </el-row>
        <div class="tab">
            调时航班(23/20)
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig" :tableData="tableData"></ele-table>
        </div>
        <div class="tab">
            调减航班(23/20)
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig" :tableData="tableData"></ele-table>
        </div>
        <div class="buttonBox">
            <el-button type="primary" size="mini">发布</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            columnConfig: [
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
            ],
            tableData: [],
        }
    },
    mounted() {
        setTimeout(() => {
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
                    inType: 0,
                },
            ]
        }, 1000)
    },
}
</script>

<style lang="scss" scoped>
.sureDecrease {
    flex: 1;
    margin-bottom: 15px;
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
    }
    .showDetails {
        color: #fff;
        padding-left: 10px;
        li {
            font-size: 12px;
            display: flex;
            align-items: center;
            height: 20px;
        }
        li:before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 4px;
            background: #4181e9;
            border-radius: 2px;
            margin-right: 5px;
        }
    }
    .tab {
        background-image: url(../imgs/tabBg.png);
        background-size: 100% 100%;
        display: inline-block;
        height: 24px;
        line-height: 26px;
        font-size: 12px;
        padding: 0 15px;
        margin: 10px 0;
        color: #fff;
    }
    .buttonBox {
        padding: 10px 0 0;
        display: flex;
        justify-content: center;
    }
    // .tableBox {
    //     height: 300px;
    // }
}
</style>