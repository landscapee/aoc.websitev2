<template>
	<div class="resourceMonitoring">
		<div class="left">
			<div class="leftItem leftItem1" v-for="(opt,key) in dataSituation" :key="key">
				<div class="itemTitle">
					<div class="div1"><span></span><span>{{opt.name}}</span></div>
					<div class="div2">
						<span>
							<span></span><span>实际</span>
						</span>
						<span>
							<span></span><span>预计</span>
						</span>
					</div>
				</div>
				<div class="eChartsBox">
					<div class="tabsBox">
						<MyTabs :tabs="opt.tabs" :activeName="tabObj[key]"
								@tabClick="tabClick(arguments[0],opt)"></MyTabs>
					</div>
					<div  class="eCharts" :ref="'eCharts'+key">
					</div>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="rightItem rightItem1">
				<div class="itemTitle ">
					<div class="div1"><span></span><span> 实时停机位使用情况</span></div>
				</div>
				<div class="banner">
					<div class="bannerItem">
						<div>
							<img src="../../assets/img/tianfu/jiwei.png" alt="">
						</div>
						<div>
							<div>370</div>
							<div>机位总数</div>
						</div>
					</div>
					<div class="bannerItem">
						<div>
							<img src="../../assets/img/tianfu/kyjiwei.png" alt="">
						</div>
						<div>
							<div>370</div>
							<div>可用机位总数</div>
						</div>
					</div>
					<div class="bannerItem">
						<div>
							<img src="../../assets/img/tianfu/bkyjiwei.png" alt="">
						</div>
						<div>
							<div>370</div>
							<div>不可用机位总数</div>
						</div>
					</div>
				</div>
				<div class="baifenbiBox">
					<div class="baifenbi" v-for="item in 4 " :key="item+'baifenbi'">
						<div class="baifenbiLeft">C</div>
						<div class="baifenbiMiddle">
							<div>50/120</div>
							<div>占用数/总数</div>
						</div>
						<div class="baifenbiRight">
							<el-progress :percentage="50"></el-progress>
						</div>
					</div>

				</div>
			</div>
			<div class="rightItem rightItem1_1">
				<div class="baifenbiBox">
					<div class="baifenbi" v-for="item in getNum " :key="item+'baifenbi'">
						<div class="baifenbiLeft">C</div>
						<div class="baifenbiMiddle">
							<div>50/120</div>
							<div>占用数/总数</div>
						</div>
						<div class="baifenbiRight">
							<el-progress :percentage="50"></el-progress>
						</div>
					</div>
				</div>
			</div>
			<div class="rightItem rightItem1_2">
				<div class="baifenbiBox">
					<div class="baifenbi" v-for="item in getNum " :key="item+'baifenbi'">
						<div class="baifenbiLeft">C</div>
						<div class="baifenbiMiddle">
							<div>50/120</div>
							<div>占用数/总数</div>
						</div>
						<div class="baifenbiRight">
							<el-progress :percentage="50"></el-progress>
						</div>
					</div>
				</div>
			</div>

			<div class="rightItem rightItem2">
				<div class="itemTitle">
					<div class="div1"><span></span><span> 实时登机口使用情况</span></div>
				</div>

				<div class="baifenbiBox">
					<div class="baifenbi" v-for="opt in 5 " :key="opt+'rightItem3'">
						<div class="baifenbiLeft">C</div>
						<div class="baifenbiMiddle">
							<div>50/120</div>
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
					<div class="baifenbi" v-for="opt in 2 " :key="opt+'rightItem3'">
						<div class="baifenbiLeft">C</div>
						<div class="baifenbiMiddle">
							<div>50/120</div>
							<div>占用数/总数</div>
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
    import {map, cloneDeep,extend} from 'lodash';
    import PostalStore from "../../lib/postalStore";
    import * as echarts from 'echarts'
    import {getBarLineOption} from './options'

    let postalStore = new PostalStore();
    export default {
        name: "index",
        components: {MyTabs},
        data() {
            return {
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
            }
        },
        computed: {
            getNum() {
                return 2
            },

        },
        methods: {
            tabClick(tab, opt) {
                this.tabObj[opt.key] = tab.name
				let data=this.echartsData[opt.key][tab.key]
				this.setOptions(data,opt.key)
            },
            setOptions(item, key,blo) {
                 let tabData=item[this.tabObj[key]]||{};
                let xData =  map(tabData.minList||[],(item, i) => {
                    let hour = parseInt(item / 60) === 0 ? '00' : parseInt(item / 60).toString().length == 1 ? '0' + parseInt(item / 60) : parseInt(item / 60);
                    let minute = item % 60 === 0 ? '00' : (item % 60) + '';
                    return hour + minute;
                });
                 let  yData = [{name: '实际', data: tabData.actNumList}, {
                    name: '预计',
                    data: tabData.planNumList||[]
                }];
                let  yData2 = [{name: '总实际', data: tabData.totalList}, {
                    name: '总预计',
                    data: tabData.totalList||[]
                }];
                console.log('tabData',tabData, xData);
                let tooltipName = this.dataSituation[key].tooltipName
                let option1=getBarLineOption({...tabData,xData,yData,yData2, tooltipName})
                console.log(222,this.echartsInstance);
                let option=extend(this.echartsInstance[key].getOption()||{},option1)
				this.echartsInstance[key].setOption(option)
            },
        },
        created() {

            postal.publish({
                channel: 'Worker',
                topic: 'Page.resourceMonitoring.Start',
            });
        }
        ,
        mounted() {
            this.isMounted = true
            map(this.echartsInstance, (k, key) => {
                this.$nextTick(()=>{
                    let ele = this.$refs['eCharts' + key][0]
                    this.echartsInstance[key] = echarts.init(ele)
                    // this.setOptions({}, key)
				})

            })
            postalStore.sub('resourceSituationData', (data) => {
                console.log('resourceSituationData,data', data);
                map(data, (item, key) => {
                    this.dataSituation[key].tabs = cloneDeep(item.tabs)
                    item.tabs ? delete item.tabs : ''
                    this.echartsData[key] = item;
					this.setOptions(item, key)
                })
            })
        }
        ,
        beforeDestroy() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.resourceMonitoring.Stop',
            })
            map(this.echartsInstance, (k, key) => {
                this.echartsInstance[key].dispose()
            })
            postalStore.unsubAll()
        }
        ,
    }
