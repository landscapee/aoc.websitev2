<template>
	<div>
		<el-dialog :title="obj[key].name" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div  ></div>

		</el-dialog>
	</div>
</template>
<script>
    import {map } from 'lodash'

    export default {
        name: "warning",
        data() {
            return {
                obj:{
                    departureStandard:{
                        namr:'',
						data:[
							{item:'起飞标准', col:4,rules:'RVR>=400',name:'起飞'},
							{item:'起飞标准',rules:'200<=RVR<400',name:'低能见度起飞'},
							{item:'起飞标准',rules:'150<=RVR<200',name:'HUD特殊二II类运行起飞'},
							{item:'起飞标准',rules:'RVR<150',name:'无法起飞'},
						]
					},arriveStandard:{
                        namr:'',
						data:[]
					},
				},
                 key:'',
                dialogFormVisible: false,
            }
        },
        methods: {
            close() {

                this.item={};
                this.dialogFormVisible = false
            },
            open(key) {
                this.key=key
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