<template>
	<div>
		<el-dialog title="1111" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div  class="top">
				<span class="topItem" v-for="opt in topData" :key="opt.key">
					<icon-svg :iconClass="opt.svg"></icon-svg>{{opt.name}}{{opt.key}}
				</span>
			</div>
			<div class="middle">
				<div class="divBox ">
					<div class="div1"></div>
					<div class="div2"></div>
					<div class="div3"></div>
					<div class="content">

					</div>
				</div>
				<div class="divBox divBox2">
					<div class="div1"></div>
					<div class="div2"></div>
					<div class="div3"></div>
					<div class="content">

					</div>
				</div>
			</div>
			<div class="bottom">

			</div>
		</el-dialog>
	</div>
</template>
<script>

    export default {
        name: "warning",
        data() {
            return {
                topData:[
					{name:'机号：',key:'ss',svg:'jihao1'},
					{name:'机型：',key:'ss',svg:'jixing'},
					{name:'翼展：',key:'ss',svg:'yizhan'},
					{name:'机长：',key:'ss',svg:'jichang'},
					{name:'机类：',key:'ss',svg:'jilei1'},
					{name:'',key:'ss',svg:'hangkonggongsi'},
					{name:'乘客代理：',key:'ssssssssss是多少都是多s',svg:'chengkedaili'},
					{name:'机务代理：',key:'ss',svg:'jiwudaili1'},
					{name:'勤务代理：',key:'ss',svg:'qinwudaili'},
				],
                item:{},
                resolve:null,
                reject:null,
                  dialogFormVisible: true,
            }
        },
        methods: {
            close() {
               this.resolve()
                 this.dialogFormVisible = false
            },
            open(item) {
                this.item=item
                this.dialogFormVisible = true
				return new Promise((resolve,reject)=>{
				    this.resolve=resolve
				    this.reject=reject
				})
            },
        },

    }
</script>

<style lang="scss" scoped>
	::v-deep .el-dialog {
		width: 90% !important;
		height: 90vh;
		.el-dialog__body {

			padding: 20px 45px;
			height: calc(100% - 40px);
			overflow-y: auto;
			color:#fff;
			span{
				color:#fff
			}
		}
	}

.top{
	width: 100%;
	display: flex;
	.topItem{
		flex: 1 1 auto;
		padding: 11px;
		margin-right: 8px;
 		background: rgba(216, 216, 216, 0.16);
		border-radius: 2px;
		font-size: 16px;
		font-family: MicrosoftYaHei;
		svg{
			margin-right: 8px;
			width: 18px;
		}
	}
	.topItem:last-child{
		margin-right: 0;
	}

}

.middle{
	margin: 40px 0 120px 0;
	display: flex;
	justify-content: left;
	.divBox{
		position: relative;
		width: 809px;
		height: 280px;
		border-radius: 12px;
		opacity: 1;
		background: linear-gradient(225deg,#31c265  , #00781a )   ;
		overflow: hidden;
		.div1,
		.div2{

			width: 1000px;
			height: 800px;
			opacity: 0.3;
			background: linear-gradient(120deg,#d4ffe0 0%, rgba(5, 87, 23, 0.51) 22%);
			border-radius: 100%;
			position: absolute;
			top:-570px;
		}
		.div1{
			left: -750px;
		}
		.div2{
			right: -750px!important;
 			opacity: 0.1;
			background: linear-gradient(179deg,#7cff89 1%, #1b8e29 91%);
		}

		.div3{
			width: 800px;
			height: 480px;
			opacity: 0.1;
			background: linear-gradient(180deg,#d4ffe0, #055717);
			border-radius: 50%;
			position: absolute;
			left: -300px;
			bottom:-270px;
		}
		.content{
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			/*margin: auto;*/
		}
	}
	.divBox2{
		margin-left: 20px;
		background: linear-gradient(225deg,#00a8ff, #0044d2);
		box-shadow: 0px 0px 10px 0px rgba(44,74,110,0.71);
		.div1{
			opacity: 0.1;
			background: linear-gradient(180deg,#d4e5ff, #040562);
		}
		.div2{
 			background: linear-gradient(179deg,#7cff89 1%, #1b8e29 91%);
		}
		.div3{
			opacity: 0.1;

			background: linear-gradient(180deg,#d4e5ff, #040562);
		}
	}

}

</style>