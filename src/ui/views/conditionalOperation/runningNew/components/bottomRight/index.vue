<template>
	<div class="bottomRightIndex">
		<div class="item" v-for="opt in pageObj" :key="opt.key">
			<div class="title">
				<div class="shuxian"></div>
				<div class="text">{{opt.name}}</div>
 			</div>
			<div class="content">
				<div ref="echarts"></div>
			</div>
		</div>
	</div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";
    let postalStore = new PostalStore();
    export default {
        name: "bottomRightIndex",
        components: {},
        data() {
            return {
                pageObj:[
					{name:'RVR趋势图',key:"11",data:[]},
					{name:'航班指标',key:"22",data:[]},
					{name:'垂直能见度趋势图',key:"33",data:[]},
					{name:'出港旅客数量指标',key:"44",data:[]},
					{name:'露点温度与温度趋势图',key:"55",data:[]},
					{name:'本场起降间隔指标',key:"66",data:[]},
				]
			}
        },
        methods: {},
        created() {
        },
    }
</script>

<style lang="scss" scoped>
	.bottomRightIndex{
		display: flex;
		flex-wrap:wrap;
		color: #fff;
		height: 100%;
	}
	.item:nth-child(1),
	.item:nth-child(2){
		margin-top: 0!important;
	}
	.item:nth-child(odd){
		margin-left: 0!important;
	}
		.item{
			background: rgba(25, 37, 60, 0.8);
			border-radius: 5px;
			padding: 10px 15px;
			width: calc(50% - 7px);
			height: calc(33.333333% - 9px);
			margin: 10px 0 0  14px ;
 			.title{
				font-size: 14px;
				display: flex;
				align-items: center;
				.shuxian{
					margin-right: 8px;
					width: 4px;
					height: 14px;
					background: #0566ff;
					border-radius: 1px;
				}



			}
		}
</style>