<template>
	<div>
		<el-dialog :title="title" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<el-form :model="form" :rules="rules" ref="form" class="demo-form-inline" :inline="true">
				<!--流控区域 预警区域-->
				<el-form-item prop="title" :label="titleObj[type]">
					<el-select v-model="form.title" @change="titleChange" clearable placeholder="请选择流控区域">
						<el-option v-for="item in areaStr"
								   :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="time" label="起止时间：">
					<el-time-picker format="HH:mm"  @change="timeChange"  is-range v-model="form.time" range-separator="至"
									start-placeholder="开始时间" end-placeholder="结束时间"
									placeholder="请选择起止时间">
					</el-time-picker>
				</el-form-item>
				<el-form-item prop="specificType" label="类型选择：">
					<el-select v-model="form.specificType" clearable placeholder="请选择类型">
						<el-option v-for="item in reasons"
								   :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<!--间隔时间 通行能力下降-->
				<el-form-item prop="closeScheme" :label="closeSchemeObj[type]">
					<el-input v-model="form.closeScheme"  @input="closeSchemeInput" clearable :placeholder="placeHolderObj[type]"></el-input>
				</el-form-item>
				<el-form-item v-if="this.type=='warning'" prop="level" label="预警等级：">
					<el-select v-model="form.level"   clearable placeholder="请选择预警等级">
						<el-option v-for="item in levelArr"
								   :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item prop="content" label="内容：">
					<el-input v-model="form.content" :rows="4" type="textarea" clearable placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>

			<div class="footer">
				<span @click="save('form')">发布</span>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import {map, compact, get} from 'lodash'
    import moment from 'moment'

    export default {
        name: "add",
        data() {

            return {
                type:'',
                title: '',
				titleObj:{
                    liukong:'流控区域：',
                    warning:'预警区域：',
				},
                closeSchemeObj:{
                    liukong:'间隔时间：',
                    warning:'通行能力下降：',
				},
				placeHolderObj:{
                    liukong:'请输入间隔时间',
                    warning:'请输入通行能力下降 ',
				},
                form: {
                    time: [new Date(), new Date(new Date().getTime() + 60 * 60 * 1000)],
                    title: '',
                    category: '流控信息',
                    applyLevel: '无',
                    extendField2: '',//id areaStr
                    receivers: [{receiveDeptId: 'ocmc', receiveDeptName: '运管委联合运控中心'}],

                },
                 dialogFormVisible: false,
                rules: {
                    title: [{trigger: "blur", required: true, message: '请选择'}],
                    time: [{trigger: "blur", required: true, message: '请选择'}],
                    specificType: [{trigger: "blur", required: true, message: '请选择'}],
                    level: [{trigger: "blur", required: true, message: '请选择'}],
                     closeScheme: [{required: true, message: '请输入', /*validator: checkNum,*/ trigger: 'blur'}],
                    content: [{trigger: "blur", required: true, message: '请输入'}],
                },
                areaStr: [
                    {id: 'deb46ae959404188a796fe4ba30f1899', name: 'IDEPO广州'},
                    {id: 'd974d10e196240bc9a76ca4d55639464', name: 'IDEPO海口'},
                    {id: 'f4385efd89744e6c99cc4c18ff38cc2c', name: 'IDEPO海口琼州'},
                    {id: '2e7ffdaa4c7d43ebb273ff46b6b82b88', name: 'IDEPO深珠'},
                    {id: 'b8945af6497b46abbf22743002cccc44', name: 'IDEPO香港'},
                    {id: 'b21c2b70f2704855b0707221813bfd82', name: '昆明'},
                    {id: '9dd8b401f2fe435b8dd09e3ac0b86d38', name: '昆明第二次'},
                    {id: '975f344a732943798ddd9cf1432bb673', name: '进南宁区域'},
                    {id: '89f78d4ed96f434f917f89efd3dd971f', name: '山东省及以远'},
                    {id: '64bf3f36e0754fab9e2beb6076941a74', name: '烟台'},
                    {id: 'ade25c211c584a11b7d0b1b22eef81d5', name: 'AGULU，津苑'},
                    {id: '825fc04e13ac47a4b7b28372393d89b9', name: 'AGULU，郑州'},
                    {id: 'c5a3c2f6cc7c4647be1a96562af4555f', name: '北京第二次'},
                    {id: '113590a22e2d428a98c2582567b3a446', name: '青岛'},
                    {id: 'b01bf8dbf8d94293ad0f749e1fe0eed8', name: 'AGULU北京'},
                    {id: 'adabdf06221746848e790f07492c2c4d', name: '北京第三次'},
                    {id: '315198518ec54acabba955f5afbdbc64', name: '武汉区域以远'},
                    {id: '64d458bfca5545b088d7297b10fa77e2', name: '南京'},
                    {id: '34ef48e6a2104f2eaca369d904d6d43b', name: 'WHA，浦东'},
                    {id: 'f312cecc6f544065bee0d01ed1b1d770', name: 'WHA，浦东第二次'},
                    {id: '34a277c1fdec48d58cb5354696bba1ad', name: 'LLC杭州'},
                    {id: '071fbcf0c74244f6967378a2dc095c2f', name: 'p127，浙江省'},
                    {id: '23a6a3089e2f407ca9da67b24742d8ed', name: '厦门，泉州'},
                    {id: '5335c89593ad43b6a655597c233385e5', name: 'p127 福州、黄山、上饶、武夷山、衢州、安庆、景德镇'},
                    {id: '73a3e1ef4cd04c56abbd9edb8e800e5a', name: '杭州第二次'},
                    {id: 'c002a8fa3965405dadd988f716b7b027', name: '杭州第三次'},
                    {id: 'c80129a5e8a24081a009e8e5d3255d4c', name: '南通、无锡、常州、扬州、淮安'},
                    {id: '58d4fea363234e1b8458eaed00cffb84', name: '南京第二次'},
                    {id: '74653ac8c40c4860875e255c46235480', name: '浙江省'},
                    {id: '5b2ef0ee06aa4b92b476e9f36cd9ecc6', name: '长沙区域以远'},
                    {id: 'f778a675f6754e82bc3f0132a0d13f33', name: 'OMBON兰州西宁银川'},
                    {id: 'c30f2f3669354ee0bf1382e4b2fee254', name: '拉萨'},
                    {id: '11824454972848059daac7d60130b5de', name: 'OMBON'},
                    {id: '723e46425ef9475abd42ab66f5844bf2', name: '乌鲁木齐方向'},
                ],
                levelArr:['黄色','橙色','红色'],
                areaObj: {},
                reasons: ['时刻', '天气', '军事', '机场'],
            }
        },
        computed: {
            getContent() {
                return this.form.title + this.form.specificType + this.form.closeScheme + this.form.closeEndTime+ this.form.closeStartTime+this.form.level
            },
        },
        watch: {
            getContent: function () {
                // console.log(2);
                let tranTime=(time)=>{
                    return moment(time).format('HH:mm')||'--'
				}
                // console.log(this.form);

                let time1=tranTime(this.form.time[0])
                 let time2=tranTime(this.form.time[1])
                 let content = `受${this.form.title || '--'}${this.form.specificType || '--'}限制影响，间隔${this.form.closeScheme || '--'}，起止时间${time1}-${time2}`;
                if(this.type=='warning'){
					content = `${this.form.title}预计${time1}-${time2}受${this.form.specificType||'--'}影响，通行能力下降${this.form.closeScheme || 0}%，发布${this.form.title|| '--'}航班延误${this.form.level|| '--'}预警。`;
                }
                this.$set(this.form, 'content', content)
            }
        },
        methods: {
            closeSchemeInput(value){
 				let s
				if(this.type=='warning'){
                    // let reg = /^(([1-9]\d{0,1})|([1-9]\d{1,1}\.)|(0\.)|0)(\d{0,2})$/g;
                    s = value.replace(/[^\d|\.]/g, '')
                    s = s.replace(/(\d{0,2})(\d*)(.*)/g, '$1$3')
                    s = s.replace(/^([0])(\d+)(.*)/, '$2')
                    s = s.replace(/^\./, '')
                    s = s.replace(/\.{2,}$/, '.')
					s = s.replace(/(\.)(\d{1,2})(.*)$/, '$1$2')
                    this.$set(this.form,'closeScheme',s)

                }else{
                    let reg = /([^\d]*)/g
                    let reg1 = /(0*)([1-9](\d{0,7}))?(\d*)/g
                    s = value.replace(reg, '')
                    s = s.replace(reg1, '$2') || null
					this.$set(this.form,'closeScheme',s)
 				}

			},

            titleChange(val) {
                this.form.title = this.areaObj[val]
            },
			timeChange(value) {
                // console.log(11111,2,value);
                if(value){
                    // console.log(333);

                    this.$set(this.form, 'closeStartTime', value[0])
                    this.$set(this.form, 'closeEndTime', value[1])
				}
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let arr =this.form.time
                        this.$set(this.form, 'closeStartTime', arr[0])
                        this.$set(this.form, 'closeEndTime', arr[1])
                        let obj={...this.form}
						delete obj.time
						if(this.type=='warning'){
						    delete obj.extendField2;
                            delete obj.level
						}
                        this.$request.post('msg', 'notice/save', obj, false).then((res) => {
                             if(res.code==200){
                                this.$message.success('发布成功')
								 this.close()
								 this.$emit('getList')
							}else{
                                this.$message.warning(res.message)
                            }
                        })
                    } else {
                        return false;
                    }
                });

            },
            close() {
                this.form={
                    time: [new Date(), new Date(new Date().getTime() + 60 * 60 * 1000)],
                        title: '',
                        category: '流控信息',
                        applyLevel: '无',
                        extendField2: '',//id areaStr
                        receivers: [{receiveDeptId: 'ocmc', receiveDeptName: '运管委联合运控中心'}],

                },
                 this.dialogFormVisible = false
                this.$refs['form'].clearValidate()
            },
            open(title, type) {
                this.dialogFormVisible = true
                this.title = title
				this.type=type
				if(type=='warning'){
				    this.form.category='MDRS预警'
				}
            },


        },
        created() {
            map(this.areaStr, (k, l) => {
                this.areaObj[k.id] = k.name
            })

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