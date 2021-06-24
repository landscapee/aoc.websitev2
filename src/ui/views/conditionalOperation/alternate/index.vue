<template>
	<div id="alternate">
		<div :class="key" v-for="(item,key) in pagObj" :key="key">
			<div :class="opt.class" v-for="opt in item" :key="opt.name">
				<div class="title">
					<span></span>
					<span> {{opt.name}}</span>
					<div class="rightTime" v-if="opt.time">
						<div class="timetext">{{timetext}}</div>
						<el-date-picker @change="JWKCtimeChange" v-model="JWKCtime" type="datetime" size="mini"
										format="yyyy-MM-dd HH:mm"
										placeholder="选择日期时间" align="right" :picker-options="pickerOptions">
						</el-date-picker>
					</div>
				</div>
				<div class="tableBox" v-if="opt.tableConfig">
					<ele-table :columnConfig="opt.tableConfig" :tableData="opt.data"></ele-table>
				</div>
				<div class="other" v-else>
					<component :data="opt.data" :is="opt.component"></component>
				</div>
			</div>

		</div>

	</div>
</template>

<script>
    import {LandingConfig, tempSeatConfig, exigencyConfig} from './help'
    import myEcharts from './echarts'
    import jjjyjw from './jjjyjw.vue'
    import jwkc3xs from './jwkc3xs.vue'
    import moment from 'moment'
    import {map, mapKeys} from 'lodash';
    import postal from 'postal';
    import PostalStore from "../../../lib/postalStore";
    import * as echarts from 'echarts'
    import {getBarLineOption} from './options'

    let postalStore = new PostalStore();
    export default {
        components: {
            myEcharts, jjjyjw, jwkc3xs
        },
        data() {
            let _this = this
            return {
                JWKCtime: new Date(),
                timetext: '当前',
                timetextFlag: false,
                dataObj: {}, //key跟 pagObj的item的key关联
                pagObj: {
                    alternateTop: [
                        {
                            name: '备降航班统计',
                            key: 'alternateLanding',
                            tableConfig: LandingConfig,
                            class: 'alternateTopDiv div1'
                        },
                        {name: '临时机位', key: 'tempSeat', tableConfig: tempSeatConfig, class: 'alternateTopDiv div2'},
                        {
                            name: '机位空出3小时',
                            time: true,
                            key: 'seatEvaluate',
                            component: 'jwkc3xs',
                            class: 'alternateTopDiv div3'
                        },
                    ],
                    alternateBottom: [
                        {name: '临时等待区', key: 'tempWaitArea', component: 'myEcharts', class: 'alternateTopDiv div1'},
                        {
                            name: '应急下客区',
                            key: 'exigencyDropOffArea',
                            tableConfig: exigencyConfig,
                            class: 'alternateTopDiv div2'
                        },
                        {name: '紧急加油机位', key: 'exigencyRefuelSeat', component: 'jjjyjw', class: 'alternateTopDiv div3'},
                    ],
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '当前',
                        onClick(picker) {
                            _this.timetext = '当前';
                            _this.timetextFlag = true;
                            let date = new Date()
                            date = date.setMinutes(0)
                            date = new Date(date).setSeconds(0)
                            date = new Date(date).setMilliseconds(0);
                            console.log(222, new Date(date));
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '半小时后',
                        onClick(picker) {

                            _this.timetext = '半小时后';
                            _this.timetextFlag = true;
                            let date = new Date();
                            date = date.setMilliseconds(0);
                            date = new Date(date).setSeconds(0)
                            date = new Date(date).setMinutes(30)
                            console.log(222, new Date(date));
                            picker.$emit('pick', date);
                        }
                    }]
                },
            }
        },

        methods: {
            JWKCtimeChange(val) {
                if (!this.timetextFlag) {
                    this.timetext = moment(val).format('yyyy-MM-DD HH:mm')
                }
                this.timetextFlag = false
                let obj = {
                    type: 3,
                    queryDate: moment(val).format('yyyy-MM-DD HH:mm')
                }
                this.$request.post('adverse', 'stat/seatEvaluate', obj, false).then((res) => {
                    if (res.code != 200) {
                        this.$message.warning(res.message)
                        return
                    }
                    let data = mapKeys(res.info, (item) => item.seatType);
                    this.$set(this.dataObj, 'seatEvaluateFree', data)

                })
            }
        },
        created() {

            postal.publish({
                channel: 'Worker',
                topic: 'Page.alternate.Start',
            });
        },
        mounted() {

            postalStore.sub('alternateData', ({data, key}) => {
                console.log('alternateData,data', data);
                this.$set(this.dataObj, key, data)
            });

        },
        beforeDestroy() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.alternate.Stop',
            })

            postalStore.unsubAll()
        }
    }
</script>
<style scoped lang="scss">
	::v-deep .el-table__header,
	::v-deep .el-table__body {
		width: 100% !important;
		
	}

	.tableBox {
		margin-top: 15px;
		width: 100%;
		height: calc(100% - 30px);

		.cell {
			font-size: 12px;
			font-weight: 400;
		}
		table {
			width: 100% !important;
		}

		::v-deep .cell {
			font-size: 12px;
			font-weight: 400;
			padding: 0 2px !important;
		}

	}

	#alternate {
		box-sizing: border-box;
		.alternateBottom, .alternateTop {
			display: flex;
			height: calc(50% - 15px);
			margin-bottom: 15px;
			.alternateTopDiv, .alternateBottomDiv {
				padding: 12px 15px;
				background: #18243b;
				height: 100%;
				margin-left: 15px;
				.title {
					position: relative;
					span {
						display: inline-block;
						vertical-align: middle;
						color: #fff;
						font-family: ALiB;
						font-size: 12px;
					}
					& > span:first-child {
						width: 4px;
						height: 12px;
						opacity: 1;
						background: #649fff;
						border-radius: 1px;
						margin: 0 5px 0 0px;
					}
					.rightTime {
						position: absolute;
						right: 0px;
						top: -5px;
						.el-date-editor.el-input {
							width: 115px;
							opacity: 0;
							top: 0;
							position: absolute;
							::v-deep .el-input__inner {
								padding: 0 5px;
								height: 30px;
							}
							::v-deep .el-input__suffix,
							::v-deep .el-input__prefix {
								display: none;
							}
						}
						.timetext {
							width: 115px;
							height: 30px;
							line-height: 30px;
							color: #fff;
							font-size: 12px;
							text-align: center;
							background: #2b3645;
						}
					}
				}
			}
			& > div:first-child {
				margin-left: 0;
			}

		}
		.alternateTop {
			.div1 {
				width: 937px;
			}
			.div2 {
				width: 649px;
			}
			.div3 {
				width: 274px;
				.title {
					margin-top: 5px;

				}
			}
		}
		.alternateBottom {
			.div1 {
				width: 555px;
			}
			.div2 {
				width: 654px;
			}
			.div3 {
				width: 654px;
			}
		}
	}
</style>