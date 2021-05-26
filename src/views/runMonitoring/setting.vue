<template>
	<div>
		<el-dialog :title="item.name" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div></div>

		</el-dialog>
	</div>
</template>
<script>
	import {map, compact, get} from 'lodash'

    export default {
        name: "setting",
        components: {},
        data() {
            return {
 				item:{},
                dialogFormVisible: false,
             }
        },
        methods: {

            close() {
                 this.dialogFormVisible = false
             },

            open( item) {
                this.dialogFormVisible = true
				this.item=item
            },

        },
        created() {

        },
    }
</script>

<style lang="scss" scoped>

	.el-dialog {

		.el-dialog__body {
			padding: 32px 40px 28px 50px;
			max-height:80vh;
			overflow-y: auto;

		}

	}



</style>