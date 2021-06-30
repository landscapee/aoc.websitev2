<template>
	<div class="jjjyjw">
		<div class="jjjyjwItem" v-for="(opt,index) in data" :key="index+'jjjyjw'">
			<div class="title">
				<div class="left">
					<span>{{opt.seat}}</span>
					<span></span>
					<span>已保障:{{opt.finishNum}}</span>
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
                expandObj:{},//展开项的下标 true
                type:Array,
				default:[{seat:1111,finishNum:2222,},{}]
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
        data() {
            return {}
        },
        methods: {},
        created() {
        },
    }
</script>

<style lang="scss" scoped>
	.jjjyjw{
		height: 100%;
		overflow: auto;
		margin-top: 20px;
		*{
			color: #fff;
			span{	color: #fff;}

		}
	}
.jjjyjwItem{
	margin-top: 15px;
	padding: 10px 20px;
 	background: rgba(55, 69, 92, 0.5);
	border-radius: 5px;
	.title{
		display: flex;
		justify-content: space-between;
		margin-right: 7px;
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
}
</style>