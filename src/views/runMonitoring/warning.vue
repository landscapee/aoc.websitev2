<template>
	<div>
		<el-dialog title="批量设置" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div>已设置预警状态：</div>
			<div>
				<span > 状态</span>
				<el-select v-model="status" multiple clearable  placeholder="请选择状态">
					<el-option
						v-for="item in statusOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>

			</div>
			<div>
				<span > 时间</span>
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
                timeOptions:[],
                statusOptions:[],
                time:[],
                status:[],
                dialogFormVisible: false,
            }
        },
        methods: {
            save() {
                this.$emit('getCol', this.list1, this.item.key)
                this.dialogFormVisible = false
            },

            close() {

                this.dialogFormVisible = false
            },

            open(item,options) {
                this.dialogFormVisible = true
                this.item = item
                this.$request.post('situation', 'batchConcernStatus/edit', { flightids: options.join(',') },true).then((res)=>{
                    console.log('edit',res);
                })
				this.$request.post('situation', 'batchConcernStatus/list', null,true).then((res)=>{
                    console.log('list',res);
				})

            },


        },
        created() {

        },
    }
</script>

<style lang="scss" scoped>
	::v-deep .el-dialog {
		width: 650px !important;
		.el-dialog__body {

			padding: 15px 20px;
			max-height: 80vh;
			overflow-y: auto;
			.footer {
				text-align: right;
				border-top: 1px #cacaca solid;
				padding-top: 10px;
				span {
					cursor: pointer;
					color: #fff;
					display: inline-block;
					padding: 4px 10px;
					border-radius: 2px;
				}
				span:hover {
					opacity: .6;
				}
				span:last-child {
					color: #fff;
					background-color: #28a745;
					border-color: #28a745;
				}
			}
		}
	}


</style>