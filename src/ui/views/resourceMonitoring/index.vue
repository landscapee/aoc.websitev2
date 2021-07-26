<template>
	<div class="resourceMonitoring">
		<div class="left">
			<div class="leftItem leftItem1" v-for="(opt,key) in dataSituation" :key="key">
				<div class="itemTitle">
					<div class="div1"><span></span><span>{{opt.name}}</span></div>
					<div class="div2">
						<span class="shiji">
							<span></span><span>实际</span>
						</span>
						<span class="yuji" v-if="tabObj[key]=='全部'||key!=='gateSituation'">
							<span></span><span>预计</span>
						</span>
					</div>
				</div>
				<div class="eChartsBox">
					<div class="tabsBox">
						<MyTabs :tabs="opt.tabs" :activeName="tabObj[key]"
								@tabClick="tabClick(arguments[0],opt)"></MyTabs>
					</div>
					<div class="eCharts" :ref="'eCharts'+key">
					</div>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="itemheight1">
				<div class="rightItem rightItem1">
					<div class="itemTitle ">
						<div class="div1">
							<span></span>
							<span> 实时停机位使用情况({{seatUsageKey=='split'?'拆分':'复合'}})
							<span class="cursor" @click="qiehuanSeat">
								<icon-svg iconClass="qiehuan"></icon-svg>
							</span>
						</span>
						</div>
					</div>
					<div class="banner">
						<div class="bannerItem">
							<div>
								<img src="../../assets/img/tianfu/jiwei.png" alt="">
							</div>
							<div>
								<div>{{getSeatNum('total')}}</div>
								<div>机位总数</div>
							</div>
						</div>
						<div class="bannerItem">
							<div>
								<img src="../../assets/img/tianfu/kyjiwei.png" alt="">
							</div>
							<div>
								<div>{{getSeatNum('usable')}}</div>
								<div>可用机位总数</div>
							</div>
						</div>
						<div class="bannerItem">
							<div>
								<img src="../../assets/img/tianfu/bkyjiwei.png" alt="">
							</div>
							<div>
								<div>{{getSeatNum('disabled')}}</div>
								<div>不可用机位总数</div>
							</div>
						</div>
					</div>
					<div class="baifenbiBox">
						<div class="baifenbi" v-for="item in getSeatData('modelList') " :key="item.type+'baifenbi'">
							<div class="baifenbiLeft">{{item.type}}</div>
							<div class="baifenbiMiddle">
								<div>{{item.using}}/{{item.total}}</div>
								<div>占用数/总数</div>
							</div>
							<div class="baifenbiRight">
								<el-progress :percentage="getProgress(item)"></el-progress>
							</div>
						</div>

					</div>
				</div>
				<div class="rightItem rightItem1_1">
					<div class="baifenbiBox">
						<div class="baifenbi" v-for="item in getSeatData('terminalList') " :key="item.type+'baifenbi'">
							<div class="baifenbiLeft">{{item.type}}</div>
							<div class="baifenbiMiddle">
								<div>{{item.using}}/{{item.total}}</div>
								<div>占用数/总数</div>
							</div>
							<div class="baifenbiRight">
								<el-progress :percentage="getProgress(item)"></el-progress>
							</div>
						</div>
					</div>
				</div>
				<div class="rightItem rightItem1_2">
					<div class="baifenbiBox">
						<div class="baifenbi" v-for="item in getSeatData('seatTypeList') " :key="item.type+'baifenbi'">
							<div class="baifenbiLeft">{{item.type}}</div>
							<div class="baifenbiMiddle">
								<div>{{item.using}}/{{item.total}}</div>
								<div>占用数/总数</div>
							</div>
							<div class="baifenbiRight">
								<el-progress :percentage="getProgress(item)"></el-progress>
							</div>
						</div>
					</div>
				</div>


			</div>
			<div class="itemheight2">
				<div class="rightItem rightItem2">
					<div class="itemTitle">
						<div class="div1"><span></span><span> 实时登机口使用情况</span></div>
					</div>

					<div class="baifenbiBox">
						<div class="baifenbi" v-for="opt in gateUsageData " :key="opt.type+'rightItem2'">
							<div class="baifenbiLeft">{{opt.type}}</div>
							<div class="baifenbiMiddle">
								<div>{{opt.using}}/{{opt.total}}</div>
								<div>占用数/总数</div>
							</div>
						</div>
					</div>
				</div>
				<div class="rightItem rightItem3">
					<div class="itemTitle">
						<div class="div1"><span></span><span> 实时行李转盘使用情况</span></div>
					</div>
					<div class="baifenbiBox">
						<div class="baifenbi" v-for="opt in carouselUsageData " :key="opt.type+'rightItem3'">
							<div class="baifenbiLeft">{{opt.type}}</div>
							<div class="baifenbiMiddle">
								<div>{{opt.using}}/{{opt.total}}</div>
								<div>占用数/总数</div>
							</div>
						</div>

					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
    import MyTabs from './components/tabs'
    import postal from 'postal';
    import {map, cloneDeep, extend} from 'lodash';
    import PostalStore from "../../lib/postalStore";
    import * as echarts from 'echarts'
    import {getBarLineOption,gateSituationLineOption} from './options'
    import {debounce} from '@/ui/lib/common.js'

    let postalStore = new PostalStore();
    export default {
        name: "index",
        components: {MyTabs},
        data() {
            return {

                seatUsageKey: 'split',//complex 复合 split 拆分
                isMounted: false,
                // tabs 切换时 点击的 tab 的key
                tabObj: {
                    seatSituation: '全部',
                    gateSituation: '全部',
                    carouselSituation: '全部',
                },
                // echarts实例对象，销毁需要
                echartsInstance: {
                    seatSituation: null,
                    gateSituation: null,
                    carouselSituation: null,
                },
                // echarts数据 与dataSituation 对应
                echartsData: {
                    seatSituation: null,
                    gateSituation: null,
                    carouselSituation: null,
                },
                dataSituation: {
                    seatSituation: {name: '停机位态势', tooltipName: '停机位总数', key: 'seatSituation', tabs: []},
                    gateSituation: {name: '登机口态势', tooltipName: '登机口总数', key: 'gateSituation', tabs: []},
                    carouselSituation: {name: '行李转盘态势', tooltipName: '行李转盘总数', key: 'carouselSituation', tabs: []}
                },
                // 实时停机位使用情况
                seatUsageData: {},
                // 登机口当前使用情况
                gateUsageData: [],
                //行李转盘当前使用情况
                carouselUsageData: [],
            }
        },
        computed: {
            getProgress() {
                return ( item )=>{
                    let num = 0
					if(item.total>0){
                        num = parseInt(item.using / item.total * 100)
					}
                    return num
                };
            },
            getSeatNum() {
                return (key) => {
                    let obj = this.seatUsageData[this.seatUsageKey]
                    return obj && obj[key] || 0
                }
            },
            getSeatData() {
                return (key) => {
                    let obj = this.seatUsageData[this.seatUsageKey]
                    return obj && obj[key] || []
                }
            },


        },
        methods: {
            qiehuanSeat() {
                let seatUsageKeyObj = {
                    split: 'complex',
                    complex: 'split',
                };
                this.seatUsageKey = seatUsageKeyObj[this.seatUsageKey]
            },
            tabClick(tab, opt) {
                this.tabObj[opt.key] = tab.name
                let data = this.echartsData[opt.key]
                this.setOptions(data, opt.key)
            },
            setOptions(item, key) {
                let tabData = item[this.tabObj[key]] || {};
                let 	actNumList=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //实际占用
                    disabledList= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //不可用
                    minList= ['0030', '0130', '0230', '0330', '0430', '0530', '0630', '0730', '0830', '0930', '1030', '1130', '1230', '1330', '1430', '1530', '1630', '1730', '1830', '1930', '2030', '2130', '2230', '2330'], //时间段
                    planNumList= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //计划占用
                    totalList= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //总量
                    usableList= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //可用
                    actSurplusList= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //实际空余
                    planSurplusList= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //预计空余
                let xData, yData, yData2,tooltipName,options ;
                let yDataTotal, yDataTotal2; //用于全部
                xData =tabData?.minList ? map(tabData.minList, (item, i) => {
                    let hour = parseInt(item / 60) === 0 ? '00' : parseInt(item / 60).toString().length == 1 ? '0' + parseInt(item / 60) : parseInt(item / 60);
                    let minute = item % 60 === 0 ? '00' : (item % 60) + '';
                    return hour + minute;
                }):minList;
                yData = [{name: '实际', data: tabData?.actNumList||actNumList}, {
                    name: '预计',
                    data: tabData?.planNumList || planNumList
                }];
                yData2 = [{name: '总实际', data: tabData?.totalList||totalList}, {
                    name: '总预计',
                    data: tabData?.totalList || totalList
                }];
                usableList = tabData?.usableList||usableList;
                disabledList = tabData?.disabledList||disabledList;
                actSurplusList = tabData?.actSurplusList||actSurplusList;
                planSurplusList = tabData?.planSurplusList||planSurplusList;
                tooltipName = this.dataSituation[key].tooltipName
                options = getBarLineOption({...tabData, xData, yData, yData2, usableList, disabledList, actSurplusList, planSurplusList,tooltipName})
                if(this.tabObj[key]!=='全部'&&key=='gateSituation'){
                    yDataTotal = [{ name: '实际', data: tabData?.actNumList ||actNumList}];
                    yDataTotal2 = [{ name: '总实际', data: tabData?.totalList ||totalList}];
                    options=gateSituationLineOption(xData, yDataTotal, yDataTotal2, usableList, disabledList, actSurplusList, planSurplusList,tooltipName)
                }
                console.log(111,this.tabObj[key] ,key );
                this.echartsInstance[key].setOption(options)
            },
            resizeEcharts(){
                let timer=debounce(()=>{
                    this.$nextTick(()=>{
                        map(this.echartsInstance,k=>{
                            k.resize();
						})
                    })
                },180)
                return timer
            },
        },
        created() {

            postal.publish({
                channel: 'Worker',
                topic: 'Page.resourceMonitoring.Start',
            });
        },
        mounted() {
            this.isMounted = true
            map(this.echartsInstance, (k, key) => {
                this.$nextTick(() => {
                    let ele = this.$refs['eCharts' + key][0]
                    this.echartsInstance[key] = echarts.init(ele)
                    // this.setOptions({}, key)
                })
            })
            postalStore.sub('resourceSituationData', (data) => {
                // console.log('resourceSituationData,data', data);
                map(data, (item, key) => {
                    this.dataSituation[key].tabs = cloneDeep(item.tabs)
                    item.tabs ? delete item.tabs : ''
                    this.echartsData[key] = item;
                    this.setOptions(item, key)
                })
            });
            postalStore.sub('resourceUsageData', ({data, key}) => {
                console.log('resourceUsageData,data', data, key);
                this[key] = data
            })  ;
            window.addEventListener('resize',this.resizeEcharts())

        },
        beforeDestroy() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.resourceMonitoring.Stop',
            })
            map(this.echartsInstance, (k, key) => {
                this.echartsInstance[key].dispose()
            })
            postalStore.unsubAll()
            window.removeEventListener('resize',this.resizeEcharts())

        },
    }
