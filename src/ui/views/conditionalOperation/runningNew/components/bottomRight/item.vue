<template>
	<div class="bottomRightIndex">
		<div class="item" v-for="opt in pageObj" :key="opt.key+opt.keyC">
			<Item ref="item"  :data="opt" :optionsEC="getOptions(opt)" :key="opt.key+opt.keyC"></Item>
		</div>
	</div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";
    import { optionsWeather}from './options'
    let postalStore = new PostalStore();
    import Item from '../../../components/indicator/item'
    import {map} from 'lodash'
    export default {
        name: "bottomRightIndex",
        components: {Item},
        computed: {
            getOptions(){
                return (opt)=>{
                    let arr=this.runwayWeather[opt.keyC]
                    if(!arr){
                        arr=[	 [], { name: '航班指标', data: [0] },]
                    }
                    return  optionsWeather(...arr,opt.yName)||{}

                }
            }
        },
        data() {
            return {
                runwayWeather: {},
                pageObj: [
                    {name: 'RVR趋势图', key: "runwayWeather",keyC:'rvr', yName:'m'},
                    // {name: '航班指标', key: "indicator", keyC:'flightIndicator', yName:'数量(架次)' },
                    {name: '垂直能见度趋势图', key: "runwayWeather", keyC:'vv', yName:'℃'},
                    // {name: '出港旅客数量指标', key: "indicator", keyC:'passengerIndicator', yName:'数量(人数)' },
                    {name: '露点温度与温度趋势图', key: "runwayWeather" ,keyC:'temp', yName:'℃'},
                    // {name: '本场起降间隔指标', key: "indicator",keyC:'spaceIndicator' , yName:'分钟'},
                ]
            }
        },
        methods: {

        },
        created() {

        },
        mounted() {

            postalStore.sub('runwayWeather', ({data, key}) => {
                this.runwayWeather = data
            })

        },

        beforeDestroy() {
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.bottomRightIndex {
		display: flex;
		color: #fff;
		width: 100%;
		height: 100%;
	}

	.item:nth-child(1) {
		margin-top: 0 !important;
	}

	.item {
		background: rgba(25, 37, 60, 0.8);
		border-radius: 5px;
		padding: 10px 15px;
		width: 100%;
		height: calc(33.333333% - 9px);
		margin-top: 10px ;
		.title {
			font-size: 14px;
			font-family: MicrosoftYaHei-Bold;
			display: flex;
			align-items: center;
			.shuxian {
				margin-right: 8px;
				width: 4px;
				height: 14px;
				background: #0566ff;
				border-radius: 1px;
			}

		}
	}
</style>