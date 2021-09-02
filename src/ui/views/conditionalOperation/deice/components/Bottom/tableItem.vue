<template>
	<div class="tabItem">
		<div class="title" :style="{background:data.bg}">
			<div class="left">
 				<span class="test" :style="{color:data.color}" >{{data.name}}({{tableData.data.length}})</span>
			</div>
			<div class="right">{{tableData.percentage}} %</div>
		</div>
		<div class="tableBox">
			<ele-table :columnConfig=" tableConfig"  :table-data="tableData.data">

 				<!--<el-table-column class="optionq" slot="arriveStandard" align="center"  width="140px">-->
					<!--<template  slot="header"  >-->
						<!--<div  >-->
							<!--<span  >预测落地结果</span>-->
							<!--<icon-svg class="cursor" @click.native="open('arriveStandard')" iconClass="bangzhu"></icon-svg>-->
						<!--</div>-->
					<!--</template>-->
					<!--<template   slot-scope="{row}" >-->
						<!--<span  > {{row.arriveStandard}}</span>-->
					<!--</template>-->
				<!--</el-table-column>-->
			</ele-table>

		</div>
	</div>
</template>

<script>
    export default {
        name: "tableItem",
        components: {},
		props:['data','tableData','tableConfig'],
        data() {
            return {

			}
        },
        methods: {},
        created() {
        },
    }
</script>

<style lang="scss" scoped>
.tabItem{
 	height: 100%;
	padding: 10px 10px 0 10px;
	.title{
		padding-bottom: 10px;
		display: flex;
		justify-content: space-between;
	}
	.tableBox{

		height: calc(100% - 30px);
	}
 }
</style>