</script>

<style lang="scss" scoped>
	.itemTitle {
		svg {
			fill: #f78501 !important;
		}

	}

	.eCharts {
		::v-deep & > div {
			box-shadow: none !important;
			border: none !important;
		}
		::v-deep & > div:first-child {
			width: 100% !important;
			height: 100% !important;
			canvas, & > div {
				height: 100% !important;

				width: 100% !important;
			}

		}

	}

	.resourceMonitoring {
		overflow-y: auto;
		padding: 11px 15px;
		display: flex;
		justify-content: left;
		color: #fff;
		box-sizing: border-box;
		.left {
			width: 1230px;
			margin-right: 17px;
			.leftItem:first-child {
				margin-top: 0 !important;
			}

			.leftItem {
				position: relative;
				height: calc(33.3333% - 11px);
				/*height: 281px;*/
				margin-top: 15px;
				padding: 18px 19px 11px 6px;
				background: rgba(25, 37, 60, 0.8);
				border-radius: 5px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
				.eChartsBox {
					height: 100%;
					.eCharts {
						height: calc(100% - 10px);
						width: 100%;

						& > div {
							height: 100%;
						}
						& > div {
							border-style: none !important;
							border: none !important;
						}
						::v-deep & > div:last-child {
							border-style: none;
							border: none !important;
						}
					}
				}
				.tabsBox {
					top: 15px;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
				}
			}
		}
		/*left right 公用*/
		.itemTitle {
			display: flex;
			justify-content: space-between;
			span {
				display: inline-block;
				vertical-align: middle;
				color: #fff;
				font-family: ALiB;
				font-size: 14px;
			}
			.div1 {
				height: 25px;
				line-height: 25px;
				& > span:first-child {
					width: 4px;
					height: 16px;
					opacity: 1;
					background: #649fff;
					border-radius: 1px;
					margin: 0 8px 0 10px;
				}
				& > span:last-child {
					font-size: 18px;
				}
			}
			.div2 {
				.shiji,.yuji {
					span:first-child {
						margin-right: 10px;
						width: 14px;
						height: 14px;
						background: linear-gradient(180deg, #4ca1e2 2%, #3490ff 98%);
					}
					span:last-child {
						font-size: 14px;
					}
				}
				.yuji {
					margin-left: 30px;
					span:first-child {
						background: linear-gradient(180deg, #25e0e7, #00cad2);
					}
				}
			}
		}
		.right {
			height:100%;
			overflow-y: auto;
			width: 643px;
			border-radius: 5px;
			box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
			.itemheight2,.itemheight1{
 				height: calc(66.6666% - 7px );
				display: flex;
				flex-direction: column;
				.rightItem{
					flex: 1 1 auto;
				}
			}
			.itemheight1{
				/*border: 1px #b5d2ff solid;*/
				.rightItem{
					/*border: 1px red solid;*/
 					height: calc(20% - 5px);
					.baifenbiBox{
						height: 100%;
						display: flex;
						flex-direction: column;
						.baifenbi{
							flex: 1 1 auto;
						}
					}
 				}
				.rightItem1{
					padding-top: 10px;
 					height: calc(60% - 15px)!important;
					.baifenbiBox{
 						height: calc(100% - 118px);
 					}
				}
			}
			.itemheight2{
				margin-top: 15px;
				height: calc(33.33333% - 11px );
			}
			.rightItem:first-child {
 				margin-top: 0 !important;
			}
			.rightItem {
				background: rgba(25, 37, 60, 0.8);
				padding: 15px 25px 2px 25px;
				margin-top: 15px;
				.itemTitle {
					margin-left: -24px;
					margin-bottom: 11px;
				}
				.banner {
					display: flex;
					margin-bottom: 5px;
					.bannerItem {
						width: 190px;
						height: 66px;
						display: flex;
						padding: 13px;
						margin-right: 12px;
						background: #3280e7;
						border-radius: 5px;
						box-shadow: 0px 2px 10px 0px rgba(63, 78, 90, 0.05);
						& > div:first-child {
							img {
								width: 40px;
							}
							margin-right: 13px;
						}
						& > div:nth-child(2) {
							div {
								font-size: 20px;
							}
							div:last-child {
								font-size: 13px;
							}
						}
					}
					.bannerItem:nth-child(2) {
						background: #37b6f9;
					}
					.bannerItem:nth-child(3) {
						background: #07c7cf;
						margin-right: 0 !important;
					}
				}

			}
			.baifenbiBox {
				height: 30%;
				.baifenbi:last-child {
					border-bottom: 0;
				}
				.baifenbi {
					display: flex;
					margin-top: 7px;
					padding-bottom: 7px;
					border-bottom: 1px dashed #2d3748;
					.baifenbiLeft {
						width: 40px;
						height: 40px;
						color: #37b6f9;
						font-size: 24px;
						line-height: 40px;
						text-align: center;
						background: url("../../assets/img/tianfu/mounitorBJBKXS.png");
						background-size: 100% 100%;
					}
					.baifenbiMiddle {
						margin: 0 0px 0 19px;
						width: 98px;
						div:first-child {
							font-size: 18px;
							height: 22px;
							line-height: 22px;
						}
						div:last-child {
							margin-top: 3px;
							font-size: 13px;
							color: rgba(255, 255, 255, 0.51);
						}
					}
					.baifenbiRight {
						width: 430px;
						display: flex;
						align-items: center;
						.el-progress {
							width: 100%;

							::v-deep .el-progress-bar__outer {
								background: rgba(255, 255, 255, 0.11) !important;
							}
							::v-deep .el-progress__text {
								margin-left: 18px;
								color: #fff;
								font-size: 18px !important;
							}
						}
					}
				}
			}
			.rightItem1_1, .rightItem1_2 {
				margin-top: 4px;
				padding: 2px 25px;
			}
			.rightItem1_2 {
				border-radius: 0 0 5px 5px;
			}
			.rightItem2 {
				.baifenbi:last-child {
					margin-right: 0 !important;
				}
				.baifenbi {
					width: calc(20% - 8px);;
					display: inline-block;
					margin-right: 5px;
					.baifenbiLeft {
						width: 100%;
						height: 31px;
						line-height: 31px;
						font-size: 16px;
						background: url("../../assets/img/tianfu/djksyqk.png");
						background-size: 100% 100%;
					}
					.baifenbiMiddle {
						width: 100%;
						height: 53px;
						margin: 0 !important;
						border: 1px solid rgba(100, 159, 255, 0.51);
						border-top: 0;
						& > div {
							font-size: 16px;
							text-align: center;
						}

					}
				}
			}
			.rightItem2, .rightItem3 {
				border-radius: 5px;
				.baifenbi {
					border: 0 !important;
					margin-top: 0px;
					.baifenbiMiddle {
						display: flex;
						flex-direction: column;
						justify-content: center;
					}
				}
			}
			.rightItem3 {
				.baifenbiBox {
					display: flex;
					width: 100%;
				}
				.baifenbi:first-child {
					margin-right: 6px;
				}
				.baifenbi {
					width: calc(50% - 6px);
					/*padding-bottom: 3px;*/
					.baifenbiLeft {
						width: 60px;
						height: 60px;
						line-height: 60px;
						font-size: 28px;
						text-align: center;
						color: #07c7cf;
						background: url("../../assets/img/tianfu/ssxlzp.png");
						background-size: 100% 100%;
					}
					.baifenbiMiddle {
						width: calc(100% - 60px);
						height: 58px;
						margin: 1px 0 0 0;
						padding: 0 0 0 20px;
						border: 1px solid rgba(7, 199, 207, 0.51);
						border-left: 0;
					}
				}

			}
		}
	}


</style>
