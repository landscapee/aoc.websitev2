<template>
	<div class="jjjyjw">
		<div class="jjjyjwItem" :class="opt.click?'jjjyjwItemClick':''" v-for="(opt,index) in data" :key="index+'jjjyjw'">
			<div class="title cursor"  @click="expand(opt)">
				<div class="left">
					<span>{{opt.seat}}</span>
					<span></span>
					<span>已保障：{{opt.finishNum}}架次</span>
				</div>
				<div class="right">
					<span>{{getText(index)}}</span>
					<icon-svg :style="getIconStyle"  iconClass="paixu" ></icon-svg>
				</div>
			</div>
			<div class="content">
				<div class="contentItem" v-for="(item,index1) in opt.flights||[]" :key="index1+'jjjyjw'">
					<div class="flightNo">{{item.flightNo}}</div>
					<div class="time">
						<span class="timeNum ">{{getMinutes(item,'minutes')}}</span>分
						<span class="timeNum">{{getMinutes(item,'seconds')}}</span> 秒
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from "moment"
    export default {
        name: "jjjyjw",
        components: {},
		props:{
            data:{
                type:Array,
				default:[{seat:1111,finishNum:2222,},{}]
			}
		},
        data() {
            return {
                expandObj:{},//展开项的下标 true

            }
        },
		computed:{
            getText(){
                return (opt)=>{
              		return '展开'
				}
			},
			getIconStyle(){
                return (opt)=>{
              		return {transform:'  rotate(180deg)'}
				}
			},
			getMinutes(){
                return (item,key)=>{
                    let s = item.waitTime ? item.waitTime * 1000 : null;
                    let tempTime = moment.duration(s);
              		return tempTime[key]()
				}
			},
		},

        methods: {
            expand(opt){
              this.$set(opt,'click',!opt.click)
			},
		},
        created() {
        },
    }
</script>

<style lang="scss" scoped>
	.jjjyjw{
		height: 100%;
		overflow: auto;
		padding-right: 10px;
 		*{
			color: #fff;
			span{	color: #fff;}

		}
	}
	.jjjyjwItemClick{
		height: auto!important;
		transition: .3ms;
		svg{
			transform: rotateX(360deg)!important; ;
		}
	}
.jjjyjwItem{
	height: 38px;
	overflow : hidden;
	margin-top: 15px;
	padding: 10px 20px;
 	background: rgba(55, 69, 92, 0.5);
	border-radius: 5px;
	transition: .3ms;
	.title{
		display: flex;
		justify-content: space-between;
		margin :0px  7px 0 0;
		.left{
			span:nth-child(2){
				vertical-align: middle;
				margin: 0 10px;
				display: inline-block;
				height: 13px;
 				border: 1px solid #6d7793;
			}
		}
		.right{
			svg{
				transform:  rotate(180deg);
				transition: .2s;
			}
		}
	}
	.content{
		margin-top: 15px ;
		display: flex;
		flex-wrap: wrap;

		.contentItem{

			width: 90px;
			margin : 10px  10px 0 0 ;
			*{
				font-family: SourceHanSansCN;
			}
			.flightNo{
				background-color: #c2ddfe;
				padding:4px 5px;
				border-radius: 5px 5px 0 0;
				text-align: center;
				color: #36435b;
			}
			.time{
				text-align: center;
				line-height: 35px;
				background: #36445a;

			}
		}
	}
}
</style>