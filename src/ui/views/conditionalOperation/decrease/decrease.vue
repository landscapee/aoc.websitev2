<template>
    <div id="decrease">
        <div class="decrease_left">
            <setting />
            <recommend />
        </div>
        <div class="decrease_mid">
            <MDRS-warning />
            <flight-decrease />
            <flight-delay />
        </div>
        <div class="decrease_right">
            <sure-decrease />
        </div>

    </div>
</template>

<script>
import Setting from './components/setting.vue'
import Recommend from './components/recommend.vue'
import MDRSWarning from './components/MDRSWarning.vue'
import FlightDecrease from './components/flightDecrease.vue'
import FlightDelay from './components/flightDelay.vue'
import SureDecrease from './components/sureDecrease.vue'
export default {
    components: {
        setting: Setting,
        recommend: Recommend,
        'MDRS-warning': MDRSWarning,
        'flight-decrease': FlightDecrease,
        'flight-delay': FlightDelay,
        'sure-decrease': SureDecrease,
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
    display: flex;
    .decrease_left {
        width: 520px;
        display: flex;
        flex-direction: column;
    }
    .decrease_mid {
        display: flex;
        flex-direction: column;
        width: 930px;
        margin: 0 15px;
    }
    .decrease_right {
        display: flex;
        flex-direction: column;
        width: 360px;
        flex: 1;
    }
    .showBox {
        background: rgba(25, 37, 60, 0.8);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }
}
</style>