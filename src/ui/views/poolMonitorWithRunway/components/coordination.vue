<template>
	<div>
		<el-dialog  title="申请快速协调" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div  class="content">
				<p style="color:#fff">请输入备注信息</p>
				<el-input  :rows="3" v-model="text" type="textarea"  clearable></el-input>
			</div>
			<div class="footer">
				<span @click="close">取消</span>
				<span @click="save">确定</span>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import {map,some } from 'lodash'
    import {getUserSerializ} from '@/ui/lib/localStorageTemp'

    export default {
        name: "warning",
        data() {
            return {
                text:"",
                 item:{},
                dialogFormVisible: false,
            }
        },
        methods: {
            save(){
                let isZhs = !this.$hasRole('zhihuishi', false);
                  let obj={
                    flightId:this.item.flightId,
					desc:this.text,
					type:this.item.type,
                    roleCode: isZhs ? 'zhihuishi':null}
                this.$request.post('situation', 'pool/coordinate', obj,true).then((res)=>{
                    if(res.code!=200 ){
                        this.$message.warning(res.message)
                        return
                    }
                    this.$message.success('操作成功')
					this.close()
                })

			},
            close() {
                this.item={};
                this.text="";
                this.dialogFormVisible = false
            },
            open(item) {
                this.item=item
                this.dialogFormVisible = true
            },
        },

    }
</script>

<style lang="scss" scoped>
	::v-deep .el-dialog {
		width: 500px !important;
		.el-dialog__body {
			.content{
				margin-bottom: 15px;
			}
			padding: 15px 20px;
			max-height: 80vh;
			overflow-y: auto;
			color:#fff;
			textarea{
				color:#999999;
			}
			span{
				color:#fff
			}
		}
	}
</style>