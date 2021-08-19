<template>
    <div>
        <el-dialog :title="title" :close-on-click-modal="false" center :visible.sync="dialogFormVisible" :before-close="close">
            <el-form :model="form" :rules="rules" ref="form" class="demo-form-inline" :inline="true">

                <el-form-item prop="closeScheme" label="是否下客">
                    <el-radio-group @change="dropOffFlagChange" v-model="form.dropOffFlag">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item prop="content" label="下客时间：">
                    <el-date-picker :disabled="form.dropOffFlag==1" v-model="form.dropOffTimeLong" type="datetime" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="content" label="下客人数：">
                    <el-input :disabled="form.dropOffFlag==1" v-model.number="form.dropOffNum" clearable placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item prop="content" label="是否使用安检：">
                    <el-radio-group v-model="form.securityCheck">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="content" label="取消时间：">
                    <el-date-picker v-model="form.cancelTimeLong" type="datetime" placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <div class="footer">
                <span @click="close">取消</span>
                <span @click="save('form')">提交</span>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { map, compact, get } from 'lodash'
import moment from 'moment'

export default {
    name: 'add',
    data() {
        return {
            title: 'ww',
            form: {},
            dialogFormVisible: false,
            rules: {
                title: [{ trigger: 'blur', required: true, message: '请选择' }],
                time: [{ trigger: 'blur', required: true, message: '请选择' }],
            },
        }
    },
    computed: {
        getContent() {
            return (
                this.form.title +
                this.form.specificType +
                this.form.closeScheme +
                this.form.closeEndTime +
                this.form.closeStartTime +
                this.form.level
            )
        },
    },
    watch: {},
    methods: {
        dropOffFlagChange(val) {
            if (val == 1) {
                this.$set(this.form, 'dropOffTimeLong', null)
                this.$set(this.form, 'dropOffNum', null)
            }
        },
        closeSchemeInput(value) {},
        save(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let obj = { ...this.form }
                    let dropOffTimeLong
                    if (obj.dropOffTimeLong) {
                        obj.dropOffTimeLong = new Date(obj.dropOffTimeLong).getTime()
                        obj.dropOffTime = new Date(obj.dropOffTimeLong).getTime()
                    }
                    if (obj.cancelTimeLong) {
                        obj.cancelTimeLong = new Date(obj.cancelTimeLong).getTime()
                    }
                    this.$request.post('adverse', 'deal/dropOff', obj, true).then((res) => {
                        if (res.code == 200) {
                            this.$message.success('编辑成功')
                            this.close()
                            // this.$emit('getList')
                        } else {
                            this.$message.warning(res.message)
                        }
                    })
                } else {
                    return false
                }
            })
        },
        close() {
            this.form = {}
            this.dialogFormVisible = false
            this.$refs['form'].clearValidate()
        },
        open(row) {
            let cancelTimeLong=null
            let dropOffTimeLong = null
            if (row.dropOffTime) {
                dropOffTimeLong = new Date(row.dropOffTime).getTime()
            }
            if (row.cancelTime) {
                cancelTimeLong = new Date(row.cancelTime).getTime()
            };
            (this.form = {
                securityCheck: row.securityCheck || 0,
                dropOffFlag: row.dropOffFlag || 0,
                dropOffNum: row.dropOffNum,
                dropOffTimeLong,
                flightId: row.flightId,
                cancelTimeLong,
            });

                (this.dialogFormVisible = true)
            this.title = row.flightNo
        },
    },
    created() {},
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
    width: 530px !important;
    .el-dialog__body {
        padding: 15px 43px;
        max-height: 80vh;
        overflow-y: auto;
        .el-form-item__label {
            color: #fff;
            width: 120px;
            text-align: left;
        }
        .el-textarea__inner,
        .el-input__inner {
            width: 300px;
            /*height: 30px;*/
        }
    }
}
</style>