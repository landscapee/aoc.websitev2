 <template>
	<div>
		<el-dialog title="批量设置" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div class="info">已设置预警状态：</div>
			<div class="info">
				<p v-for="(opt,index) in  statusDetail" :key="index">
					{{opt.name}}：{{opt.value}}
				</p>
			</div>
			<div class="row">
				<span > 状态：</span>
				<el-select v-model="status" multiple clearable  placeholder="请选择状态">
					<el-option
						v-for="item in statusOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>

			</div>
			<div  class="row">
				<span > 时间：</span>
				<el-select v-model="time" multiple clearable  placeholder="请选择时间">
					<el-option
						v-for="item in timeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>

			</div>
			<div class="footer">
 				<span @click="close">取消</span>
				<span @click="save">确定</span>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import {map, compact, get} from 'lodash'
    import PostalStore from "../../lib/postalStore";
    let postalStore = new PostalStore();

    export default {
        name: "warning",
        data() {
            return {
                infoObj:{},
                statusDetail:[],
                options:[],
                timeOptions:[],
                statusOptions:[],
                time:[],
                status:[],
                dialogFormVisible: false,
            }
        },
        methods: {
            save() {
                if(this.time.length||this.status.length){
                    let arr=[...this.time,...this.status]
                    let obj={}
                     map(this.options,(k,l)=>{
                        console.log(k, l);
                        obj[k]=[...arr]
                    })
                    this.$request.post('situation', 'batchConcernStatus/add', obj,false).then((res)=>{
                        console.log('edit',res);
                        if(res.code==200){
                            this.$message.success('操作成功')
                        }
                    })
                    this.close()
				}else{
                    this.$message.warning('请至少选择一项')
				}

            },

            close() {
					this.infoObj={};
					this.statusDetail=[];
					this.options=[];
					this.timeOptions=[];
					this.statusOptions=[];
					this.time=[];
					this.status=[];
                this.dialogFormVisible = false
            },


            open(item,options,statusOptions,timeOptions,infoObj) {
                this.options=options
                this.dialogFormVisible = true
                this.item = item
                this.timeOptions=timeOptions
                this.statusOptions=statusOptions
                this.infoObj=infoObj
                this.$request.post('situation', 'batchConcernStatus/edit', {flightids:options.join(',')},true).then((res)=>{
                    if(res.code!=200||!res.data){
                        return
                    }
                    map(res.data,(k,l)=>{
                        if(k){
                            let arr=map(k,(item)=>{
                                return this.infoObj[item]
                            })
                            this.statusDetail.push({name:l,value:arr.join(',')})
						}

                    })
                })
            },


        },
        created() {

        },
    }
</script>

<style lang="scss" scoped>
	::v-deep .el-dialog {
		width: 500px !important;
		.el-dialog__body {

			padding: 15px 20px;
			max-height: 80vh;
			overflow-y: auto;
			.info{
				color: #fff;
			}
			.row{
				margin: 15px 0;
				span{
					color: #fff;
				}
			}
			.el-select{
				.el-input__inner{
					width: 400px;
				}
			}

		}
	}





 </style>