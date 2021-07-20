<template>
    <div class="eleTableBox" ref="ref_eleTableBox">
        <el-table ref="ref_table" :span-method="spanMethod" :data="tableData" :style="{'width':tableWidth}" :height="maxHeight" :key="componentKey" border :row-class-name="setRowClassName">

            <template v-for="(col,idx) in columnConfig">
                <template v-if="col.slot">
                    <slot :name="col.slot"></slot>
                </template>
                <el-table-column v-else-if="col.displayHeader" :key="idx" :label="col.label" :width="col.width" :align="col.align?col.align:'center'">
                    <template v-if="col.displayHeader" slot="header" slot-scope="scope">
                        <div>
                            <span v-html="col.displayHeader(scope)"></span>
                        </div>
                    </template>
                    <template slot-scope="scope">

                        <template v-if="col.type=='index'">{{scope.$index+1}}</template>

                        <template v-else-if="col.type=='operate'">
                            <el-button type='text' v-for="(item,index) in col.operates" :key="index" class="tableButton" style="margin:0 5px;" :style="getStyle(item)" v-html="item.display(scope,ctx)" @click="item.click?item.click(scope,ctx):''" :disabled="item.disabled?item.disabled(scope,ctx):false"></el-button>
                        </template>
                        <template v-else>
                            <div v-if="col.display" v-html="col.display(scope,ctx)" :class="getClassname(col)" :style="getStyle(col)" @click="col.click?col.click(scope,ctx):''"></div>
                            <div v-else :class="getClassname(col)" :style="getStyle(col)" @click="col.click?col.click(scope,ctx):''">{{!!scope.row[col.key]?scope.row[col.key]:(col.nullValue?col.nullValue:'--')}}</div>
                        </template>
                    </template>
                </el-table-column>

                <el-table-column v-else :key="idx" :label="col.label" :width="col.width" :align="col.align?col.align:'center'">

                    <template slot-scope="scope">

                        <template v-if="col.type=='index'">{{scope.$index+1}}</template>

                        <template v-else-if="col.type=='operate'">
                            <el-button type='text' v-for="(item,index) in col.operates" :key="index" class="tableButton" style="margin:0 5px;" :style="getStyle(item)" v-html="item.display(scope,ctx)" @click="item.click?item.click(scope,ctx):''" :disabled="item.disabled?item.disabled(scope,ctx):false"></el-button>
                        </template>
                        <template v-else>
                            <div v-if="col.display" v-html="col.display(scope,ctx)" :class="getClassname(col)" :style="getStyle(col)" @click="col.click?col.click(scope,ctx):''"></div>
                            <div v-else :class="getClassname(col)" :style="getStyle(col)" @click="col.click?col.click(scope,ctx):''">{{!!scope.row[col.key]?scope.row[col.key]:(col.nullValue?col.nullValue:'--')}}</div>
                        </template>
                    </template>
                </el-table-column>
            </template>
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
        },
        thisObj: {
            type: Object,
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
            ctx: {},
        }
    },
    mounted() {
        this.loadTableStyle()
        this.ctx = this.thisObj ? this.thisObj : this.$parent
    },
    watch: {
        tableData: function () {
            this.loadTableStyle()
        },
    },
    methods: {
        loadTableStyle() {
            this.$nextTick(function () {
                if (this.tableMaxHeight > 0 && this.tableData.length * 40 > this.tableMaxHeight) {
                    this.maxHeight = this.tableMaxHeight
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