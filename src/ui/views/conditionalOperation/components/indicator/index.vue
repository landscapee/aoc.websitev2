<template>
	<div class="bottomRightIndex">
		<div class="item" v-for="opt in pageObj" :key="opt.key+opt.keyC">
			<Item ref="item" :data="opt" :optionsEC="getOptions(opt)" :key="opt.key+opt.keyC"></Item>
		</div>
	</div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";
    import {optionsIndicator} from './options'

    let postalStore = new PostalStore();
    import Item from './item'
    import {map} from 'lodash'

    export default {
        name: "bottomRightIndex",
        components: {Item},
        computed: {
            getOptions() {
                return (opt) => {
                    let arr = this[opt.key][opt.keyC]
                    if (!arr) {
                        arr = [[], {name: '航班指标', data: [0]},]
                    }
                    return optionsIndicator(...arr, opt.yName) || {}

                }
            }
        },
        data() {
            return {
                indicator: {},
                pageObj: [
                    {name: '航班指标', key: "indicator", keyC: 'flightIndicator', yName: '数量(架次)'},
                    {name: '出港旅客数量指标', key: "indicator", keyC: 'passengerIndicator', yName: '数量(人数)'},
                    {name: '本场起降间隔指标', key: "indicator", keyC: 'spaceIndicator', yName: '分钟'},
                ],
            }
        },
        methods: {},
        created() {

        },
        mounted() {

            postalStore.sub('push.indicator.Data', ({data, key}) => {
                this.indicator = data
            })
            postal.publish({
                channel: 'Worker',
                topic: 'Get.indicator.Data',

            });

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
		flex-wrap: wrap;
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
		margin-top: 10px;

	}
</style>