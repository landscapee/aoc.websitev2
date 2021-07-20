<template>
    <div class="settting showBox">
        <div class="title">调整调减设置</div>
        <div class="content">
            <div class="nav">
                <ul>
                    <li :class="navFalg==1?'active':''" @click="navHandle(1)">常态化</li>
                    <li :class="navFalg==2?'active':''" @click="navHandle(2)">大面积延误</li>
                </ul>
                <div @click="refDataHandle">
                    <icon-svg iconClass="xingzhuangjiehe" />
                    最大起降架次
                </div>
            </div>
            <div class="form">
                <el-form label-width="80px">
                    <el-form-item label="轮次">
                        <el-col :span="16">
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
                        <el-col :span="8">
                            <el-button round type="danger" size="mini" @click="restart" :disabled="!$hasRole('edit-new-round',false)">重新开始第一轮</el-button>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="影响时间">
                        <el-date-picker :disabled="editDisabled" v-model="influenceTime" style="width:100%" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp" format="yyyy-MM-dd HH:mm" @change="rateChange1"></el-date-picker>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="进/离">
                                <el-select :disabled="editDisabled" v-model="subData.movement" placeholder="请选择" size="mini" @change="rateChange1">
                                    <el-option v-for="item in movementOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="方向">
                                <el-select :disabled="editDisabled" v-model="subData.direction" placeholder="请选择" size="mini" @change="rateChange1">
                                    <el-option v-for="item in directionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="机场">
                                <el-select :disabled="editDisabled" v-model="subData.airport" placeholder="请选择" size="mini" filterable @change="rateChange1">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="(value,key) in allAirportOptions" :key="key" :label="value" :value="key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="下降比例">
                                <el-input :disabled="editDisabled||!$hasRole('edit-decline-ratio', false)" type="number" v-model="subData.rate" placeholder="下降比例" size="mini" @blur="rateChange" @keyup.enter.native="rateChange"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="恢复时间">
                        <el-date-picker :disabled="editDisabled" v-model="recoverTime" type="datetimerange" style="width:100%" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp" format="yyyy-MM-dd HH:mm"></el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <ele-table :columnConfig="columnConfig" :tableData="tableData"></ele-table>
                <div class="buttonBox">
                    <el-button type="primary" size="mini" @click="submitData" :disabled="editDisabled||!$hasRole('edit-submit-calc',false)">提交</el-button>
                </div>
            </div>
        </div>
        <decrease-dialog ref="ref_decreaseDialog" />

    </div>
