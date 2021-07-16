<template>
	<div   style="height: 100%;">
 		<div class="title">
			<div class="shuxian"></div>
			<div class="text">{{data.name}}</div>
 		</div>
		<div class="content"  >
			<div class="echarts" ref="eCharts">  </div>
		</div>

	</div>
</template>

<script>

    import * as echarts from 'echarts'
    export default {
        name: "bottomRightIndex",
		props:{
            data:{
                type:Object,
				default:{},
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
                console.log(4444,this.echartsInstance,this.optionsEC,Object.keys(this.optionsEC).length);
                if(this.echartsInstance&&this.optionsEC&&Object.keys(this.optionsEC).length){
                    this.echartsInstance.setOption(this.optionsEC)
				}

            },
			aaa(){
                this.echartsInstance.resize();
			}
        },
        mounted() {
            let ele = this.$refs.eCharts
			this.echartsInstance = echarts.init(ele)
			this.setOptions()


        },
        created() {

        },
		beforeDestroy(){
            window.onresize=null
            this.echartsInstance.dispose()
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

</style>