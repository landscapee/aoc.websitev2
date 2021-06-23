<template>
	<div class="newsFabu">
		<div class="topBtn">
			<div class="tab"><span>当前特情&nbsp;{{data.length}}</span></div>
			<div class="add">
				<span @click="addNews('liukong_edit-fluid','新增流控信息')"><i class="el-icon-plus"></i>流控信息</span>
				<span @click="addNews('warning_edit-MDRS','新增MDRS预警')"><i class="el-icon-plus"></i>MDRS预警</span>
			</div>
		</div>
		<div class="content">
			<el-scrollbar style="height:100%">
				<div class="scrollDivHeight">
					<div class="list">
						<div class="listitem" @click="seeDetails(opt)" :class="{listItemNo:getlistitemclass(index),listItemActive:activeObj[opt.id]}" v-for="(opt,index) in data" :key="index+'q'">
							<div class="title">
								<span>{{getTitle(opt)}}</span>
								<span :style="{background:colorObj[opt.applyLevel]}">{{opt.applyLevel}}</span>
							</div>
							<div class="time">{{moment(opt.createTime).format('YYYY-MM-DD HH:mm')}}</div>
							<p class="info"> {{getInfo(opt)}}</p>
							<div class="xuxian"></div>
							<p class="laiyuan">来源：{{opt.createDeptName == deptName ? '自发起' : opt.createDeptName}}</p>
						</div>
					</div>
				</div>

			</el-scrollbar>
			<div class="detailsNews" v-if="dataItem">
				<div class="title">
					{{getTitle(dataItem)}}
					<div class="cursor"  @click="close">× </div>
				</div>
				<div class="content">
					<div>{{dataItem.title||''}}</div>
					<div class="info">{{getInfo(dataItem)}}</div>
				</div>
			</div>
		</div>
		<Add ref="Add" @getList="getList"></Add>
	</div>
</template>

<script>
	import moment from 'moment';
	import Add from './add'
    export default {
        name: "index",
        components: {Add},
        data() {
            return {
                moment,
                activeObj:{},
                deptName: JSON.parse(sessionStorage.getItem('userData')).deptName,
				colorObj:{
					'无':'#111926',
					'T1':'#FFBC00',
					'T2':'#F77C06',
					'T3':'#F45120',
					'T4':'#D81806',
					'T5':'#D10704',
				},
				dataItem:null,
                data:[]
			}
        },
		computed:{
            getlistitemclass(){
                return (index)=>{
                    return  (index+1)%5===0
				}
			},
			getTitle(){
                return (opt)=>{
                    let category = opt.category;
                     if (category == '机场承载量减弱' || category == '特殊事件') {
                        category = `${category}-${opt.type}`;
                    }
                    return  category||'--'
				}
			},
			getInfo(){
                return (opt)=>{
                    let content = opt.content;
                    let reg = /(^\s*|\s*$)/g;
                     return  content.replace(reg,'') || '--'
				}
			},
		},
        methods: {
            addNews(key,title){
                let arr=key.split('_')
				if(this.$hasRole(arr[1])){
                    this.$refs.Add.open(title,arr[0])
				}
			},
            seeDetails(opt){
                this.dataItem=this.activeObj[opt.id]?null:opt
                this.activeObj={[opt.id]:!this.activeObj[opt.id]}
            },
			close( ){
                this.activeObj={[this.dataItem.id]:false}
                this.dataItem=null
            },
            getList(){
                this.$request.get('msg', 'notice/findCurrentNotice').then((res)=>{
                    console.log('edit',res);
                    if(res.code==200&&res?.data?.length){
                        this.data=res.data
                        this.seeDetails(res.data[0])
                    }
                })
			},
		},
        created() {
             this.getList()
        },
    }
</script>

<style lang="scss" scoped>
.newsFabu{
	box-sizing: border-box;
	padding: 10px 17px;
	.topBtn{
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		.add span,.tab span{
			padding: 7px 15px;
			display: inline-block;
			background: #0566ff;
			color: #ffffff;
			border-radius: 17px;
			font-size: 12px!important;
			vertical-align: middle;
			cursor: pointer;
		}
		.add span{
			border-radius: 2px;
			margin-left: 10px;
		}

	}
	.content{

		position: relative;
		.scrollDivHeight{
			height: calc( 100vh - 97px);
			width: 1569px;
		}
		.list{

 			width: 1569px;
			display: flex;
			justify-content: left;
			flex-wrap: wrap;
			.listItemNo{
				margin-right: 0!important;
			}
			.listItemActive{
				border:1px #2e67f6 solid;
			}
			.listitem{
				margin-right: 17px;
				margin-bottom: 17px;
				width: 300px;
				height: 140px;
				padding: 10px 15px;
				background: linear-gradient(134deg, rgba(38, 56, 92, 0.5), rgba(29, 47, 67, 0.51) 100%);
				border-radius: 5px;
				box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.50);
				font-family: ALiB;
				color: #fff;
				.title{
					height: 22px ;
					line-height: 22px;
					display: flex;
					justify-content: space-between;
					span{
						font-family: ALiB;
						font-size: 16px;
					}
					span:last-child{
						/*display: inline-block;*/
						/*height: 22px;*/
						/*line-height: 22px;*/
						padding: 0px 5px;
					}
				}
				.info,.laiyuan,.time{
					height: 20px ;
					line-height: 20px;
					font-size: 14px;
					color: rgba(255, 255, 255, 0.5);
				}
				.time{
					margin: 7px 0;
				}
				.info{
					color: #fff;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space:nowrap;
					margin: 0;
				}
				.xuxian{
					/*width: 100%;*/
					margin: 10px 0;
					border-top: 1px dashed rgba(179, 189, 220, 0.5);
				}
			}
		}
	}
	.detailsNews{
		width: 317px;
		/*height: 940px;*/
 		background: #234479;
		border-radius: 5px 5px 0px 0px;
		color: #fff;
		position: absolute;
		right: 0;
		top: 0;
		height: calc( 100vh - 97px);

		.title{
			height: 40px;
			line-height: 40px;
 			position: relative;
			font-size: 14px;
			padding-left: 14px;
			div{
				display: inline-block;
				width: 18px;
				height: 18px;
				border-radius: 100%;
				border: 1px #fff solid;
				text-align: center;
				line-height: 16px;
				position: absolute;
				right: 10px;
				top: 11px;

			}
		}
		.content{
			padding: 12px 14px;
			background: #233147;
			height: calc(100% - 40px);
			.info{
				margin: 16px 0 ;
			}
		}
	}
}
</style>