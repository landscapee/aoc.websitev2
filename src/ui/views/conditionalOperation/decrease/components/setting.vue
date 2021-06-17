<template>
    <div class="settting showBox">
        <div class="title">调时调减设置</div>
        <div class="content">
            <div class="nav">
                <ul>
                    <li :class="navFalg==0?'active':''" @click="navFalg=0">常态化</li>
                    <li :class="navFalg==1?'active':''" @click="navFalg=1">大面积延误</li>
                </ul>
                <div>
                    <icon-svg iconClass="xingzhuangjiehe" />
                    最大起降架次
                </div>
            </div>
            <div class="form">
                <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="轮次">
                        <el-col :span="20">
                            <div>
                                <el-select v-model="value" placeholder="请选择" size="mini">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <el-button round type="danger" size="mini">结束</el-button>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="影响时间">
                        <el-date-picker v-model="time" type="datetime" placeholder="选择影响时间" style="width:100%"></el-date-picker>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="进/离">
                                <el-select v-model="value" placeholder="请选择" size="mini">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="方向">
                                <el-select v-model="value" placeholder="请选择" size="mini">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="机场">
                                <el-select v-model="value" placeholder="请选择" size="mini">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="下降比例">
                                <el-select v-model="value" placeholder="请选择" size="mini">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="恢复时间">
                        <el-date-picker v-model="time" type="datetime" placeholder="选择影响时间" style="width:100%"></el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <ele-table :columnConfig="columnConfig" :tableData="tableData"></ele-table>
                <div class="buttonBox">
                    <el-button type="primary" size="mini">提交</el-button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            navFalg: 0,
            ruleForm: {},
            time: '',
            value: '',
            options: [],
            columnConfig: [
                {
                    key: 'name',
                    label: '调整/调减',
                    width: '88px',
                },
                {
                    key: 'sum',
                    label: '总数',
                    width: '50px',
                },
                {
                    key: 'in',
                    label: '国航',
                    width: '50px',
                },
                {
                    key: 'in',
                    label: '川航',
                    width: '50px',
                },
                {
                    key: 'in',
                    label: '东航',
                    width: '50px',
                },
                {
                    key: 'in',
                    label: '南航',
                    width: '50px',
                },
                {
                    key: 'in',
                    label: '成航',
                    width: '50px',
                },
                {
                    key: 'in',
                    label: '祥鹏',
                    width: '50px',
                },
                {
                    key: 'in',
                    label: '其他',
                    width: '50px',
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
<style scoped lang='scss'>
.settting {
    .title {
        width: calc(100% - 8px);
        height: 28px;
        background: linear-gradient(180deg, #2e67f6, rgba(0, 75, 205, 0.8));
        box-shadow: 0px 0px 6px 0px #2f3d8e;
        color: #fff;
        line-height: 28px;
        text-align: center;
        margin: 4px 4px 0;
    }
    .content {
        padding: 15px;
        .nav {
            height: 34px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            background: #16294a;
            border-bottom: 1px solid rgba(65, 129, 233, 0.5);

            ul {
                li {
                    display: inline-block;
                    height: 100%;
                    line-height: 34px;
                    padding: 0 16px;
                    cursor: pointer;
                }
                li.active {
                    background: #0566ff;
                    border-radius: 4px 4px 0px 0px;
                }
            }
            div {
                cursor: pointer;
                margin-right: 5px;
            }
        }
        .form {
            padding: 10px 0 0;
            color: #fff;
            .el-form-item {
                margin-bottom: 10px !important;
                label {
                    color: #fff;
                }
            }
        }
    }
    .table {
        .buttonBox {
            padding: 10px 0 0;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
