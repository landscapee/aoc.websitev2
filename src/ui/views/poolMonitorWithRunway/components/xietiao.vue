<template>
	<div>
		<el-dialog  title="协调" :close-on-click-modal="false" center
					:visible.sync="dialogFormVisible"
					:before-close="close">
			<div  class="content">
				<p style="color:#fff;text-align: center">{{ row.text}}</p>
 			</div>
			<div class="footer">
				<span @click="save(false)">不协调</span>
				<span @click="save">确认协调</span>
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
                 row:{},
                 dialogFormVisible: false,
            }
        },
        methods: {
            save(blo){
                let row=this.row
                let o = {status: 1, flightId: row.flightId, type: row.type}
                if(!blo){
                    o.status = null
				}
                this.$request.post('situation', 'pool/status', o, true).then((res) => {
                    if (res.code != 200) {
                        this.$message.warning(res.message)
                        return
                    }
                    this.$message.success('操作成功')
                })
				this.close()
            },

            close() {
                this.row={};
                 this.dialogFormVisible = false
            },
            open(text,flightId,type) {
                this.row={
                    text,flightId,type
				}
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