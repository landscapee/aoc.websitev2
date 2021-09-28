<template>
    <div id="flight">
        <toolBar :statistics="statistics" :toggleFieldSetting="toggleFieldSetting" />
        <fieldSetting :refreshColumn="refreshColumn" :toggleFieldSetting="toggleFieldSetting" v-if="showFieldSetting" />
        <div id="flightWrapper" class="flightWrapper">
            <flightTable :setColumns="setColumns" :flights="flights" :columns="columns"></flightTable>
        </div>
        <TOBTTooltip v-if="getTOBTVisibility"></TOBTTooltip>
    </div>
</template>

<script>
import postal from 'postal'
import PostalStore from '../../lib/postalStore'
import _, { map, pick } from 'lodash'
import ColumnsDefine from './columnDefine'
import { mapGetters, mapState } from 'vuex'
import { memoryStore } from '@/worker/lib/memoryStore'
import { getListHeader } from '@/worker/lib/columns'
let postalStore = new PostalStore()
let itemH = 36
export default {
    data() {
        return {
            columns: [],
            flights: [],
            showFieldSetting: false,
            statistics: {},
        }
    },
    components: {
        toolBar: () => import(/*webpackChunkName:"com-toolBar"*/ './components/toolBar'),
        flightTable: () =>
            import(/*webpackChunkName:"com-flightTable"*/ './components/flightTable/flightTable'),
        'complex-column': () =>
            import(/*webpackChunkName:"complex-column"*/ './components/complexColumnDom'),
        fieldSetting: () => import(/*webpackChunkName:"fieldSetting"*/ './components/fieldSetting'),
        TOBTTooltip: () => import(/*webpackChunkName:"TOBTTooltip"*/ './components/TOBTTooltip'),
    },
    beforeMount() {
        // this.setColumns(getListHeader())
    },
    mounted() {
        // let globalHead = document.getElementById('com_glob_head');
        // globalHead && (globalHead.style.position = 'fixed')
        postalStore.sub('Flight.Sync', (data) => {
            this.flights = data.flights
            this.statistics = data.statistics
        })
        postalStore.sub('Flight.GetHeader.Res', (newColumns) => {
            memoryStore.setItem('global', { flightHeader: newColumns })
            this.setColumns(getListHeader())
        })
        let header = getListHeader()
        this.setColumns(header)
        postal.publish({
            channel: 'Worker',
            topic: 'Page.Flight.Start',
            data: _.map(header, (item) => {
                return _.pick(item, ['text', 'key', 'reference', 'referenceTo'])
            }),
        })

        // let header = getListHeader();
        // debugger;
        // postalStore.pub('Worker','Flight.UpdateHeader', header)
        // 获取延误分类options
        this.$request.get('situation', 'runningState/delayCode').then((res) => {
            this.$store.commit('flight/getAbnormalOptions', res.data)
            let optionsForSub = []
            let optionsForMain = []
            _.map(res.data, (item) => {
                optionsForMain.push(item)
                _.map(item.children, (child) => {
                    optionsForSub.push(child)
                })
            })
            this.$store.commit('flight/updateFlightRemoteOptions', {
                delaySubReason: optionsForSub,
                delayMainReason: optionsForMain,
            })
        })

        // 获取运营状态options
        this.$request.get('flight', 'Flight/status').then((res) => {
            if (res.code === 200) {
                this.$store.commit('flight/updateFlightRemoteOptions', { statusOptions: res.data })
            }
        })

      // 获取航班类型options
        this.$request.get('flight', 'Flight/type').then((res) => {
            if (res.code === 200) {
                this.$store.commit('flight/updateFlightRemoteOptions', { statusType: res.data })
            }
        })
    },
    beforeDestroy() {
        // let globalHead = document.getElementById('com_glob_head');
        // globalHead && (globalHead.style.position = 'relative')
        postal.publish({
            channel: 'Worker',
            topic: 'Page.Flight.Stop',
            data: '',
        })
        this.$store.commit('flight/toggleShowAdvance', false)

        postalStore.unsubAll()
    },
    methods: {
        setColumns: function (Columns) {
            let newColumns = _.map(Columns, (h) => {
                if (ColumnsDefine[h.key]) {
                    return _.extend({}, h, ColumnsDefine[h.key])
                } else {
                    return h
                }
            })
            this.columns = newColumns
            this.calcColumnWidth()
        },

        toggleFieldSetting: function () {
            this.showFieldSetting = !this.showFieldSetting
        },

        refreshColumn: function () {
            this.setColumns(getListHeader())
            this.calcColumnWidth(this.flights)
        },

        calcColumnWidth: function () {
            let oldC = this.columns
            _.map(oldC, (item) => {
                item.width = item.width || 90
            })
            this.columns = oldC
        },
    },
    watch: {
        flights(value) {
            this.calcColumnWidth(value)
        },
    },
    computed: {
        // ...mapGetters(['flight/getTOBTVisibility']),
        ...mapState({
            getTOBTVisibility: (state) => state.flight.showTOBTToolTip,
        }),
        // totalHeight: function(){
        //   let heightOfPx = (this.flights.length + 1) * itemH // 头部原因加1
        //   return heightOfPx / 100
        // },
    },
}
</script>

<style lang="scss">
#flight {
    //padding-left: 15px;
    background: #111926;
}
.flightWrapper {
    //height: calc(100% - 50px);
    position: relative;
    background: #111926;
}
.TOBTTooltip {
    width: 301px;
    height: 240px;
    opacity: 1;
    background: #25395c;
    border-radius: 5px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 10;
    padding: 15px;
    color: #fff;
    .tableContainer {
        display: flex;
        align-items: center;
        margin-top: 15px;
        flex-direction: column;
        .tableRow {
            width: 260px;
            height: 36px;
            opacity: 1;
            background: #293756;
            border: 1px solid #45547c;
            display: flex;
            flex-wrap: wrap;
        }
        .contentTableRow {
            background-color: #1d2840;
            border-top: 0;
        }
        .tableItem {
            text-align: center;
            height: 36px;
            line-height: 36px;
            flex: 1;
            border-right: 1px solid #45547c;
        }
        .tabletTitle {
            font-weight: bold;
        }
        //.border-right{
        //    border-right: 1px solid #45547c;
        //}
    }
    .inputRow {
        display: flex;
        justify-content: flex-end;
        .label {
            width: 40px;
            display: inline-block;
            margin-right: 8px;
            margin-top: 12px;
        }
        .default-input {
            width: 214px;
            background-color: #0c172a !important;
        }
    }
    .buttonBox {
        margin-top: 10px;
        text-align: center;
        .btn-small {
            width: 87px !important;
            height: 24px !important;
            line-height: 24px;
            padding: 0;
            font-size: 14px;
            &:first-of-type {
                margin-right: 10px;
            }
        }
    }
}
</style>
