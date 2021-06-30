<template>
	<div class="normalPlaceConfig">
		<div class="contentBox">
			<div class="title">
				<span></span>
				<span> 正常到位配置</span>
			</div>
			<ele-table :spanMethod="spanMethod" :columnConfig="tableConfig" :tableData="tableData"></ele-table>

		</div>
	</div>
</template>

<script>
    export default {
        name: "normalPlaceConfig",
        components: {},
        data() {
            return {
                tableData:[],
				tableConfig:[],
			}
        },
        methods: {
            spanMethod({ row, column, rowIndex, columnIndex }){
                if (columnIndex === 0) {
                    if ((rowIndex - row.oldCol) % row.col === 0) {
                        return {
                            rowspan: row.col,
                            colspan: 1
                        };
                    } else {
                        return [0,0]
                    }
                }
			}
		},
        created() {

        },
    }
</script>
<style lang="scss" scoped>
	.normalPlaceConfig{
		.contentBox{
			padding: 15px;
			background: #18243b;
			.title {
				position: relative;
				span {
					display: inline-block;
					vertical-align: middle;
					color: #fff;
					font-family: ALiB;
					font-size: 12px;
				}
				& > span:first-child {
					width: 4px;
					height: 12px;
					opacity: 1;
					background: #649fff;
					border-radius: 1px;
					margin: 0 5px 0 0px;
				}

			}
		}
	}

</style>