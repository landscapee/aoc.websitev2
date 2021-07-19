<template>
	<div>
		<el-dialog :title="title" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div  >
				<el-input v-model="data"></el-input>
				<el-button size="mini" type="primary" @click="save">确定</el-button>
			</div>

		</el-dialog>
	</div>
</template>
<script>
    import {map } from 'lodash'

    export default {
        name: "warning",
        data() {
            return {
                 title:'',
                data:'',
                index:'',
                dialogFormVisible: false,
            }
        },
        methods: {
            save(){
                let obj={
                    hour: this.index,
                    capacityNum: Number(this.data)
				}
                // /adverse-condition/meteorologyDisaster/trafficCapacity/save
                this.$request.post('adverse', 'meteorologyDisaster/trafficCapacity/save', obj, true).then((res) => {
                    if(res.code==200){
                        this.$message.success('设置成功')
                        this.close()
                     }else{
                        this.$message.warning(res.message)
                    }
                })
			},
            close() {

                this.data='';
                this.title='';
                this.index='';
                this.dialogFormVisible = false
            },
            open(data,index) {
                this.data=data
                this.index=index
				let numTran=(num)=>{
                    return num<10? 0+''+num+':00':num+':00'
				}
                let title=numTran(index)+'-'+numTran(index+1)+'通行能力设置'
				this.title=title
                this.dialogFormVisible = true
            },
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
			color:#fff;
			&>div{
				text-align: center;
			}
		}
		.el-input{
			width: 300px;
		}
	}





</style>