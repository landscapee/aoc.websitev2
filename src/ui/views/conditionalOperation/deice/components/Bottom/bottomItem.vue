<template>
	<div class="bottomItem">
		<div class="title" :style="{background:data.bg}">
			<div class="left">
				<span class="shuxian"></span>
				<span class="test">{{data.name}}</span>
			</div>
			<div class="right">总数：{{tableDataObj.dataLength}}</div>
		</div>
		<div class="tableItemBox" v-for="opt in pageObj" :key="opt.key">

			<TableItem :data="opt" :key="opt.key" :table-data="tableDataObj[opt.key]" :table-config="opt.config"></TableItem>
		</div>
	</div>
</template>

<script>
    import TableItem from './tableItem'
    import {finishConfig,deiceConfig,needDeiceConfig}from './help'

    export default {
        name: "bottomItem",
        components: {TableItem},
		props:['data','tableDataObj'],
        data() {
            return {
                pageObj: [
                    {name: '待除冰', key: 'need', color: '#4181e9',config:needDeiceConfig},
                    {name: '正在除冰', key: 'doing', color: '#00d969',config:deiceConfig},
                    {name: '已完成除冰', key: 'finish', color: '#ffffff',config:finishConfig},
                ]

            }
        },

        methods: {},
        created() {
        },
    }
</script>

<style lang="scss" scoped>
	*{
		color: #fff;
	}
	.bottomItem {
		height: 100%;
		width: 100%;
		border-radius: 5px ;
		background: #19253c;
		.title{
			border-radius: 5px 5px 0 0;
			padding: 10px 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left{
				display: flex;
				align-items: center;
				.shuxian{
					margin-right: 8px;
					display: inline-block;
					width: 4px;
					height: 16px;
 					background: #0566ff;
					border-radius: 1px;
				}
				.text{
					font-family: AlibabaPuHuiTiB;
				}
			}
		}
		.tableItemBox{
			height: calc(33.3333% - 12px);
			width: 100%;
			display: flex;
			flex-direction: column;

		}
	}
</style>