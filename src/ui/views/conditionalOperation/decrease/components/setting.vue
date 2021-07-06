<template>
    <div class="settting showBox">
        <div class="title">调时调减设置</div>
        <div class="content">
            <div class="nav">
                <ul>
                    <li :class="navFalg==1?'active':''" @click="navHandle(1)">常态化</li>
                    <li :class="navFalg==2?'active':''" @click="navHandle(2)">大面积延误</li>
                </ul>
                <div>
                    <icon-svg iconClass="xingzhuangjiehe" />
                    最大起降架次
                </div>
            </div>
            <div class="form">
                <el-form label-width="80px">
                    <el-form-item label="轮次">
                        <el-col :span="18">
                            <el-dropdown trigger="click" @command="handleReducePlanNo">
                                <span class="el-dropdown-link">
                                    第{{chineseNum[subData.reduceplanNo-1]}}轮<i class="el-icon-caret-bottom el-icon--right" style="color:#0566ff"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="idx" v-for="(item,idx) in currentReduceLists" :key="idx">第{{chineseNum[item.reduceInfo.reduceplanNo-1]}}轮</el-dropdown-item>
                                    <el-dropdown-item command="add">+</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                        <el-col :span="4">
                            <el-button round type="danger" size="mini" @click="restar">重新开始</el-button>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="影响时间">
                        <el-date-picker :disabled="editDisabled" v-model="influenceTime" style="width:100%" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp"></el-date-picker>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="进/离">
                                <el-select :disabled="editDisabled" v-model="subData.movement" placeholder="请选择" size="mini">
                                    <el-option v-for="item in movementOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="方向">
                                <el-select :disabled="editDisabled" v-model="subData.directions" placeholder="请选择" size="mini">
                                    <el-option v-for="item in directionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="机场">
                                <el-select :disabled="editDisabled" v-model="subData.airports" placeholder="请选择" size="mini" filterable>
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="(value,key) in allAirportOptions" :key="key" :label="value" :value="key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="下降比例">
                                <el-input :disabled="editDisabled" type="number" v-model="subData.declineRatio" placeholder="下降比例" size="mini"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="恢复时间">
                        <el-date-picker :disabled="editDisabled" v-model="recoverTime" type="datetimerange" style="width:100%" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp"></el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <ele-table :columnConfig="columnConfig" :tableData="tableData"></ele-table>
                <div class="buttonBox">
                    <el-button type="primary" size="mini" @click="submitData">提交</el-button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import PostalStore from '@/ui/lib/postalStore'
let postalStore = new PostalStore()
export default {
    props: ['currentReduce', 'currentReduceLists'],
    data() {
        return {
            navFalg: 1,
            value: '',
            options: [],
            columnConfig: [
                {
                    key: 'adjust',
                    label: '调时/调减',
                    width: '90px',
                },
                {
                    key: 'total',
                    label: '总数',
                    width: '57px',
                },
                {
                    key: 'CA',
                    label: '国航',
                    width: '57px',
                },
                {
                    key: '3U',
                    label: '川航',
                    width: '57px',
                },
                {
                    key: 'MU',
                    label: '东航',
                    width: '57px',
                },
                {
                    key: 'CZ',
                    label: '南航',
                    width: '57px',
                },
                {
                    key: 'EU',
                    label: '成航',
                    width: '57px',
                },
                {
                    key: '8L',
                    label: '祥鹏',
                    width: '57px',
                },
            ],
            tableData: [{ adjust: '计划调时' }, { adjust: '计划调减' }],
            directionOptions: [
                { value: '', label: '全部方向' },
                { value: '西安', label: '西安' },
                { value: '贵阳', label: '贵阳' },
                { value: '重庆', label: '重庆' },
                { value: '拉萨', label: '拉萨' },
                { value: '兰州', label: '兰州' },
                { value: '昆明', label: '昆明' },
            ],
            movementOptions: [
                { value: '', label: '全部' },
                { value: 'A', label: '进港' },
                { value: 'D', label: '离港' },
            ],
            allAirportOptions: [],
            chineseNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一'],

            subData: {
                airports: '',
                directions: '',
                movement: '',
                declineRatio: '',
                recoverBeginTime: '',
                recoverEndTime: '',
                startTime: '',
                endTime: '',
                reduceplanNo: 1,
                status: 1,
            },
            recoverTime: [],
            influenceTime: [],
            editDisabled: false,
        }
    },
    mounted() {
        postalStore.pub('Worker', 'Delay.GetCity', null)
        postalStore.sub('Delay.GetCity', (res) => {
            this.allAirportOptions = res
        })
    },
    watch: {
        currentReduce: function (val) {
            if (!val) {
                return
            }
            console.log(val)
            this.subData = val.reduceInfo
            console.log(this.subData)

            this.resetReduceInfo(val.reduceInfo)

            if (this.subData.status == 1) {
                this.editDisabled = false
            } else {
                this.editDisabled = true
            }

            this.recoverTime = [val.reduceInfo.recoverBeginTime, val.reduceInfo.recoverEndTime]
            this.influenceTime = [val.reduceInfo.beginTime, val.reduceInfo.endTime]
            this.tableData = [
                {
                    adjust: '计划调时',
                    ..._.mapValues(val.suggest, (item) => item.A || 0),
                },
                {
                    adjust: '计划调减',
                    ..._.mapValues(val.suggest, (item) => item.R || 0),
                },
            ]
        },
    },
    methods: {
        resetReduceInfo(reduceInfo) {},
        navHandle(idx) {
            if (this.judgeStatus()) {
                //判断是否有未结束
                this.$alert('当前轮次尚未结束,不能切换!', '提示', {
                    type: 'warning',
                    center: true,
                })
                return
            }

            this.navFalg = idx
            this.$emit('change-type', idx)
        },
        submitData() {
            this.subData.recoverBeginTime = this.recoverTime[0]
            this.subData.recoverEndTime = this.recoverTime[1]
            this.subData.beginTime = this.influenceTime[0]
            this.subData.endTime = this.influenceTime[1]

            console.log(this.subData)
        },
        handleReducePlanNo(reduceplanNo) {
            if (reduceplanNo != 'add') {
                this.$emit('change-planno', reduceplanNo)
            } else {
                this.$emit('add-planno')
            }
        },
        restar() {
            if (this.judgeStatus()) {
                //判断是否有未结束
                this.$alert('当前轮次尚未结束,不能重新开始!', '提示', {
                    type: 'warning',
                    center: true,
                })
                return
            }
        },
        judgeStatus() {
            let result = false
            this.currentReduceLists.map((list) => {
                if (list.reduceInfo.status != 1) {
                    result = true
                }
            })
            if (result) {
                this.$alert('当前轮次尚未结束,不能新增轮次!', '提示', {
                    type: 'warning',
                    center: true,
                })
            }

            return result
        },
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
