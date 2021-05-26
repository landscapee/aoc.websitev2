<template>
	<div class="runMonitoringIndex">
		<div class="listMonitor">
			<el-dropdown class="positionDropdown" trigger="click" :hide-on-click="false">
      			<span class="el-dropdown-link">
        			<i class="el-icon-setting el-icon--right"></i>自定义
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item   v-for="(opt,index) in pageList" :key="index">
						<el-checkbox v-model="opt.show" :label="opt.name"></el-checkbox>

					</el-dropdown-item>

				</el-dropdown-menu>
			</el-dropdown>
			<div class="itemMonitor" v-if="opt.show" v-for="(opt,index) in pageList" :key="index">
				<div class="itemTitle">
					<div>{{opt.name}}（{{(opt.data||[]).length}}）</div>
					<div @click="openSetting(opt)">
						<i class="el-icon-setting"></i>
					</div>

				</div>
				<Ftable :data="opt.data" :tableConfig="opt.tableConfig" ></Ftable>
			</div>
		</div>
		<Setting ref="Setting"></Setting>
	</div>
</template>

<script>
	import Setting from "./setting"
	import Ftable from "@components/Ftable/index"
    export default {
        name: "runMonitoringIndex",
        components: {Setting,Ftable},
        data() {
            return {
                pageList: [
                    {name: '批量航班关注池', data: [{name:'ddd',xx:'qqq'},{name:'ddd',xx:'qqq'},{name:'ddd',xx:'qqq'}], show: true, tableConfig: [{prop: 'name', label: '证书名称', align: 'center',},{prop: 'xx', label: '证书名称', align: 'center',}]},
                    {name: '提前落地航班', data: [], show: true, tableConfig: []},
                    {name: '地面保障告警池', data: [], show: true, tableConfig: []},
                    {name: '要客航班池', data: [], show: true, tableConfig: []},
                ],

            }
        },
		created() {
        },
        methods: {
            openSetting({name}){
              this.$refs.Setting.open({name})
			},
		},

    }
</script>

<style lang="scss" scoped>
	.runMonitoringIndex {
		position: relative;
		 ::v-deep .el-dropdown-menu{
			  .el-dropdown-menu__item{
				border-bottom: 1px red solid!important;
			}
		}
		.positionDropdown{
			cursor: pointer;
			color:#fff;
			position: absolute;
			right:20px;
			top:2px;
			background: linear-gradient(90deg,#4b8efd 0,#3fb3ff 100%);
			box-shadow: 0 0 0.25rem #4b4b4b;
			padding: 5px 6px;
			.el-icon-setting{
				margin-right:5px;
			}

		}
		.listMonitor {
			padding: 15px;
			color: #fff;
			display: flex;
			justify-content: left;
			flex-wrap: wrap;
			.itemMonitor {
				height: calc(50vh - 39px);
 				width: 33.333333%;
				padding: 5px;
				.itemTitle {
					width: 100%;
					height: 37px;
					line-height: 37px;
					border-radius: 6px 6px 0 0;
					background: #234479;
					display: flex;
					padding: 0 15px;
					justify-content: space-between;
				}
			}
		}
	}
</style>