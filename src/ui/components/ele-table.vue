<template>
    <div class="eleTableBox" ref="ref_eleTableBox">
        <el-table ref="ref_table" :data="tableData" :style="{'width':tableWidth}" :height="maxHeight" :key="componentKey" border :row-class-name="setRowClassName">
            <el-table-column v-for="(col,idx) in columnConfig" :key="idx" :label="col.label" :width="col.width" :align="col.align?col.align:'center'">
                <template slot-scope="scope">
                    <template v-if="col.type=='index'">{{scope.$index+1}}</template>
                    <template v-else-if="col.type=='operate'">
                        <span v-for="(item,index) in col.operates" :key="index" class="tableButton" style="margin:0 5px;" :style="getStyle(item)" v-html="item.display(scope)" @click="item.click?item.click(scope):''"></span>
                    </template>
                    <template v-else>
                        <div v-if="col.display" v-html="col.display(scope)" :class="getClassname(col)" :style="getStyle(col)" @click="col.click?col.click(scope):''"></div>
                        <div v-else :class="getClassname(col)" :style="getStyle(col)" @click="col.click?col.click(scope):''">{{scope.row[col.key]}}</div>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>

<script>
export default {
    props: {
        columnConfig: {
            type: Array,
        },
        tableData: {
            type: Array,
            default: () => {
                return []
            },
        },
        setRowClassName: {
            type: Function,
        },
    },
    computed: {
        getClassname: function () {
            return (col) => {
                let name = ''
                if (col.type == 'button') {
                    name += ' tableButton'
                }
                return name
            }
        },
        getStyle: function () {
            return (col) => {
                let style = {}
                if (col.style) {
                    style = col.style
                }
                return style
            }
        },
    },
    data() {
        return {
            maxHeight: '100%',
            componentKey: 0,
            tableWidth: '100%',
        }
    },
    watch: {
        tableData: function () {
            this.$nextTick(function () {
                let refTable = this.$refs.ref_table.$el
                let boxheight = refTable.parentNode.clientHeight

                let tableheight = refTable.querySelector('.el-table__body').clientHeight
                this.componentKey++
                if (tableheight > boxheight) {
                    this.tableWidth = 'calc(100% + 8px)'
                }
            })
        },
    },
    mounted() {
        // this.maxHeight = this.$refs.ref_table.$el.parentNode.clientHeight
        // this.componentKey++
    },
    methods: {},
}
</script>
<style scoped lang="scss">
.eleTableBox {
    overflow: hidden;
    height: 100%;
}
</style>