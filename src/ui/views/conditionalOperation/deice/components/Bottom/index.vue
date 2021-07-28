<template>
	<div class="BottomIndex">
		<div class="item" v-for="opt in pageObj" :key="opt.key">
			<BottomItem :data="opt"  :tableDataObj="getTableData(opt.key)"></BottomItem>
		</div>
	</div>
</template>

<script>
    import PostalStore from '@ui_lib/postalStore'
	import {groupBy,map} from 'lodash'
    let postalStore = new PostalStore()
    import BottomItem from './bottomItem'
    export default {
        name: "BottomIndex",
        components: {BottomItem},
        data() {
            return {
                // '3U': '川航', CA: '国航', DF: '地服',
                deiceFlights:{}, //所有数据
				pageObj:[
					{name:'川航除冰统计',key:'3U',bg:'rgba(50, 128, 231, 0.2)'},
					{name:'国航除冰统计',key:'CA',bg:'rgba(0, 217, 105, 0.2)'},
					{name:'地服除冰统计',key:'DF',bg:'rgba(153, 100, 255, 0.2)'},
				]
			}
        },
		computed:{
            getTableData(){
                return (key)=>{
                    // console.log(this.deiceFlights,this.deiceFlights[key]);
                    let data=this.deiceFlights[key]||[]
                    let allLen=data.length
                    let flights = groupBy(data, 'deiceStatus');
                    let needDeice = flights[0] || [];
                     let needDeiceRate = this.getRate(needDeice.length,allLen);
                    let deice = flights[1] || [];
                     let deiceRate = this.getRate(deice.length,allLen);
                    let finish = flights[2] || [];
                     let finishRate = this.getRate(finish.length,allLen);
                    let obj= {
                        dataLength:allLen,
                        doing:{
                            percentage:deiceRate,
							data:deice,
						},
						need:{
                            percentage:needDeiceRate,
							data:needDeice,
						},
						finish:{
                            percentage:finishRate,
							data:finish,
						},
					}
                    // console.log(22,obj);
                    return obj
				}
			}
		},
        methods: {

            getRate (len, allLen)  {
                return !len? 0 : parseInt((len / allLen) * 100);
            },
		},
        created() {
        },
        mounted() {
            postalStore.sub('Page.deiceBottom', ({data, key}) => {
                // console.log(111, data);
                this[key] = data
            })
        },
        beforeDestroy() {
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.BottomIndex{

		width: 100%;
		height: 100%;
		display: flex;
		.item{
 			width: 33.3333%;
			margin-left: 15px;
			flex: 1 1 auto;
		}
		.item:nth-child(1){
			margin-left: 0;
		}
	}

</style>