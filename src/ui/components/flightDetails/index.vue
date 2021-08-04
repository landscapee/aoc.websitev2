<template>
	<div>
		<el-dialog title="航班保障进程" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div class="top">
				<span @click="aircraftNoClick(opt)" class="topItem" :class="opt.click?'cursor':''" v-for="(opt,index) in topData" :key="index">
					<icon-svg :iconClass="opt.svg"></icon-svg>{{opt.name}}{{getValue(opt)}}
				</span>
				<AircraftNoPage v-show="showAircraftNoPage" :data="aircraftNoData" :aircraftNo="data.aircraftNo"></AircraftNoPage>
			</div>
			<div class="middle">
				<div class="divBox " :class="index==1?'divBox2':''" v-for="(opt,index) in flightAD" :key="index">
					<div class="div1"></div>
					<div class="div2"></div>
					<div class="div3"></div>
					<div class="content">
						<div class="contentTop">
							<div class="contentTop_left">
								<span><icon-svg iconClass="hangban"></icon-svg><span
									class="fo">{{opt.flightNo||''}}</span></span>
								<span>{{opt.domestic? '国内' : '国际'}}</span>
								<span>{{opt.flightType||'--'}}</span>
								<img v-if="opt.markV" :src="VIPImg" alt="">
							</div>
							<div class="contentTop_right">
								<span class="fo">{{opt.elecFlightStatus||'--'}}</span>
								<span><icon-svg iconClass="riqi2"></icon-svg>{{opt.operationDate||''}}</span>
							</div>
							<div :style="getStatusStyle(opt)" class="flightStatus">{{opt.flightExtStatusText||'--'}}
							</div>
						</div>
						<div class="contentMiddle">
							<div class="alignright">
								<div class="contentMiddleC">
									<div>{{opt.displayRouter[0]}}</div>
									<div>{{opt.displayAirportRouter[0]}}</div>
								</div>
							</div>

							<div class="hangxian">
								<icon-svg iconClass="hangxian1"></icon-svg>
								<div v-if="index==1">{{opt.fluidControlDetail||'--'}}</div>
							</div>
							<div class="alignright">
								<div class="contentMiddleC">
									<div>{{opt.displayRouter[1]}}</div>
									<div>{{opt.displayAirportRouter[1]}}</div>
								</div>
							</div>

						</div>
						<div class="contentBottom">
							<div class="contentBottomItem">
								<div class="divider">
									<div></div>
									<div>共享航班：{{opt.shareFlights?opt.shareFlights.join(' '):'--'}}</div>
									<div></div>
									<div class="banyuan banyuan1"></div>
									<div class="banyuan banyuan2"></div>
								</div>

							</div>
							<div class="contentBottomList " v-for="(shareOpt,shareIndex) in getShareData(index)"
								 :key="shareIndex">
								<div class="ListItem" v-for="(shareOptC,shareIndexC) in shareOpt"
									 :key="shareIndexC+'C'">
									<div>
										{{shareOptC.time?getTime(opt[shareOptC.key]):(opt[shareOptC.key]||'--')}}{{shareOptC.text}}
									</div>
									<div>{{shareOptC.name}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom">
				<iframe @load="sendToken" id="iframe"
						:src="`${iframeIp}/#/flight_milepost?showTree=true&flightId=${item.flightId}&type=${data.flightMilestoneType}`"
						frameborder="0"></iframe>
			</div>
		</el-dialog>
	</div>
</template>
<script>
    import VIPImg from '../../assets/img/VIP.svg'
    import moment from 'moment'
    import {flightStateColor} from './help'
	import AircraftNoPage from './aircraftNoPage'
    import {getUserSerializ} from '../../lib/localStorageTemp'

    export default {
        name: "warning",
		components:{AircraftNoPage},
        data() {
            let ipObj = {
                'test': 'http://173.101.1.30:6068', // 双流测试
                 'dev': 'http://173.101.1.30:6068', // 开发
                'tf': 'http://10.33.64.1:6076', // 天府机场
            };
            return {
                iframeIp: ipObj[PROGRAM],
                VIPImg,
                data: {},
                showAircraftNoPage:false,
                aircraftNoData:[],
                flightAD: {},
                shareListA: [
                    [
                        {name: '前方计划', key: 'preOrNxtPlanTime', time: true},
                        {name: '前方实际', key: 'preOrNxtActualTime', time: true},
                        {name: '计划到达', key: 'sta', time: true},
                        {name: '预计到达', key: 'eta', time: true},
                        {name: '实际到达', key: 'ata', time: true},
                        {name: '可变滑行', key: 'vtt',},

                    ],
                    [
                        {name: '停靠机位', key: 'seat',},
                        {name: '行李转盘', key: 'carousel',},
                        {name: '落地跑道', key: 'runway',},
                        {name: '航站楼', key: 'terminal',},
                        {name: '乘机人数', key: 'passenger',},
                        {name: '飞行时长', key: 'flyingTime',},
                    ],
                ],
                shareListD: [
                    [
                        {name: '计划出港', key: 'std', time: true},
                        {name: '起飞标准保障时间', key: 'tsgt', time: true},
                        {name: '实际起飞', key: 'ATD', time: true},
                        {name: '目标撤轮档(TOBT)', key: 'tobt', time: true},
                        {name: '预计撤轮档(COBT)', key: 'cobt', time: true},
                        {name: '预计起飞(CTOT)', key: 'ctot', time: true},
                        {name: '可变滑行', key: 'vtt',},
                        {name: '机型最小过站时间', key: 'overStationMinTime', text: 'Min'},
                    ],
                    [
                        {name: '停靠机位', key: 'seat',},
                        {name: '登机口', key: 'gate',},
                        {name: '起飞跑道', key: 'runway',},
                        {name: '放行标准保障时间', key: 'dsgt', time: true},
                        {name: '已值机', key: 'checkInCounters',},
                        {name: '已安检', key: 'securityCheckQty',},
                        {name: '已登机', key: 'boardingCounters',},
                        {name: '计划过站时间', key: 'overStationScheduleTime', text: 'Min'},
                    ],
                ],
                topData: [
                    {name: '机号：',click:true, key: 'aircraftNo', svg: 'jihao1'},
                    {name: '机型：', key: 'aircraftType', svg: 'jixing'},
                    {name: '翼展：', key: 'typeWidth', svg: 'yizhan'},
                    {name: '机长：', key: 'typeLength', svg: 'jichang'},
                    {name: '机类：', key: 'c', t: '类', svg: 'jilei1'},
                    {name: '', key: 'airlineCnName', svg: 'hangkonggongsi'},
                    {name: '乘客代理：', key: 'passengerService', svg: 'chengkedaili'},
                    {name: '机务代理：', key: 'serviceAgent', svg: 'jiwudaili1'},
                    {name: '勤务代理：', key: 'airlineCnName', svg: 'qinwudaili'},
                ],
                item: {},
                resolve: null,
                reject: null,
                dialogFormVisible: false,
            }
        },
        computed: {
            getValue() {
                return (opt) => {
                    let s = this.data[opt.key]
                    if (s !== 0) {
                        s = s || '--'
                    }
                    return s + (opt.t || '')
                }
            },
            getShareData() {
                return (index) => {
                    let data = this.shareListA
                    if (index == 1) {
                        data = this.shareListD
                    }
                    return data
                }
            },
            getTime() {
                return (time) => {
                    let t = time ? moment(time).format('HH:mm') : '--'
                    return t
                }
            },

            getStatusStyle() {
                return (opt) => {
                    console.log(flightStateColor[opt.flightExtStatusText]);
                    let colorBack = flightStateColor[opt.flightExtStatusText] || '#ffffff'
                    return {
                        background: colorBack, color: colorBack === '#ffffff' ? '#333' : '#ffffff'
                    }
                }
            }
        },
        methods: {
            aircraftNoClick(opt){
				if(!opt.click){
				    return false
				}
                this.$request.post('flight', 'Flight/getTodayAircraftInfo', {aircraftNo:this.data[opt.key]}, true).then((res) => {
                    if (res.code == 200 && res?.data) {
                        this.aircraftNoData = JSON.parse(res.data)
                         console.log(this.aircraftNoData);
                    }
                })
				this.showAircraftNoPage=!this.showAircraftNoPage
			},
            sendToken() {
                const iframe = document.getElementById('iframe');
                const token =getUserSerializ.token;

                iframe.contentWindow.postMessage({source: 'ACDM', token: token,}, `*`,);
            },
            close() {
                this.resolve();
                this.dialogFormVisible = false
            },
            open(item) {
                this.item = item
                this.dialogFormVisible = true
                this.getData({flightId: item.flightId})

                return new Promise((resolve, reject) => {
                    this.resolve = resolve
                    this.reject = reject
                })



            },
            getData(obj) {
                this.$request.post('flight', 'Flight/getFlightDetail/v2', obj, true).then((res) => {
                    if (res.code == 200 && res?.data) {

                        this.data =  res.data
                        this.flightAD = [this.data.flightA, this.data.flightD]
                        console.log(this.data, this.item);
                    }
                })
            },
        },
		mounted(){
         }


    }
</script>

<style lang="scss" scoped>

	::v-deep .el-dialog {
		width: 100% !important;
		height: 100vh;
		.el-dialog__body {

			padding: 20px 45px;
			height: calc(100% - 40px);
			overflow-y: auto;
			color: #fff;
			span {
				color: #fff
			}
		}
	}

	.top {
		width: 100%;
		display: flex;
		.topItem {
			flex: 1 1 auto;
			padding: 11px;
			margin-right: 8px;
			background: rgba(216, 216, 216, 0.16);
			border-radius: 2px;
			font-size: 16px;
			font-family: MicrosoftYaHei;
			svg {
				margin-right: 5px;
				width: 18px;
			}
		}
		.topItem:last-child {
			margin-right: 0;
		}

	}

	.middle {
		margin: 40px 0 20px 0;
		display: flex;
		justify-content: left;
		.divBox {
			position: relative;
			/*width: 809px;*/
			height: 280px;
			width: 50%;
			border-radius: 12px;
			opacity: 1;
			background: linear-gradient(225deg, #31c265, #00781a);
			overflow: hidden;
			.div1,
			.div2 {
				width: 1000px;
				height: 800px;
				opacity: 0.3;
				background: linear-gradient(120deg, #d4ffe0 0%, rgba(5, 87, 23, 0.51) 22%);
				border-radius: 100%;
				position: absolute;
				top: -560px;
			}
			.div1 {
				left: -710px;
			}
			.div2 {
				right: -710px !important;
				opacity: 0.1;
				background: linear-gradient(179deg, #7cff89 1%, #1b8e29 91%);
			}

			.div3 {
				width: 800px;
				height: 480px;
				opacity: 0.1;
				background: linear-gradient(180deg, #d4ffe0, #055717);
				border-radius: 50%;
				position: absolute;
				left: -300px;
				bottom: -270px;
			}
			.content {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;

			}
			.contentTop {
				display: flex;
				justify-content: space-between;
				position: relative;
				span {
					display: inline-block;
					font-size: 12px;
					/*font-family:MicrosoftYaHei-Bold;*/
					vertical-align: middle;
				}
				.contentTop_left {

					& > span:first-child {
						padding: 0 8px;
						width: 115px;
						height: 30px;
						background: #28b457;
						/*line-height: 30px;*/
						border-radius: 12px 0px 12px 0px;
						span {
							font-size: 18px;
						}
						svg {
							vertical-align: middle;
							margin-right: 5px;
							width: 30px;
							height: 30px;
						}
					}
					& > span:nth-child(2),
					& > span:nth-child(3) {
						border-radius: 2px;
						padding: 4px 8px;
						background: rgba(255, 255, 255, 0.25);
					}
					img {
						/*width: 20px;*/
						vertical-align: middle;
						height: 18px;
					}
				}
				.contentTop_right {
					padding: 5px 30px 0 0;
					& > span:first-child {
						padding: 2px 10px;
						border-radius: 100px;
						background: rgba(255, 255, 255, 0.25);
					}
					svg {
						margin: 0 5px 0 10px;
					}
				}
				.flightStatus {
					position: absolute;
					border: 2px solid #ffffff;
					border-radius: 13px;
					width: 80px;
					height: 20px;
					display: flex;
					justify-content: center;
					align-items: center;
					left: 50%;
					top: 15px;
					transform: translateX(-50%);
				}
			}
			.contentMiddle {
				margin-top: 15px;
				display: flex;
				justify-content: center;
				height: 48px;
				.alignright {
					width: 400px;
					display: flex;
				}
				.alignright:first-child {
					flex-direction: row-reverse;
				}
				.alignright:last-child {
					justify-content: left;
				}
				.hangxian {
					position: relative;
					svg {
						width: 120px;
						height: 30px;
						margin: 0 22px 0 20px;
					}
					& > div {
						padding: 2px 6px;
						background: #fff;
						border-radius: 13px;
						font-family: SourceHanSansCN, SourceHanSansCN-Regular;
						font-size: 12px;
						color: #333333;
						position: absolute;
						top: 35px;
						left: 50%;
						transform: translateX(-50%);
					}
				}
				.contentMiddleC {
					& > div:first-child {
						font-size: 26px;
						margin-bottom: 5px;
					}
					& > div {
						text-align: center;
						white-space: nowrap;
					}
				}
			}
			.contentBottom {
				.contentBottomItem {
					.divider {
						margin-top: 10px;
						display: flex;
						align-items: center;
						position: relative;
						& > div:nth-child(2) {
							/*display:inline-block;*/
							margin: 0 10px;
							padding: 1px 10px;
							background: rgba(216, 216, 216, 0.2);
						}
						& > div:nth-child(1),
						& > div:nth-child(3) {
							flex: 1 1 auto;
							border-top: 1px dashed #fff;
						}
						.banyuan {
							position: absolute;
							width: 16px;
							height: 16px;
							border-radius: 50%;
							background: radial-gradient(#192d4b, #131d35);
						}
						.banyuan1 {
							left: -8px;
						}
						.banyuan2 {
							right: -8px;
						}
					}
				}
				.contentBottomList:last-child {
					border-top: 1px dashed #fff;
				}
				.contentBottomList:nth-child(2) {
					margin-top: -5px;
				}
				.contentBottomList {
					display: flex;
					padding: 10px 0;
					.ListItem {
						width: 16.6666%;
						flex: 1 0 auto;
						border-right: 1px dashed #fff;
						padding: 6px 0px;
						& > div {
							font-family: FjallaOne;
							font-size: 12px;
							text-align: center;
						}
						& > div:nth-child(1) {
							font-size: 26px;
							margin-bottom: 5px;
						}
						& > div:nth-child(2) {
							/*font-family: MicrosoftYaHei;*/
						}
					}
					.ListItem:last-child {
						border: 0;
					}
				}

			}
			.contentBottom:last-child {
				.ListItem {
					width: 12.5%;
				}
			}
		}
		.divBox2 {
			margin-left: 20px;
			background: linear-gradient(225deg, #00a8ff, #0044d2);
			box-shadow: 0px 0px 10px 0px rgba(44, 74, 110, 0.71);
			.div1 {
				opacity: 0.1;
				background: linear-gradient(180deg, #d4e5ff, #040562);
			}
			.div2 {
				background: linear-gradient(179deg, #7cff89 1%, #1b8e29 91%);
			}
			.div3 {
				opacity: 0.1;

				background: linear-gradient(180deg, #d4e5ff, #040562);
			}
			.contentTop_left {
				span:first-child {
					background: #28b457;
				}
			}
		}

	}

	.bottom {
		border-radius: 5px;
		width: 100%;
		height: 470px;
		iframe {
			width: 100%;
			height: 100%;
		}
	}

</style>