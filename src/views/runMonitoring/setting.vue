<template>
	<div>
		<el-dialog :title="item.name" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div style="color:#2e67f6">建议配置最多7列，否则可能会引起样式错乱</div>
			<div class="drag-box">
				<div class="drag-top">
 					<draggable
						:list="list1"
						v-bind="getRightOption()"
						@start="startRight"
						@end="endRight"
						class="dragArea11"
						style="min-height: 80px">
						<div v-for="(element, index) in list1" :key="index" class="list-complete-item">
							<div class="list-complete-item-handle">
								{{element.label}}
								<i class="el-icon-delete" @click="handleDel(index, element)"></i>
							</div>
							      
						</div>   
					</draggable>   
				</div> 
				<div class="drag-bottom">
					<draggable :list="hideFields"
							   v-bind="getLeftOption()"
							   @end="end" class="dragArea"> 
						<div v-for="(element,index) in hideFields" :key="index"
							 :class="{undraggable : element.flag,selectColor:element.selectColor} "
							 class="list-complete-item">         
							<div class="list-complete-item-handle2"> {{element.label}}</div>         
						</div>   
					</draggable>   
				</div>   
			<div class="footer">
				<span @click="reset">重置</span>
				<span @click="close">取消</span>
				<span @click="save">保存</span>
			</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import {map, compact, get} from 'lodash'
    import {allField} from "../../../common/flightAllFields";
    import draggable from "vuedraggable";

    export default {
        name: "setting",
        components: {draggable},
        data() {
            return {
                list1: [],
                hideFields: [],
                item: {},
                dialogFormVisible: false,
                falgs: 'article',
                disabled: false,

            }
        },
        methods: {
			save(){

			},
			reset(){

			},
            close() {
                this.item={}
                this.hideFields=[]
                this.list1=[]
                this.dialogFormVisible = false
            },
            open(item) {
                this.dialogFormVisible = true
                this.item = item
                this.list1 = [...item.tableConfig]
                 let topListobj ={};
                map(this.list1,(k,l)=>{
                    if(k.type==='index'){
                        this.hideFields=[{type:'index',label:'序号',flag:true,selectColor:true}]
					}else{
                        topListobj[k.prop||k.solt]=1
					}
				})

                 map(allField, (item, key) => {
                     if (  !item.reference && !item.unConfigurable) {
                         let obj={prop:key,label:item.text}
                          if(item.slot){
                             obj={slot:key,label:item.text}
						 }
						 if(topListobj[key]){
                             obj={...obj,flag:true,selectColor:true}
						 }

                        this.hideFields.push(obj);
                    }
                });

            },
            getRightOption() {
                console.log('getRightOption');
                return {group: 'article', disabled: this.disabled}
            },
            startRight(event) {
                console.log('startRight');
                this.falgs = '222222'
            },
            endRight(ev) {
                console.log('endRight');
                this.falgs = 'article'
            },
            // 左侧列表设置
            getLeftOption() {
                console.log('getLeftOption');
                return {group: {name: this.falgs, pull: 'clone'}, filter: '.undraggable', sort: false}
            },

            end(ev) {
                console.log('end');
                if (ev.to.className === 'dragArea11') {
                    this.$set(this.hideFields[ev.oldIndex], 'flag', true)
                    this.$set(this.hideFields[ev.oldIndex], 'selectColor', true)
                }
            },
            handleDel(index, item) {
                console.log('handleDel');
                let prop=item.prop||item.slot
                this.list1.splice(index, 1)
                let q = this.hideFields.find((value, index, arr) => {
                    return value.prop === prop||value.solt===prop
                })
                this.$set(q, 'flag', false)
                this.$set(q, 'selectColor', false)
            },
        },
        created() {

        },
    }
</script>

<style lang="scss" scoped>
	::v-deep .el-dialog{
		width: 750px!important;
		.el-dialog__body {

			padding: 15px 20px;
			max-height: 80vh;
			overflow-y: auto;
		}
	}
	.drag-box{
		.list-complete-item {

			cursor: pointer;
			position: relative;
			font-size: 14px;
			padding: 3px 5px;
			display: inline-block;
			margin: 0 12px 10px 0;
			border: 1px solid #6c757d;
			border-radius: 1px;
			color:#6c757d;
			transition: all .5s;

		}
		.drag-top{
			margin-top: 15px;
			padding: 5px;
			background: hsla(0,0%,78%,.69);
			.list-complete-item{
				background: #5e6871;
				color:#fff;
				border:1px #5e6871 solid;
				border-radius: 2px;
			}
		}
		.drag-bottom{
			padding-top:15px;
		}

		.list-complete-item.sortable-chosen {
			background: #4AB7BD;
		}
		.selectColor{
			background: #5e6871;
			color:#fff;
		}
		  .list-complete-item.sortable-ghost {
			background: #30B08F;
		}

		  .undraggable {
			background-color: red;
		}

		  .list-complete-enter,
		  .list-complete-leave-active {
			opacity: 0;
		}
	}


</style>