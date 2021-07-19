<template>
    <div class="flightDecreaseLists showBox">
        <div class="title">
            <ul>
                <li v-for="(nav,idx) in navLists" :key="idx" :class="navFalg==idx?'active':''" @click="navHandle(idx)">{{nav.name}}({{nav.count}})</li>
            </ul>
            <div class="right">
                <div class="allBoxBtn" @click="allBoxBtnHandle">{{showAllFlights?'条件内航班':'查看全部航班'}}</div>
                <el-input placeholder="请输入航班号" style="width:130px" size="mini" v-model="flightNoStr" @change="search">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
                <div class="div1">
                    <div></div>
                    调减
                </div>
                <div class="div2">
                    <div></div>
                    调整
                </div>
            </div>
        </div>
        <div class="tableBox">
            <ele-table :columnConfig="columnConfig" :tableData="tableData" :setRowClassName="setRowClassName"></ele-table>
        </div>
    </div>
</template>
<script>
import { flightDecreaseListsColumnConfig } from '../config'
export default {
    props: ['flights', 'statistics', 'currentPlan'],
    data() {
        return {
            navLists: [
                { name: '全部', count: 0, movement: '' },
                { name: '进港', count: 0, movement: 'A' },
                { name: '出港', count: 0, movement: 'D' },
            ],
            navFalg: 0,
            columnConfig: [],
            tableData: [],
            flightNoStr: '',
            showAllFlights: false,
        }
    },
    watch: {
        statistics: function (val) {
            this.navLists[0].count = val.total
            this.navLists[1].count = val.movementA
            this.navLists[2].count = val.movementD
        },
        flights: function (val) {
            this.navHandle(this.navFalg)
        },
    },
    mounted() {
        this.columnConfig = flightDecreaseListsColumnConfig
    },
    methods: {
        allBoxBtnHandle() {
            this.showAllFlights = !this.showAllFlights
            this.search()
        },
        navHandle(idx) {
            this.navFalg = idx

            this.tableData = _.filter(this.flights, (item) => {
                return this.navLists[this.navFalg].movement
                    ? item.movement == this.navLists[this.navFalg].movement
                    : true
            })
        },
        setRowClassName({ row }) {
            if (row.level === 'reduce') {
                return 'reduce'
            }
            if (row.level === 'exchange') {
                return 'exchange'
            }
        },
        search() {
            this.$emit('filter-change', {
                showAllFlights: this.showAllFlights,
                flightNo: this.flightNoStr,
            })
            // this.tableData = []
            // let movement = this.navLists[this.navFalg].movement

            // let arrs = _.filter(this.flights, (item) => {
            //     let movementBul = movement ? item.movement == movement : true
            //     let flightNoStr = this.flightNoStr
            //         ? _.includes(item.flightNo, this.flightNoStr)
            //         : true

            //     return movementBul && flightNoStr
            // })
            // this.tableData = arrs
        },
    },
}
</script>
<style lang="scss" scoped>
.flightDecreaseLists {
    color: #fff;
    height: 100%;
    .title {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        ul {
            height: 30px;
            li {
                background: rgba(115, 134, 167, 0.15);
                border-radius: 17px;
                cursor: pointer;
                color: #fff;
                padding: 0 15px;
                line-height: 30px;
                display: inline-block;
                margin-right: 12px;
            }
            li.active {
                background: #4181e9;
            }
        }
        .right {
            display: flex;
            height: 30px;
            align-items: center;
            .allBoxBtn {
                color: #17a2b8;
                border: 1px solid #17a2b8;
                height: 100%;
                padding: 0 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 15px;
                cursor: pointer;
            }
            .allBoxBtn:hover {
                background: #17a2b8;
                color: #fff;
            }
            .div1 {
                margin: 0 10px;
                display: flex;
                div {
                    width: 14px;
                    height: 14px;
                    opacity: 1;
                    background: #2c3f6d;
                    margin-right: 5px;
                }
            }
            .div2 {
                display: flex;
                div {
                    width: 14px;
                    height: 14px;
                    opacity: 1;
                    background: #194955;
                    margin-right: 5px;
                }
            }
        }
    }
    .tableBox {
        height: calc(100% - 40px);
        margin-top: 10px;
    }
}
</style>
<style lang="scss">
.reduce {
    td {
        background-color: #2c3f6d !important;
    }
}
.exchange {
    td {
        background-color: #194955 !important;
    }
}
</style>