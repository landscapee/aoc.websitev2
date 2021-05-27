<template>
	<div class="fTableWrapper searchTableWrapper" ref="fTableWrapper" :style="{height:fTableWrapperHeight}">
		<el-table :data="data instanceof Array ? data : data.records||[]" ref="table" class="mainTable" :height="tableHeight"  :row-key="getRowKeys" @setCurrentRow="setCurrentRow" @current-change="currentRowChange" highlight-current-row @row-click="checkRow" @selection-change="handleSelectionChange" @select="selectCheckBox" @select-all="selectAllCheckBox" :header-row-class-name="tableheaderRowClassName" tooltip-effect="dark" :row-class-name="tableRowClassName" border>
			<template v-for="(colConfig, index1) in tableConfig">
				<el-table-column v-if="colConfig.components" :show-overflow-tooltip="true" v-bind="colConfig" :key="index1 + '1'">
					<template slot-scope="scope">
						<component v-for="(component, index) in colConfig.components" :key="index" :is="component.component" :componentProps="component.componentProps" v-bind="component.componentProps" :handleClick="component.handleClick" :colConfig="colConfig" :row="scope.row" :tableData="data instanceof Array ? data : data.records"> </component>
					</template>
				</el-table-column>
				<el-table-column v-else-if="colConfig.component" :show-overflow-tooltip="true" v-bind="colConfig" :key="index1 + '2'">
					<template slot-scope="scope" v-if="colConfig.component">
						<component :is="colConfig.component" :componentProps="colConfig.componentProps" v-bind="colConfig.componentProps" :handleClick="colConfig.handleClick" :colConfig="colConfig" :row="scope.row" :tableData="data instanceof Array ? data : data.records"> </component>
					</template>
				</el-table-column>
				<slot v-else-if="colConfig.slot" :name="colConfig.slot"></slot>
				<el-table-column type="index" v-else-if="colConfig.type==='index'" :show-overflow-tooltip="true" v-bind="colConfig" :key="index1 + '1'">
				</el-table-column>
				<el-table-column v-else-if="colConfig.type==='selection'" :show-overflow-tooltip="true" v-bind="colConfig" :key="index1 + '1'">
				</el-table-column>
				<el-table-column v-else :show-overflow-tooltip="true" v-bind="colConfig" :key="index1 + '3'" :reserve-selection="true">

					<span   slot-scope='{row}'> {{ row[colConfig.prop]||'--'}}</span>
				</el-table-column>
			</template>
		</el-table>
		<!--总条数大于21调才显示翻页-->
		<el-pagination background v-if="hideOnSinglePage"  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="data.current" :page-sizes="[data.size]" :page-size="data.size" layout="total,prev, pager, next, jumper" :total="data.total"> </el-pagination>
	</div>
