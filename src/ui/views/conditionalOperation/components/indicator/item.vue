<template>
	<div   style="height: 100%;">
 		<div class="title">
			<div class="shuxian"></div>
			<div class="text">
				{{data.name}}
				<slot :name="data.slot"></slot>
			</div>
 		</div>
		<div class="content"  >
			<div class="echarts" ref="eCharts">  </div>
		</div>

	</div>
</template>

<script>
    import {debounce} from '@/ui/lib/common.js'

    import * as echarts from 'echarts'
    export default {
        name: "bottomRightIndex",
		props:{
            data:{
                type:Object,
				default:{},
			},
			isclick:{
                type:String,
			},
            optionsEC:{
                type:Object,
				default:{},
			},

		},
        components: {},
         watch:{
             optionsEC:{
                 handler(n){
                     this.setOptions()
				 },
				 deep:true
			 }
		 },
        data() {
            return {
                echartsInstance:null,
            }
        },
        methods: {
            setOptions( ) {
                 if(this.echartsInstance&&this.optionsEC&&Object.keys(this.optionsEC).length){
                      this.echartsInstance.setOption(this.optionsEC)
				}

            },
            resizeEcharts(){
                this.$nextTick(()=>{
                    this.echartsInstance.resize();
				})
			}
        },
        mounted() {
            let ele = this.$refs.eCharts
			this.echartsInstance = echarts.init(ele)
			this.setOptions()
			window.addEventListener('resize',this.resizeEcharts)
			this.resizeEcharts()
           this.isclick!=='false'&& this.echartsInstance.on('click', (params) => {
                this.$emit('handleClick',this.data.key,params)
             });
        },
        created() {

        },
		beforeDestroy(){
             this.echartsInstance.dispose()
            window.removeEventListener('resize',this.resizeEcharts)
		}

    }
</script>

<style lang="scss" scoped>
.content{
	/*margin-top: 10px;*/
 	height: calc(100% - 15px);
	width: 100%;
	.echarts {
		width: 100%;
		height: calc(100% -  5px);
  	}

}
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
	.text{
		width: calc(100% - 12px);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

}

</style>