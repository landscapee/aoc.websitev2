<template>
	<div class="topIndex">

		<div :class="'item item' +index +'  ' +opt.classBox||''" v-for="(opt,index) in pageObj" :style="opt.deal=='delay0'&&warnInfo.levelCn?{background:warnCfg[warnInfo.levelCn]}:opt.style"
			 :key="index+'q'">
			<template v-if="opt.deal=='runningNew0'">
				<div class="left">应急救援</div>

				<div class="rightItem" v-for="(opt1,index) in emergencyCfg" :key="index+'w'">
					<!--<icon-svg :iconClass="opt.icon"></icon-svg>-->
					<img :src="opt1.icon" alt="">
					<div class="timeText">
						<div class="first"><span>{{displayTime('HH:mm',index)}}</span>({{displayTime('DD',index)}})
						</div>
						<div class="second">指令发出时间</div>
					</div>
				</div>
			</template>
			<template v-else-if="opt.deal=='runningNew4'">
				<div class="rightItem">
					<icon-svg :iconClass="opt.icon"></icon-svg>

					<div class="timeText">
						<div class="first"><span>{{getData( 'indicator.flightIndicator.predict')}}</span>架次</div>
						<div class="second">航班指标预测</div>
					</div>
					<div class="timeText">
						<div class="first"><span>{{getData( 'flightDelay.flightNum')}}</span>架次</div>
						<div class="second">实时延误航班</div>
					</div>
				</div>
			</template>
			<template v-else-if="opt.deal=='weather0'">
				<div class="  rightItem">
					<div class="svgBox">
						<img :src="weatherImg[weatherWarnInfo.warnType ]" alt="">
						<span class="thunder">{{weatherWarnInfo.warnType }}</span>
					</div>
					<div class="right">
						<div class="timeText">
							<div class="first">
								<span>{{tranTime( weatherWarnInfo.publishTime,'HH:mm')}}</span>
								({{tranTime( weatherWarnInfo.publishTime,'DD')}})
							</div>
							<div class="second">预警发布时间</div>
						</div>
						<div class="shuxian"></div>
						<div class="timeText">
							<div class="first"><span>{{tranTime( weatherWarnInfo.expectStartTime,'HH:mm')+'~'+tranTime( weatherWarnInfo.expectEndTime,'HH:mm')}}</span>
							</div>
							<div class="second">影响时间段</div>
						</div>
					</div>

				</div>
			</template>
			<template v-else-if="opt.deal=='delay0'">
				<div class="  rightItem">
					<div class="svgBox">
						<icon-svg iconClass="xiangying"></icon-svg>
						<span class="thunder">{{warnInfo.levelCn && warnInfo.levelCn + '响应'}}</span>
					</div>
					<div class="right">
						<div class="timeText">
							<div class="first">
								<span>{{tranTime( warnInfo.startTime,'HH:mm')}}</span>
								({{tranTime( warnInfo.startTime,'DD')}})
							</div>
							<div class="second">发布时间</div>
						</div>
						<div class="shuxian"></div>
						<div class="timeText">
							<div class="first">
								<span>{{tranTime( warnInfo.endTime,'HH:mm')}}</span>
								({{tranTime( warnInfo.endTime,'DD')}})
							</div>
							<div class="second">结束时间</div>
						</div>
					</div>

				</div>
			</template>
			<template v-else-if="opt.deal=='delay6'">
				<div class="  rightItem">
					<icon-svg iconClass="zjycpdsyjg"></icon-svg>
					<div class="timeText timeText1">
						<div class="first">
							<span>{{getData('indicator.average')}}</span>分钟
						</div>
						<div class="second">平均起降间隔</div>
					</div>
					<div class="timeText ">
						<div class="first"><span>{{getData(opt.key)}}</span>分钟</div>
						<div class="second">
							<div>最近一次</div>
							<div>跑道使用间隔</div>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="rightItem">
					<div class="rightItem" :class="opt.class" @click="showTable(opt)">
						<icon-svg :iconClass="opt.icon"></icon-svg>
						<div class="timeText">
							<div class="first"><span>{{getData(opt.key)}}</span>{{opt.unit}}</div>
							<div class="second">{{opt.name}}</div>
						</div>

					</div>
					<div class="tableBoxPosition" v-if="opt.click=='alternateLanding'">
						<alternateLanding v-show="tabTable" @resetTabTable="resetTabTable"
										  ref="alternateLanding"></alternateLanding>

					</div>
				</div>

			</template>
		</div>

	</div>
</template>

