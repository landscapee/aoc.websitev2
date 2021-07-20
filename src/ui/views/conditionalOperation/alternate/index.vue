<template>
	<div id="alternate">
		<div :class="key" v-for="(item,key) in pagObj" :key="key">
			<div :class="opt.class" v-for="opt in item" :key="opt.key">
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

					<ele-table :columnConfig="opt.tableConfig"  :table-data="getData(opt)">
						<!--备降航班统计-->
						<el-table-column  label="航线" slot="displayRouter" align="center"  width="255px">

							<template   slot-scope="{row,index}" >
								<div class="hangxian"  >
									<div v-for="(opt,index) in row.displayRouter" :key="index">
										<span v-if="index!==0"><icon-svg iconClass="jiantou"></icon-svg></span>
										<span>{{opt}} </span>
									</div>
								</div>
							</template>
						</el-table-column>

						<el-table-column  label="操作" slot="option1" align="center"  width="50px">

							<template   slot-scope="{row,index}" >
								<div class="optionq"   >
									<span class="cursor" @click="editHandle(row)">编辑</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column  label="航班号" slot="flightNo" align="center"  width="60px">

							<template   slot-scope="{row,index}" >
								<div    >
									<span class="cursor" @click="toFlight(row)">{{row.flightNo}}</span>
								</div>
								<!--临时机位-->
							</template>
						</el-table-column>


					</ele-table>
				</div>
				<div class="other" v-else>
					<component  :data="getData(opt)" :is="opt.component"></component>
 				</div>
			</div>

		</div>
		<Edit ref="Edit"></Edit>
	</div>
</template>

<script>
    import Edit from './edit'
    import {LandingConfig, tempSeatConfig, exigencyConfig} from './help'
    import myEcharts from './echarts'
    import jjjyjw from './jjjyjw.vue'
    import jwkc3xs from './jwkc3xs.vue'
    import moment from 'moment'
    import {map, mapKeys} from 'lodash';
    import postal from 'postal';
    import PostalStore from "../../../lib/postalStore";
    import AdvTable from "@/ui/components/advTable.vue"

    let postalStore = new PostalStore();
    export default {
        components: {
            myEcharts, jjjyjw, jwkc3xs, Edit,AdvTable,
        },
        data() {
            let _this = this
            return {
                JWKCtime: new Date(),
                timetext: '当前',
                timetextFlag: false,
                dataObj: {//key跟 pagObj的item的key关联
                    alternateLanding: [{securityCheck: 0, flightNo: '121', waitTime: 121}],
                },
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
                            time: true, data: {},
                            key: 'seatEvaluate',
                            component: 'jwkc3xs',
                            class: 'alternateTopDiv div3'
                        },
                    ],
                    alternateBottom: [
                        {name: '临时等待区',data:{}, key: 'tempWaitArea', component: 'myEcharts', class: 'alternateTopDiv div1'},
                        {
                            name: '应急下客区',
                            key: 'exigencyDropOffArea',
                            tableConfig: exigencyConfig,
                            class: 'alternateTopDiv div2'
                        },
                        {
                            name: '紧急加油机位',
                            key: 'exigencyRefuelSeat',
                            data: [],
                            component: 'jjjyjw',
                            class: 'alternateTopDiv div3'
                        },
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
                             picker.$emit('pick', date);
                        }
                    }]
                },
            }
        },
        computed: {
            getData() {
                return (opt) => {
                    return this.dataObj[opt.key] || opt.data || []
                }
            },
        },
        methods: {
            toFlight(row){
                 this.$FlightDetais.open({flightId:row.flightId})
			},
            editHandle(row) {
                this.$refs.Edit.open({...row})
            },
            JWKCtimeChange(val) {
                if (!this.timetextFlag) {
                    this.timetext = moment(val).format('yyyy-MM-DD HH:mm:ss')
                }
                this.timetextFlag = false
                let obj = {
                    type: 3,
                    queryDate: moment(val).format('yyyy-MM-DD HH:mm:ss')
                }
                this.$request.post('adverse', 'stat/seatEvaluate', obj, true).then((res) => {
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
                key == 'tempWaitArea' && console.log(key, data);
                let data1 = data
                if (key == 'seatEvaluate') {
                    data1 = {}
                    map(data.info, (k, l) => {
                        data1[k.seatType] = {idleNum: k.idleNum}
                    })
                }
                this.$set(this.dataObj, key, data1)
            });

        },
        beforeDestroy() {
            this.$FlightDetais.destroy()
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
		position: relative;
		.hangxian {
			display: flex;
			justify-content: center;
			svg {
				margin: 0 2px;
				width: 10px;
				fill: #3b639a;
			}
		}
		.optionq {
			span {
				display: inline-block;
				background: #0566ff;
				padding: 0px 11px;
				border-radius: 10px;
			}
		}
		table {
			width: 100% !important;

		}
		::v-deep table {
			width: 100% !important;

		}

		::v-deep .cell {
			font-size: 12px !important;
			font-weight: 400;
			font-family: FjallaOne !important;
			padding: 0 2px !important;
			*{
				font-size: 12px !important;
				font-family: FjallaOne !important;
			}

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
		.other{
			height: calc(100% -  20px);
		}
	}
</style>