<template>
	<div>
		<el-dialog :title="item.name" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div v-html="titleMessage[item.key]"></div>

		</el-dialog>
	</div>
</template>
<script>
    import {map } from 'lodash'
    import {titleMessage } from './help'

    export default {
        name: "warning",
        data() {
            return {
                titleMessage,
                item:{},
                dialogFormVisible: false,
            }
        },
        methods: {
            close(row) {

                this.item=row;
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

			padding: 15px 20px;
			max-height: 80vh;
			overflow-y: auto;
			color:#fff;
			span{
				color:#fff
			}
		}
	}





</style>