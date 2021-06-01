 <template>
	<div>
		<el-dialog title="批量设置" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div class="info">已设置预警状态：</div>
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
                statusDetail:{},
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

                let arr=[...this.time,...this.status]
				let obj={}
                console.log(this.options,arr);
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
                 this.dialogFormVisible = false
            },

            close() {

                this.dialogFormVisible = false
            },

            open(item,options) {
                this.options=options
                this.dialogFormVisible = true
                this.item = item
                this.$request.post('situation', 'batchConcernStatus/edit', { flightids: options.join(',') },true).then((res)=>{
                    console.log('edit',res);
                    this.statusDetail=res||{}
                })
				this.$request.post('situation', 'batchConcernStatus/list', null,true).then((res)=>{
                     this.statusOptions=map(res.data.statusType,(k,l)=>{
                         return {value:l,label:k}
                    });
                    this.timeOptions=map(res.data.timeType,(k,l)=>{
                         return {value:l,label:k}
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
		width: 450px !important;
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
			.footer {
				text-align: center;
 				padding-top: 10px;
				span {
					cursor: pointer;
					color: #fff;
					display: inline-block;
					padding: 7px 15px;
					border-radius: 2px;
					background: #39404b;
				}
				span:hover {
					opacity: .6;
				}
				span:last-child {
					color: #fff;
					background-color: #0566ff;
					border-color: #0566ff;
				}
			}
		}
	}





 </style>