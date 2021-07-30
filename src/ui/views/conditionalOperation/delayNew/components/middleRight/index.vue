<template>
	<div class="middleRight">
		<div class="middleRightItem" v-for="opt in pageObj" :key="opt.key+opt.keyC+opt.yName">
			<Item ref="item" :data="opt" :optionsEC="getOptions(opt)" :key="opt.key+opt.keyC"></Item>
		</div>
	</div>
</template>

<script>
	import Item from '../../../components/indicator/item'
    import {optionsPie} from './options'
    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";
    let postalStore = new PostalStore();
     import {map} from 'lodash'
    export default {
        name: "middleRight",
        components: {Item},
        data() {
            return {
                passengerSts:{},
                pageObj: [
                    {name: '旅客统计', key: "passengerSts", keyC: 'AD_checkInCounters',options:optionsPie, yName: '数量(架次)'},
                    {name: '实时延误航班统计', key: "passengerSts", keyC: 'AD_checkInCounters',options:optionsPie, yName: '数量(人数)'},
                    {name: '关舱等待统计', key: "passengerSts", keyC: 'AD_checkInCounters',options:optionsPie, yName: '分钟'},
                ],
			}
        },
		computed:{
            getOptions() {
                return (opt) => {

                    let data=[
                        { name: '值机人数', value: this.passengerSts.AD_checkInCounters },
                        { name: '安检人数', value: this.passengerSts.AD_securityCheckQty },
                        { name: '登机人数', value: this.passengerSts.AD_boardingCounters }
                    ]
                    if(opt.keyC=='AD_checkInCounters'){
                        let data=[
                            { name: '值机人数', value: this.passengerSts.AD_checkInCounters },
							{ name: '安检人数', value: this.passengerSts.AD_securityCheckQty },
							{ name: '登机人数', value: this.passengerSts.AD_boardingCounters }
							]
                        return optionsPie(data) || {}
					}
                    return optionsPie(data) || {}

                }
            }
		},
        methods: {},
        created() {
        },
        mounted() {
            postalStore.sub('page.delayNew.data', ({data, key}) => {
                console.log(222222,data);
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
		.middleRightItem:nth-child(2){
			margin: 0 12px;
		}
 		.middleRightItem{
			padding:   12px;
			 background: rgba(25, 37, 60, 0.8);
			width: calc(33.3333% - 8px);
			height: 100%;
			border-radius: 5px;
		}
	}
</style>