<script>
    import pageSettingObj from './pageSetting'
    import alternateLanding from './alternateLanding'
    import ssjd from '@assets/img/ssjd.png'
    import zbjd from '@assets/img/zbjd.png'
    import jsjd from '@assets/img/jsjd.png'
    import dafeng from '@assets/img/dafeng.png'
    import leidian from '@assets/img/leidian.png'
    import dawu from '@assets/img/dayu.png' //大雾
    // import baoyu from '@assets/img/baoyu.png'
    import moment from 'moment'
    import {get} from 'lodash'
    import postal from 'postal';
    import PostalStore from '@ui_lib/postalStore'

    let postalStore = new PostalStore()
    export default {
        name: 'topIndex',
        components: {alternateLanding},
        props: ['setting'], //setting 和 pageSetting文件里的对象对应
        data() {
            return {
                tabTable: null,
                pageObj: [],
                emergencyEventNode: [],
                postalStoreObj: [],
                weatherStat: {},//备降外场、取消航班
                estimatedBacklog: '',// 预测航班积压量
                indicator: {},//   航班指标
                flightDelay: {},// 实时延误航班 数量
                weatherWarnInfo: {},// 新气象灾害
                warnInfo: {},// 大面积延误 警告
                emergencyCfg: [
                    {key: 'ready', icon: zbjd},
                    {key: 'doing', icon: ssjd},
                    {key: 'finish', icon: jsjd},
                ],
                warnCfg: {
                    红色: '#FF4747',
                    橙色: '#e78e32',
                    黄色: '#ceaa26',
                },
                weatherImg: {
                    雷电天气: leidian,
                    大风天气: dafeng,
                    大雾天气: dawu,
                },
            }
        },
        computed: {
            displayTime() {
                return (type, index) => {

                    let v = this.emergencyEventNode[index]?.createTime
                    if (!v || !moment(v).isValid()) {
                        return '--'
                    }
                    return moment(v).format(type)
                }
            },
            tranTime() {
                return (v, type) => {
                    if (!v || !moment(v).isValid()) {
                        return '--'
                    }
                    return moment(v).format(type)
                }
            },
            getData() {
                return (key) => {
                    // console.log(33333 , this,get(this, key, '--'),key);
                    return get(this, key, '--')
                }
            }
        },
        methods: {
            resetTabTable() {
                this.tabTable = null
            },
            showTable(opt) {
                if (!opt.click) {
                    return false
                }
                this.$refs.alternateLanding[0].open(opt.click)
                this.tabTable = opt.click
            },
        },
        created() {
            // this.setting  props
            postal.publish({
                channel: 'Worker',
                topic: 'Page.runningNew.Start',
            });
            this.pageObj = pageSettingObj[this.setting]
        },
        mounted() {
            postalStore.sub('emergencyEventNode', ({data, key}) => {
                this[key] = data
                console.log(key, data);
            });
            postalStore.sub('push.top.Data', ({data, key}) => {
                this[key] = data
                // console.log(2222, key, data);
            })
            postal.publish({
                channel: 'Worker',
                topic: 'Get.flightDelay.Data',
            });
        },
        beforeDestroy() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.runningNew.Stop',
            })
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.topIndex {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		display: flex;
		color: #fff;
		.item {
			flex: 1 1 auto;
			height: 100%;
			border-radius: 5px;
			box-shadow: 0px 2px 10px 0px rgba(63, 78, 90, 0.05);
			margin-left: 10px;
			padding: 0px 22px;
			.rightItem {
				height: 100%;
				display: flex;
				align-items: center;
				position: relative;
 				.tableBoxPosition {
					position: absolute;
					top: 75px;
					z-index: 1000;
					border-radius: 4px;
				}
				.timeText {
					margin-left: 12px;
					.first {
						margin-bottom: 5px;
						span {
							font-size: 22px;
							font-family: FjallaOne;
							margin-right: 1px;
						}
					}
					.second {
						color: rgba(255, 255, 255, 0.51);
					}
				}
			}
			svg {
				width: 45px;
				height: 45px;
			}
		}
		.item0 {
			flex: 0 1 auto;
			width: 570px;
			margin-left: 0;
			display: flex;
			padding: 5px;
			display: flex;
			.left {
				text-align: center;
				writing-mode: vertical-rl;
				padding: 2px 8px 2px 5px;
				font-family: FjallaOne;
				color: #0566ff;
				font-weight: 600;
				border-radius: 5px;
				/*background: url('../../assets/img/yjjy.png');*/
				background: url('../../../../assets/img/yjjy.png');
				background-size: 100% 100%;
			}
			.rightItem:nth-child(2) {
				margin-left: 25px !important;
			}
			.rightItem {
				margin-left: 35px;

				img {
					width: 43px;
				}
			}
		}
		.weather0 {
			width: 505px;
			.rightItem {
				margin-left: 15px;
				width: 100%;
				padding-right: 40px;
			}
			.svgBox {
				display: flex;
				align-items: center;
				width: 140px;
				.thunder {
					margin-left: 10px;
					font-size: 20px;
				}
			}
			.right {
				height: 100%;
 				flex: 1 1 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.shuxian {
				height: 25px;
				border-right: 1px solid #236ed1;
			}
		}
		.item4 {
			flex: 0 1 auto;
			width: 310px;
		}
		.delay4{
			width: 280px;
		}
		.delay5{
			width: 200px;
		}
		.delay6{
			width: 280px;
			.timeText1{
				/*width: 120px;*/
			}
		}
	}
</style>