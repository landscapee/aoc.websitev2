<template>
    <div id="decrease">
        <!-- <div class="tableBox">
            <ele-table :columnConfig="columnConfig" :tableData="tableData"></ele-table>
        </div> -->
        <setting />

    </div>
</template>

<script>
import Setting from './components/setting.vue'
export default {
    components: {
        setting: Setting,
    },
    data() {
        return {
            columnConfig: [
                { key: 'ind', label: '序号', type: 'index', align: 'center' },
                {
                    key: 'waybillCode',
                    label: '运单号',
                    type: 'simple',
                    align: 'right',
                    title: true,
                    // color: 'red',
                    style: { color: 'red' },
                    display: ({ row }) => {
                        return row.arrive ? '已到达' : '<span>确认到达</span>'
                    },
                },
                {
                    key: 'waybillCode',
                    label: '运单号',
                    type: 'simple',
                    display: () => {
                        return '<i class="iconfont icon-feijia"></i>'
                    },
                },
                {
                    key: 'waybillCode',
                    label: '运单号',
                    type: 'button',
                    align: 'left',
                    display: () => {
                        return '<i class="iconfont icon-feijia"></i>'
                    },
                    click: ({ row }) => {
                        this.logg(row)
                    },
                },
                {
                    key: 'number',
                    label: '备注',
                    type: 'simple',
                    editConfig: {
                        type: 'input',
                        switch: (r) => {
                            return true
                        },
                    },
                },
                {
                    key: '',
                    label: '操作',
                    width: '200px',
                    type: 'operate',
                    operates: [
                        {
                            style: { color: 'red' },
                            display: () => {
                                return '已到达'
                            },
                            click: ({ row }) => {
                                this.logg(row)
                            },
                        },
                        {
                            style: { color: '#0566ff' },
                            display: () => {
                                return '<i class="iconfont icon-feijia"></i>'
                            },
                            click: ({ row }) => {
                                console.log(row)
                            },
                        },
                    ],
                },
            ],
            tableData: [
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
                {
                    waybillCode: '217-00000000',
                    des: 'bkk',
                    number: 5,
                    weight: 10,
                    specialCode: 'RLI',
                    flightDate: 1589341428610,
                    remark: '',
                },
            ],
        }
    },
    mounted() {},
    methods: {
        logg(row) {
            console.log(row)
        },
    },
}
</script>
<style scoped lang="scss">
#decrease {
    position: relative;
    & > div {
        background: rgba(25, 37, 60, 0.8);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        position: absolute;
    }
}
</style>