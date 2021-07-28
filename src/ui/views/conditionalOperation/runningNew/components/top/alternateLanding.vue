<template>
	<div class="box">
		<div class="title">
 			<div class="titleLeft" >
				<div class="shuxian"></div>
				<div class="text">{{key=='alternateLanding'?'备降外场':'取消航班'}}</div>
				<div v-for="(k,l) in data.stat||{}" :key="l">{{getLabel(l)}}:{{k}}&nbsp;&nbsp;</div>

			</div>

			<div class="right">
				<el-date-picker
					@change="getList"
					v-model="time"
					:clearable="false"
					value-format="yyyy-MM-dd HH:mm:ss"
					type="datetimerange"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期">
				</el-date-picker>

			</div>
			<i @click="close" class="positionright  el-icon-circle-close"></i>
		</div>
		<div class="content">
			<ele-table :columnConfig="tableConfig" :table-data="data.detail||[]">
			</ele-table>
		</div>


	</div>
</template>
<script>
    import moment from 'moment'
    import {map, get} from 'lodash'
    import {alternateLanding, cancelOpen} from './help'

    export default {
        name: "warning",
        data() {
            return {
                time: [new Date(moment(moment().startOf('days')).format('YYYY-MM-DD HH:mm:SS')),
                    new Date(moment().add(1, 'days').startOf('days').format('YYYY-MM-DD HH:mm:SS')),
                ]
                ,
                get,
                tableConfig: [],

                data: [],
                key: 'alternateLanding',
                cancelOpen: {
                    in: '单进',
                    out: '单出',
                    sucession: '连班',
                    total: '总数量',
                    departure: '备降起飞的',
                },

                alternateLanding: {
                    departure: '起飞',
                    total: '总架次',
                    out: '单出',
                },
            }
        },
		computed:{
            getLabel(){
                return (l)=>{
                    return this[this.key][l]
				}
			}
		},
        methods: {
            close() {
                this.time=[new Date(moment(moment().startOf('days')).format('YYYY-MM-DD HH:mm:SS')),
                    new Date(moment().add(1, 'days').startOf('days').format('YYYY-MM-DD HH:mm:SS')),
                ]
                this.$emit('resetTabTable')
            },
            open(key) {
                this.key = key
				let obj={
                    alternateLanding:alternateLanding,
                    cancelOpen:cancelOpen,
				}
                this.tableConfig =  obj[key]
                this.getList()
            },
            getList() {
                let key = this.key
                let typeObj = {
                    cancelOpen: 'runningState/Flight/getCancelFlight',
                    alternateLanding: 'runningState/flight/getAlternateOtherCityFlight',
                }
                let obj = {
                    startTime:moment( this.time[0]).format('YYYY-MM-DD HH:mm:SS'),
                    endTime: moment( this.time[1]).format('YYYY-MM-DD HH:mm:SS'),
                }
                // console.log(this.time,obj);
                this.$request.post('situation', typeObj[key], obj, true).then((res) => {
                    if (res.code == 200) {

                        this.data = res.data
                    } else {
                        this.$message.warning(res.message)
                    }
                })
            }

        },

    }
</script>

<style lang="scss" scoped>

	.el-date-editor {
		background: #2b3645!important;
		border: 0!important;
		padding: 0!important;
		width: 280px !important;
		::v-deep .el-range-separator{
			background: #2b3645!important;
		}
		::v-deep .el-range-input{
			background: #2b3645!important;
			width: 130px !important;
			font-family: FjallaOne!important;
		}
		::v-deep .el-input__icon ,
		::v-deep .el-icon-time{
			display: none;
		}
	}

	.box {
		width: 650px;
		background: #233147;
		span {
			color: #fff
		}
		.title {
			position: relative;
			display: flex;
			justify-content: space-between;
			padding: 7px 30px 0 15px;
			.titleLeft {
				font-size: 14px;
				display: flex;
				align-items: center;
				.shuxian {
					width: 4px;
					height: 14px;
					background: #0566ff;
					border-radius: 1px;
				}
				.text {
					margin: 0 12px 0 8px;
				}

			}
			.right {


			}
			.positionright {
				position: absolute;
				right: -8px;
				top: -8px;
				font-size: 24px;
			}
		}
		.content {
			padding: 10px 15px;
			overflow-y: auto;
			color: #fff;
			 height: 400px;

		}
	}	$border: 1px #565c67 solid;

	::v-deep .el-table{
		border: 0px !important;

	}
	::v-deep .el-table:before,
	::v-deep .el-table:after{
		display: none;

	}
	.el-table__header-wrapper{
 		th{

			background: #293756!important;
		}
	}
	::v-deep table {
 		border: 0 !important;
 		tr {
			border-top: $border;
			border-bottom: $border;
			th {

				 border-top: $border;
				border-bottom: $border !important;
				border-right: 0 !important;
				background: #293756 !important;
				font-weight: 400;
			}
			td {
				border-right: 0 !important;
				border-bottom: $border !important;
				background: #1e2e47 !important;
			}

		}
		tr:nth-child(even){
			td{
				background-color: #293756!important;

			}
		}
	}


</style>