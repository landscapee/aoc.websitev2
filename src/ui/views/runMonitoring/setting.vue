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
    import {allField} from "../../../lib/flightAllFields";
    import draggable from "vuedraggable";
    import {setting} from './help';

    export default {
        name: "setting",
        components: {draggable},
        data() {
            return {
                list1: [],//要显示的列
                hideFields: [],  //所有列
                item: {},
                dialogFormVisible: false,
                falgs: 'article',
                disabled: false,

            }
        },
        methods: {
			save(){
				this.$emit('getCol',this.list1,this.item.key)
				this.dialogFormVisible=false
			},
			reset(){
				this.list1=setting[this.item.key]
                //重置 hideFields
                this.gethideFields()
            },
            close() {
                this.item={}
                this.hideFields=[]
                this.list1=[]
                this.dialogFormVisible = false
            },
			gethideFields(){
                let topListobj ={};
                map(this.list1,(k,l)=>{
                    if(k.type==='index'){
                        this.hideFields=[{key:'ind',type:'index',label:'序号',flag:true,selectColor:true}]
                    }else{
                        topListobj[k.key||k.solt]=1
                    }
                })
                map(allField, (item, key) => {
                    if (  !item.reference && !item.unConfigurable) {
                        let obj={key:key,label:item.text,type:'simple'}
                        if(item.slot){
                            obj={key:key,label:item.text,type:'slot'}
                        }
                        if(topListobj[key]){
                            obj={...obj,flag:true,selectColor:true}
                        }
                        this.hideFields.push(obj);
                    }
                });
			},
            open(item) {
                this.dialogFormVisible = true
                this.item = item
                this.list1 = [...item.tableConfig]
				this.gethideFields()

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
                let key=item.key
                this.list1.splice(index, 1)
                let q = this.hideFields.find((value, index, arr) => {
                    return value.key === key
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
			.footer{
				text-align: right;
				border-top:1px #cacaca solid;
				padding-top: 10px;
				span{
					cursor:pointer;
					color:#fff;
					display: inline-block;
					padding:4px 10px;
					border-radius: 2px;
				}
				span:hover{
					opacity: .6;
				}
				span:last-child{
					color: #fff;
					background-color: #28a745;
					border-color: #28a745;
				}
			}
		}
	}
	.drag-box{
		.list-complete-item {

			cursor: pointer;
			position: relative;
			font-size: 14px;
			padding: 3px 5px;
			display: inline-block;
			margin: 0 8px 8px 0;
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
