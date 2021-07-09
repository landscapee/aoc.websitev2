<template>

	<div class="echarts" ref="eCharts">

	</div>

</template>

<script>
    import * as echarts from 'echarts'
    import {barOptions} from './options'
    import { map } from 'lodash'

    export default {
        name: "echarts",
        props: ['data'],
        components: {},
        data() {
            return {
                echartsInstance: null,
                options: null,
            }
        },
        computed: {
            getData() {
                return this.data
            }
        },
        watch: {
            data: {
                handler(n) {
                    if (n && Object.keys(n).length) {

                        let xData = map(n.flights, (item, index) => {
                            return `${item}\n\n${n.seats[index]}`;
                        });
                        let waitTimes = map(n.waitTimes, (item) => {
                            if (item > 100) {
                                return {
                                    value: item,
                                    itemStyle: {
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [
                                                {
                                                    offset: 0,
                                                    color: '#ff7172',
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#c55555',
                                                },
                                            ],
                                        },
                                    },
                                };
                            }
                            return item;
                        });
                        let yData = [{name: '已延误航班统计', data: waitTimes}];
                        let unit = '等待时长/min';
                        this.options = barOptions(xData, yData, unit)
                        if (this.echartsInstance) {
                            this.setOptions(this.options)
                        }
                    }
                },
                deep: true,
                immediate: true,
            }

        },
        methods: {
            setOptions(options) {
                this.echartsInstance.setOption(options)
            },
        },
        created() {
        },
        mounted() {

            let ele = this.$refs.eCharts
            this.echartsInstance = echarts.init(ele)
            if (this.options) {
                this.setOptions(this.options)
            }
            console.log(' ele', ele);
        },
    }
</script>

<style lang="scss" scoped>
	.echarts {
		margin-top: 15px;
		height: calc(100% - 15px);
		width: 100%;
	}
</style>