<template>
	<div class="middleRight">
		<div class="middleRightItem" :class="opt.key=='actionWaitingkey'?'item3':''" v-for="opt in pageObj" :key="opt.key+opt.keyC+opt.yName">
			<Item :isclick="opt.isclick" ref="item" :data="opt" @handleClick="handleClick" :optionsEC="getOptions(opt)" :key="opt.key+opt.keyC+opt.yName">
				<div :slot="opt.slot">
					总数：{{getTotal(opt)}}
					<el-select filterable @change="getActionWaiting" v-if="opt.key=='actionWaitingkey'" v-model="flightValue" size="mini">
						<el-option v-for="opt in selectList" :value="opt.name" :label="opt.value" :key="opt.name"></el-option>
					</el-select>
				</div>
			</Item>
		</div>
		<editEcharts ref="editEcharts"></editEcharts>
	</div>
</template>

<script>
    import Item from '../../../components/indicator/item'
    import {optionsPie, optionsDelay, optionsWait} from './options'
    import PostalStore from "@ui_lib/postalStore";
	import editEcharts from './editEcharts'
    let postalStore = new PostalStore();
    import {map,get} from 'lodash'

    export default {
        name: "middleRight",
        components: {Item,editEcharts},
        data() {
            return {
                selectList:[],
                flightData:[],
                flightValue:'ALL',
                passengerSts: {},
                flightDelay: {},
                actionWaitingkey: {},
                pageObj: [
                    {name: '旅客统计',isclick:'false', key: "passengerSts", keyC: 'AD_checkInCounters', options: optionsPie,},
                    {
                        name: '实时延误航班统计',
                        key: "flightDelay",
                        keyC: 'AD_checkInCounters',
                        options: optionsDelay,
                        slot: 'delay'
                    },
                    {
                        name: '关舱等待统计',
                        key: "actionWaitingkey",
                        keyC: 'AD_checkInCounters',
                        options: optionsWait,
                        slot: 'wait'
                    },
                ],
            }
        },
        computed: {
            getTotal(){
              return (opt)=>{
                  return get(this[opt.key], 'series.0.total','0')
			  }
			},
            getOptions() {
                return (opt) => {
                    if (opt.key == 'passengerSts') {
                        let data = [
                            {name: '值机人数', value: this.passengerSts.AD_checkInCounters},
                            {name: '安检人数', value: this.passengerSts.AD_securityCheckQty},
                            {name: '登机人数', value: this.passengerSts.AD_boardingCounters}
                        ]
                        return optionsPie(data) || {}
                    }
                    return opt.options(this[opt.key]) || {}

                }
            }
        },
        methods: {
            handleClick(key,params){
                // console.log(key,params);
                if(key=='flightDelay'){
					this.flightDelayClick(params.name)
				}else{
                    this.actionWaitingkeyClick(params.name)
				}
            },
            flightDelayClick(type){

                 let title='航班延误'+type
                this.$refs.editEcharts.open( title,'flightDelay',type)

			},
			actionWaitingkeyClick(type){
                let title='航班关舱等待'+type
                this.$refs.editEcharts.open( title,'actionWaitingkey',this.flightValue,type)
			},
			getActionWaiting(){
                let obj={
                    type: this.flightValue
                }
                this.$request.get('adverse', 'closeDoor/stat', obj, false).then((res) => {
                    this.actionWaitingkey=res.data
                })
			},
			getSelect(){
                this.$request.get('adverse', 'closeDoor/airlineList').then((res) => {
                    let data=res.data ||[]
                    if (!(data[0] && data[0].name === 'ALL')) {
                        data.unshift({ value: '全部', name: 'ALL' });
                    }
                    this.selectList= data
                })
			},
		},
        created() {
           this.getActionWaiting()
           this.getSelect()
        },
        mounted() {
            postalStore.sub('page.delayNew.data', ({data, key}) => {

                this[key] = data
            })
            postalStore.sub('page.delayNewMiddleRight.Data', ({data, key}) => {
                console.log(222222, data);
                this[key] = data
            })


        },
        beforeDestroy() {
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.middleRight {
		width: 100%;
		height: 100%;
		display: flex;
		color: #fff;
		.middleRightItem:nth-child(2) {
			margin: 0 12px;
		}
		.middleRightItem {
			padding: 12px;
			background: rgba(25, 37, 60, 0.8);
			width: calc(33.3333% - 8px);
			height: 100%;
			border-radius: 5px;

		}
		.item3{
			::v-deep .title{
				margin-top: -5px;
			}
		}

		::v-deep .el-select{
			width: 120px;
			margin-left: 3px;
 			.el-input__inner{
				height: 25px;
			}
		}
	}
</style>