<template>
	<div>
		<el-dialog :title="title+'TOBT配置'" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<el-form :model="form" :rules="rules" ref="form" class="demo-form-inline" :inline="true">

				<el-form-item prop="time" label="计算时段：">
					<el-time-picker format="HH:mm" @change="timeChange" is-range v-model="form.time" range-separator="至"
									start-placeholder="开始时间" end-placeholder="结束时间"
									placeholder="请选择起止时间">
					</el-time-picker>
				</el-form-item>
				<el-form-item prop="associatedAirport" label="机场：">
					<el-select v-model="form.associatedAirport" clearable placeholder="请选择机场">
						<el-option v-for="(item,key) in dataAirport"
								   :key="key" :label="item" :value="key">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item   prop="calType" label="计算类型：">
					<el-select v-model="form.calType" clearable placeholder="请选择计算类型">
						<el-option v-for="(item,key) in calTypeConfig"
								   :key="key" :label="item" :value="key">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item   prop="flowType" label="流控类型：">
					<el-select v-model="form.flowType" clearable placeholder="请选择流控类型">
						<el-option v-for="(item,key) in flowTypeConfig"
								   :key="key" :label="item" :value="key">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item prop="calValue" label="值：">
					<el-input v-model="form.calValue"  @input="closeSchemeInput"  clearable placeholder="请输入值"></el-input>
				</el-form-item>
			</el-form>

			<div class="footer">
				<span @click="close('form')">取消</span>
				<span @click="save('form')">确定</span>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import {map, compact, get} from 'lodash'
    import moment from 'moment'

    export default {
        name: "add",
		props:['dataAirport'],
        data() {

            return {
                 title: '',
                 calTypeConfig: {
                    original: '始发航班',
                    overStation: '过站航班',
                },
                flowTypeConfig: {
                    CRS: '西南区域流控',
                    CDM: '本场流控',
                },
                form: {
                    time: [new Date(), new Date(new Date().getTime() + 60 * 60 * 1000)],
                       },
                dialogFormVisible: false,
                rules: {
                    associatedAirport: [{trigger: "blur", required: true, message: '请选择'}],
                    time: [{trigger: "blur", required: true, message: '请选择'}],
                    calType: [{trigger: "blur", required: true, message: '请选择'}],
                    flowType: [{trigger: "blur", required: true, message: '请选择'}],
                    calValue: [{required: true, message: '请输入',   trigger: 'blur'}],
                 },

            }
        },

        methods: {
            closeSchemeInput(value){
                let s
                let reg = /([^\d]*)/g
                let reg1 = /(0*)([1-9](\d{0,7}))?(\d*)/g
                s = value.replace(reg, '')
                s = s.replace(reg1, '$2') || null
                this.$set(this.form,'calValue',s)

            },

            titleChange(val) {
                this.form.title = this.areaObj[val]
            },
            timeChange(value) {
                 if (value) {
                    this.$set(this.form, 'timeRangeStart', value[0])
                    this.$set(this.form, 'timeRangeEnd', value[1])
                }
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let src='flight/addTobtConstant';
                        let med='post';
                        let timeRangeStart=moment(this.form.time[0]).format('HHmm')
                        let timeRangeEnd=moment(this.form.time[1]).format('HHmm')
                        console.log('time',timeRangeStart,timeRangeEnd);
                        let obj={...this.form,timeRangeEnd,timeRangeStart}
                        if(this.title=='编辑'){
                            med='put'
                            src='flight/editTobtConstant?constantId='+obj.id;
						}
                        this.$request.post('adverse', src, obj, false,med).then((res) => {
                            if (res.code == 200) {
                                this.$message.success(this.title+'成功')
                                this.close()
                             } else {
                                this.$message.warning(res.message)
                            }
                        })
                    } else {
                        return false;
                    }
                });

            },
            close() {
                 this.form = {time: [new Date(), new Date(new Date().getTime() + 60 * 60 * 1000)],};
                this.dialogFormVisible = false
                this.$refs['form'].clearValidate()
            },
            open(row) {
                this.dialogFormVisible = true
                this.title = row?'编辑':'新增'
				if(row){
                    let timeFn=(s)=>{
                        if(s){
                            let s1=s.slice(0,2).replace(/^[0]/,'')*1
                            let s2=s.slice(2,4).replace(/^[0]/,'')*1
                             let time=new Date()
                            time.setHours(s1)
                            time.setMinutes(s2)
                            return time
                        }else{
                            return null
                        }
                    }
                     let time=[timeFn(row.timeRangeStart),timeFn(row.timeRangeEnd)]
                    this.form={...row,time}
				}

            },
        },
        created() {


        },
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
			.el-textarea__inner, .el-input__inner {
				width: 300px;
				/*height: 30px;*/
			}

		}
	}


</style>