</script>

<style lang="scss" scoped>
	.eCharts {

		::v-deep & > div {
			border: none !important;
			box-shadow: none !important;
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
				/*height: calc(33.3333% - 10px);*/
				height: 281px;
				margin-top: 15px;
				padding: 18px 19px 11px 6px;
				background: rgba(25, 37, 60, 0.8);
				border-radius: 5px;
				box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
				.eChartsBox {
					.eCharts {
						height: 238px;
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
				font-family: AlibabaPuHuiTiB;
				font-size: 14px;

			}
			.div1 {
				height: 25px;
				line-height: 25px;
				span:first-child {
					width: 4px;
					height: 16px;
					opacity: 1;
					background: #649fff;
					border-radius: 1px;
					margin: 0 8px 0 10px;
				}
				span:last-child {
					font-size: 18px;
				}
			}
			.div2 {
				& > span {
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
				& > span:last-child {
					margin-left: 30px;
					span:first-child {
						background: linear-gradient(180deg, #25e0e7, #00cad2);
					}
				}
			}
		}
		.right {
			height: calc(100%);
			overflow-y: auto;
			width: 643px;
			border-radius: 5px;
			box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.50);
			.rightItem:first-child {
				/*border-radius: 5px 5px 0 0;*/
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
					margin-bottom: 12px;
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
						font-size: 18px;
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
