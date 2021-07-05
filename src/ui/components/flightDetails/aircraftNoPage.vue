<template>
	<div class="aircraftNoPage">
		<div class="aircraftNoPageTitle">{{aircraftNo}}前序航班：</div>
		<div class="aircraftNoPageContent">
			<div class="aircraftNoItem" v-for="(opt,index) in data||[]" :key="index">
				<div class="aircraftNoItemLeft" :class="isFinish(opt)?'':'unFinish'">
					<div class="circle"> </div>
				</div>
				<div class="aircraftNoItemRight">
					<div class="title">{{opt.flightNo}}</div>
					<div class="aircraftNoHangxian">
						<div  class="cs">
							<div>{{opt.router[0].city}}</div>
							<div>{{getTime(opt.router[0])}}</div>
						</div>
						<div > <icon-svg    iconClass="feiji" ></icon-svg> </div>
						<div  class="cs">
							<div>{{opt.router[1].city}}</div>
							<div>{{getTime(opt.router[1])}}</div>
						</div>
					</div>
					<div class="yanwu">比计划延误{{opt.delayTime}}分钟</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'
    export default {
        name: "aircraftNoPage",
        props: ['data', 'aircraftNo'],
        components: {},
        data() {
            return { }
        },
        computed: {
            getTime(){
				return(opt)=>{
				    let scheduleTime=opt.scheduleTime?moment(opt.scheduleTime).format('HH:mm'):'--'
				    let actualTime=opt.actualTime?moment(opt.actualTime).format('HH:mm'):'--'
				    return  scheduleTime +'/'+  actualTime
				}
			},
            isFinish() {
                return (opt) => {
                    console.log(222,opt);
                    return opt.router.every((r) => {
                        return r.actualTime;
                    });
                }
            }
        },
        methods: {},
        created() {
        },
    }
</script>

<style lang="scss" scoped>
	.aircraftNoPage {
		position: absolute;
		z-index: 1000;
		top: 110px;
		min-height: 150px;
		border-radius: 4px;
		background: linear-gradient(135deg, #50505c 0, #283d54 100%);
		box-shadow: 0 0.125rem 0.25rem 0 rgb(0 0 0 / 50%);
		.aircraftNoPageTitle {
			width:100%!important;
			background: linear-gradient(90deg, #434452 0, #20324b 100%);
			padding: 10px 15px;
			position: relative;
		}
		.aircraftNoPageTitle:before {
			content: '';
			border: solid;
			border-width: 8px;
			position: absolute;
			border-color: transparent transparent #50505c;

			top: -16px;
			z-index: 2000;
		}
		.aircraftNoPageContent {
			max-height: 500px;
			overflow-y: auto;
			padding: 15px;
			.aircraftNoItem {
				display: flex;
				justify-content: left;
				align-items: center;
				.aircraftNoItemLeft {
					height: 135px;
					width: 0px;
					border-right: #369afa solid 1px;
					position: relative;
					.circle{
						height: 10px;
						width: 10px;
						border-radius: 100%;
						background: #369afa;
						border: 1px #fff solid;
						position: absolute;
						top: -5px;
						left: -5px;
					}
				}
				.unFinish{
					border-right: #8994a8 dashed 1px;
					.circle{
						background: #3f4858;
					}
				}
				.aircraftNoItemRight {
					padding: 10px;
					margin-left: 15px;
 					width: calc(100% -  5px);
					background: rgba(33,45,65,.8);
					border-radius: 3px;
					.title{
						padding: 0 0 5px 0;
					}
					.yanwu{
						padding-top: 5px;
						color: #ffa735;
					}
					.aircraftNoHangxian{
						padding: 10px ;
						border-top:1px #314261 solid;
						border-bottom:1px #314261 solid;
						display: flex;
						justify-content: center;
						 svg{
							 margin:0 20px;
							 width: 25px;
							 height: 25px;
						 }
						.cs{
							text-align: center;
							div{
								font-size: 18px;

 							}
							div:nth-child(2){
								margin-top: 6px;
								font-size: 12px;
								color: #8994a8;
							}
						}
					}
 				}
			}
		}
	}


</style>