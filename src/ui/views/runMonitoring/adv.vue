<!--
 * @Descripttion:
 * @version:
 * @Author: xdh.ss
 * @Date: 2020-05-13 09:50:30
 * @LastEditors: xdh.ss
 * @LastEditTime: 2020-05-13 17:38:44
 -->
<template>
	<div class="about">
		<AdvTable  :columnConfig="columnConfig" :tab-data="tabData" :pagination="pagination" @viewsRow="viewsRow" @submit="submit">
			<template slot="danjia" slot-scope="{row,index}" >
				<div  > 11-{{index}}</div>

			</template>
		</AdvTable>
	</div>
</template>
<script>
	import AdvTable from '@/ui/components/advTable';
    export default {
        components:{AdvTable},
        data(){
            return {
                // width太宽会被隐藏   宽度不够按比例分配
                columnConfig: [
                    {key: 'ind', label: '序号', width: '40px', type: 'index'},
                    {key: 'waybillCode', label: '运单号', width: '200px', type: 'simple'},
                    {key: 'danjia', label: '运单号1',  type: 'slot',width:'200px'},
                    {key: 'des', label: '目的地', width: '200px', type: 'simple'},
                    {key: 'number', label: '件数', width: '70px', type: 'simple'},
                    {key: 'weight', label: '重量', width: '70px', type: 'simple'},
                    {key: 'specialCode', label: '特货代码', width: '100px', type: 'simple'},
                    {
                        key: 'flightDate', label: '航班日期', width: '200px', type: 'simple',
                        // display: r => Dictionary.formatDateTime(r.flightDate, 'YYYY-MM-DD HH:mm')
                    },
                    {
                        key: 'remark', label: '备注', width: '100px', type: 'edit',
                        editConfig: {
                            type: 'input',
                            switch: r => {
                                return true;
                            }
                        }
                    },
                    {
                        key: '', label: '操作', width: '200px', type: 'operate',
                        operates: [
                            {
                                type: 'button', value: '确认到达',
                                display: r => r.arrive ? '已到达' : '确认到达',
                                disabled: r => r.arrive ? true : false,
                                event: 'submit'
                            },
                            {
                                type: 'button', value: '查看', event: 'viewsRow'
                            }
                        ]
                    }
                ],
                tabData: [
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                    { waybillCode: '217-00000000', des: 'bkk', number: 5, weight: 10, specialCode: 'RLI', flightDate: 1589341428610, remark: '' },
                ],
                pagination: {
                    page: 1,
                    size: 20,
                    map: [20, 50, 80],
                    total: 0,
                    layout: 'total, sizes, prev, pager, next, jumper'
                }
            }
        },
        beforeMount () {},
        mounted(){
            // this.$store.dispatch('setTabColumns', intelligenceManageTable);
        },
        methods: {
            viewsRow(row){
                alert(row.row.waybillCode)
            },
            submit(row){
                alert('运单号 ' + row.row.waybillCode + ' 提交成功')
            }
        },
    }
</script>
<style lang="scss" scoped>
	.about{
		position: relative;
		height: 300px!important;
		width: 300px!important;
		.adv-table-container {
			width: 100%;
		}
	}
</style>