</template>
<script>
import PostalStore from '@/ui/lib/postalStore'
let postalStore = new PostalStore()
import { setting_columnConfig } from '../config'
import DecreaseDialog from './decreaseDialog.vue'
export default {
    components: {
        'decrease-dialog': DecreaseDialog,
    },
    props: ['currentReduce', 'currentReduceLists', 'currentType'],
    data() {
        return {
            navFalg: 1,
            value: '',
            options: [],
            columnConfig: setting_columnConfig,
            tableData: [{ adjust: '计划调整' }, { adjust: '计划调减' }],
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
                airport: '',
                direction: '',
                movement: '',
                rate: '',
                recoverBeginTime: '',
                recoverEndTime: '',
                startTime: '',
                endTime: '',
                reduceplanNo: 1,
                status: 1,
            },
            recoverTime: [new Date().getTime(), new Date().getTime()],
            influenceTime: [new Date().getTime(), new Date().getTime()],
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

            this.subData = {
                airport: val.reduceInfo.airports,
                direction: val.reduceInfo.directions,
                movement: val.reduceInfo.movement,
                rate: val.reduceInfo.declineRatio,
                recoverBeginTime: val.reduceInfo.recoverBeginTime,
                recoverEndTime: val.reduceInfo.recoverEndTime,
                startTime: val.reduceInfo.beginTime,
                endTime: val.reduceInfo.endTime,
                reduceplanNo: val.reduceInfo.reduceplanNo,
                status: val.reduceInfo.status,
            }
            //     this.editDisabled = true
            // }

            this.editDisabled = !!val.reduceId

            this.recoverTime = [val.reduceInfo.recoverBeginTime, val.reduceInfo.recoverEndTime]
            this.influenceTime = [val.reduceInfo.beginTime, val.reduceInfo.endTime]
            this.setSuggest(val.suggest)
        },
        currentType: function (val) {
            this.navFalg = val
        },
    },
    methods: {
        refDataHandle() {
            this.$refs.ref_decreaseDialog.initData()
        },
        rateChange() {
            if (
                this.subData.rate < 25 ||
                !_.isInteger(parseInt(this.subData.rate)) ||
                this.subData.rate > 100
            ) {
                this.subData.rate = ''
                this.$message.error('请输入25-100之间的整数')
                return false
            }
            this.rateChange1()
        },
        rateChange1() {
            if (
                !_.isInteger(parseInt(this.subData.rate)) ||
                this.subData.rate < 25 ||
                this.subData.rate > 100
            ) {
                return
            }
            let data = {
                direction: this.subData.direction,
                movement: this.subData.movement,
                rate: this.subData.rate,
                startTime: this.influenceTime[0],
                endTime: this.influenceTime[1],
            }

            this.$request.post('adverse', 'adjust/getSuggestReduce', data).then((res) => {
                if (res.data) {
                    this.setSuggest(res.data)
                }
            })
        },
        setSuggest(suggest) {
            this.tableData = [
                {
                    adjust: '计划调整',
                    ..._.mapValues(suggest, (item) => item.A || 0),
                },
                {
                    adjust: '计划调减',
                    ..._.mapValues(suggest, (item) => item.R || 0),
                },
            ]
        },
        navHandle(idx) {
            if (_.get(this.currentReduce, 'reduceInfo.status') === 0) {
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
            if (
                this.subData.rate < 25 ||
                !_.isInteger(parseInt(this.subData.rate)) ||
                this.subData.rate > 100
            ) {
                this.$message.error('下降比例请输入25-100之间的整数！')
                return false
            }

            if (this.recoverTime[0] < this.influenceTime[1]) {
                this.$message.error('恢复开始时间不能影响结束时间！')
                return false
            }

            let data = _.cloneDeep(this.subData)

            data.recoverBeginTime = this.recoverTime[0]
            data.recoverEndTime = this.recoverTime[1]
            data.startTime = this.influenceTime[0]
            data.endTime = this.influenceTime[1]
            data.type = this.navFalg
            delete data.status
            //             airport: ""
            // direction: ""
            // endTime: "1625846400000"
            // movement: ""
            // rate: "50"
            // recoverBeginTime: "1625986800000"
            // recoverEndTime: "1626073200000"
            // reducePlanNo: 1
            // startTime: "1625760000000"
            // type: "1"
            this.$request.post('adverse', 'adjust/newReduce', data).then((res) => {
                this.$emit('updateNowCur')
            })
        },
        handleReducePlanNo(reduceplanNo) {
            if (_.get(this.currentReduce, 'reduceInfo.status') === 0) {
                this.$alert('当前轮次尚未结束,不能切换!', '提示', {
                    type: 'warning',
                    center: true,
                })
                return
            }
            if (reduceplanNo != 'add') {
                this.$emit('change-planno', reduceplanNo)
            } else {
                if (this.$hasRole('edit-add-round', true)) {
                    let newList = _.find(this.currentReduceLists, { reduceId: '' })
                    if (newList) {
                        this.$alert('当前已有新增轮次，不能再次新增!', '提示', {
                            type: 'warning',
                            center: true,
                        })
                        return
                    }

                    this.$emit('add-planno')
                }
            }
        },
        restart() {
            if (_.get(this.currentReduce, 'reduceInfo.status') === 0) {
                this.$alert('当前轮次尚未结束,不能重新开始!', '提示', {
                    type: 'warning',
                    center: true,
                })
                return
            }
            this.$emit('restart')
        },
    },
}
</script>
<style scoped lang='scss'>
.settting {
    height: 515px;
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
