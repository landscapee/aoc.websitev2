<template>
	<div class="box">
		<div class="title">
 			<div class="titleLeft" >
				<div class="shuxian"></div>
				<div class="text">{{text}} </div>
			</div>
			<span @click="close" class="positionright cursor  ">×</span>
		</div>
		<div class="content">
			<div class="echarts" ref="echarts"></div>
		</div>


	</div>
</template>
<script>
     import {map, get} from 'lodash'
    import {debounce} from '@/ui/lib/common.js'
     import * as echarts from 'echarts'
    export default {
        name: "warning",
		props:['options'],
        data() {
            return {
				text:'',
 				echartsInstance:null,
            }
        },
        watch:{
            options:{
                handler(n){
                    this.setOptions()
                },
                deep:true
            }
        },
        methods: {
            close() {
                 this.$emit('close',this.key)
            },
            open(key) {
                 this.key=key
                let obj = {
                    dataLineCB: '除冰趋势图',
                    dataLineLG: '离港速率变化曲线图',
                }
                this.$nextTick(()=>{
                    this.echartsInstance.resize();
                })
				this.text=obj[key]
            },
            setOptions( ) {
                if(this.echartsInstance&&this.options ){
                     this.echartsInstance.setOption(this.options)
                }
            },
            resizeEcharts(){
                let timer=debounce(()=>{
                    this.$nextTick(()=>{
                        this.echartsInstance.resize();
                    })
                },180)
                return timer
            },
        },
        mounted(){
            let echartsEle=this.$refs.echarts
             this.echartsInstance=echarts.init(echartsEle)
            this.setOptions()

            window.addEventListener('resize',this.resizeEcharts())

        },
        beforeDestroy(){
            this.echartsInstance.dispose()
            window.removeEventListener('resize',this.resizeEcharts())
        }

    }
</script>

<style lang="scss" scoped>



	.box {
		width: 810px;
		background: #25395c;
		border-radius: 4px;
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
				height: 30px;
				width: 30px;
				background: #9e9e9e;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: -8px;
				top: -8px;
				font-size: 24px;
				color: #25395c;
				border-radius: 100%;
			}
			.positionright:hover{
				background: #fff;
			}

		}
		.content {
			padding: 10px 15px;
			overflow-y: auto;
			color: #fff;
			 height: 400px;
			width: 100%;
			.echarts{
				width: 100%;
				height: 100%;
				::v-deep &>div{
					width: 100%!important;
					height: 100% !important;
				}
				&>div{
					width: 100%!important;
					height: 100% !important;
				}
			}
		}
	}




</style>