</template>
<script>
import { cloneDeep } from 'lodash';
 export default {
	name: 'Ftable',
	props: ['tableConfig', 'data', 'height', 'offsetTop', 'page'],
	data() {
		return {
			tableHeight: 50,
			fTableWrapperHeight:'0px',
			hideOnSinglePage:false,
		};
	},
	watch: {
		data: function(newVal, oldVal) {
 			// 重新计算element表格组件布局
			setTimeout(() => {
				this.$refs.table.doLayout();
			}, 100);
		},
	},
	created() {

	},
	computed:{
		computeFtableHeight:function(){

		},
	},
	methods: {
		// 确定唯一的key值
		getRowKeys(row) {
			return row.id; // 每条数据的唯一识别值
		},
		handleSizeChange(size) {
			this.size = size;
			this.$emit('handleSizeChange', size);
		},
		handleCurrentChange(cur) {
			this.$emit('handleCurrentChange', cur);
		},
		tableheaderRowClassName({ row, rowIndex }) {
			return 'tab-header-row';
		},
		tableRowClassName({ row, rowIndex }) {
			row.index = rowIndex;
			return 'tab-row';
		},
		currentRowChange(row, oldRow) {
			this.$emit('currentRowChange', row, oldRow);
		},
		selectCheckBox(select, row) {
			this.$emit('selectCheckBox', cloneDeep(select), cloneDeep(row));
		},
		selectAllCheckBox(select) {
			this.$emit('selectAllCheckBox', cloneDeep(select));
		},
		checkRow(d, column, event) {
			this.selectData = d;
			this.$emit('listenToCheckedChange', cloneDeep(d), cloneDeep(column), cloneDeep(event));
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.$emit('listenToSelectionChange', val);
		},
		setCurrentRow(row) {
			this.$emit('setCurrentRow', cloneDeep(val));
		},
		getHeight(){
			let parentHeight=this.$refs.fTableWrapper.parentNode.offsetHeight;
			if(this.offsetTop===0||this.offsetTop){
				if(this.data.total&&this.data.size){ //总数和分页数有数据
					if(this.data.total/this.data.size>1){ //总页数大于1
					this.hideOnSinglePage=true;
						//有翻页在减48px
						this.tableHeight=(parentHeight-this.offsetTop-48)+'px';
						this.fTableWrapperHeight=parentHeight-this.offsetTop+'px';
					}else{
						this.fTableWrapperHeight=(parentHeight-this.offsetTop)+'px';
						this.tableHeight=this.fTableWrapperHeight;
					}
				}else{
					this.hideOnSinglePage=false;
					this.fTableWrapperHeight=(parentHeight-this.offsetTop)+'px';
					this.tableHeight=this.fTableWrapperHeight;
				}
			}else{
				this.hideOnSinglePage=false;
				this.fTableWrapperHeight='200px';
				this.tableHeight=this.fTableWrapperHeight;
			}

		},
		resize() {
	
		},
	},
	mounted() {
		this.$nextTick(function() {

			// this.resizeCallback.push(this.resize);
 			// this.getHeight();
		});
	},
	updated(){
		this.$nextTick(()=>{
			this.getHeight();
		})
	},
	beforeDestroy() {
		// this.resizeCallback.pop();
	},
};
</script>

<style lang="scss" scoped>
  .el-table--border::after,.el-table--group::after{
			width: 0 !important;
		}
  .el-table::before{
			height: 0!important;
		}
.searchTableWrapper {
	::-webkit-scrollbar {display: none !important }
	  .el-pagination {
		text-align: center;
		margin-top: 20px;
	}
	::v-deep .el-table {
 		border: none;
		margin: 0 auto;
		  .cell {
			padding: 0px;
			line-height: 40px;
			color: #ffffff;
			opacity: 0.8;
		}

		 td {
			width: 148px;
			height: 40px;
			text-align: center;
			padding: 0;
			border-color: #c7ccd2;
			border:none;
		}
		  th {
			border-color: #c7ccd2;
			border:none;
			padding: 0 5px;
		}
		  .el-table__row {
			height: 40px;
			cursor: pointer;
		}
		  .el-table__row:nth-child(even) {
			background: #45547c;
		}
		  .el-table__row:nth-child(odd) {
			background: rgba(84,136,255,0.05);
		}

	
	}
	::v-deep .mainTable {
		background: #0c1b2b;
			
		  .el-table__header {
			.tab-header-row {
				th {
					background: #243240;
					text-align: center;
 				}
				  .cell {
					font-weight: 600;
 				}
			}
		}
		 .el-table__body {
			border-bottom:1px solid #192735;
			 .current-row > td {
				background-color:  rgba(66,130,233,0.3) !important;
			}
			 tr{
				 border-left: 1px solid #45547c;
				 border-bottom: 1px solid #45547c;
			 }
			 tr.hover-row>td{
				background: rgba(66,130,233,0.3) !important;
				}
			 tr:hover>td{
				background: rgba(66,130,233,0.3) !important
			}	
			}
	}
}

</style>
