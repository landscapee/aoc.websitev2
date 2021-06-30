<template>
    <div class="eleTableBox" ref="ref_eleTableBox">
         <el-table ref="ref_table" :span-method="spanMethod" :data="tableData" :style="{'width':tableWidth}" :height="maxHeight" :key="componentKey" border :row-class-name="setRowClassName">

            <el-table-column v-for="(col,idx) in columnConfig" :key="idx" :label="col.label" :width="col.width" :align="col.align?col.align:'center'">
                <template slot-scope="scope">
                    <template v-if="col.type=='index'">{{scope.$index+1}}</template>
                    <template v-else-if="col.type=='operate'">
                        <el-button type='text' v-for="(item,index) in col.operates" :key="index" class="tableButton" style="margin:0 5px;" :style="getStyle(item)" v-html="item.display(scope)" @click="item.click?item.click(scope):''" :disabled="col.click?col.disabled(scope):''"></el-button>
                    </template>
                    <template v-else>
                        <div v-if="col.input" :class="getClassname(col)" :style="getStyle(col)" @click="col.click?col.click(scope):''">
                            <el-input v-if="scope.row[col.inputShow]" v-model='scope.row[col.key]' size="mini" autofocus @change="inputChange(col,scope.row)" />
                            <span v-else>{{scope.row[col.key]}}</span>
                        </div>
                        <div v-else-if="col.display" v-html="col.display(scope)" :class="getClassname(col)" :style="getStyle(col)" @click="col.click?col.click(scope):''"></div>
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
        },
        setRowClassName: {
            type: Function,
        },
         // 合并行列
        spanMethod: {
            type: Function,
         },
        tableMaxHeight: {
            type: Number,
            default: 600,
        }
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
    mounted() {
        this.loadTableStyle()
    },
    watch: {
        tableData: function () {
            this.loadTableStyle()
        },
    },
    methods: {
        inputChange(col, row) {
            this.$emit('table-input-change', { col, row })
        },
        loadTableStyle() {
            this.$nextTick(function () {
                let refTable = this.$refs.ref_table.$el
                let boxheight = refTable.parentNode.clientHeight
                let tableheight = refTable.querySelector('.el-table__body').clientHeight
                if (tableheight > boxheight) {
                    this.tableWidth = 'calc(100% + 8px)'
                }
                if (this.tableMaxHeight > 0 && this.tableData.length * 40 > this.tableMaxHeight) {
                    this.maxHeight = this.tableMaxHeight
                    this.tableWidth = 'calc(100% + 8px)'
                }
                this.componentKey++
            })
        },
    },
}
</script>
<style scoped lang="scss">
.eleTableBox {
    overflow: hidden;
    height: 100%;
}
</style>