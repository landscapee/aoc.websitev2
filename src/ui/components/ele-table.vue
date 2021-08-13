<template>
    <div class="eleTableBox" ref="ref_eleTableBox">
        <el-table ref="ref_table" :span-method="spanMethod" :data="tableData" :style="{'width':tableWidth}" :height="maxHeight" :key="componentKey" border :row-class-name="setRowClassName" :cell-class-name="setCellClassName">

            <template v-for="(col,idx) in columnConfig" v-if="col.show?col.show(ctx):true">
                <template v-if="col.slot">
                    <slot :name="col.slot"></slot>
                </template>

                <el-table-column v-else :key="idx" :label="col.label" :width="col.width" :align="col.align?col.align:'center'">
                    <template slot-scope="scope" slot="header">
                        <div v-if="col.displayHeader">
                            <span v-html="col.displayHeader(scope)"></span>
                        </div>
                        <div v-else>
                            {{col.label}}
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <template v-if="col.type=='index'">
                            <div :class="scope.$index<3?'redIndex':''">{{scope.$index+1}}</div>
                        </template>
                        <template v-else-if="col.type=='operate'">
                            <el-button :type='item.btnType?item.btnType:"text"' v-for="(item,index) in col.operates" :key="index" class="tableButton" style="margin:0 5px;" :style="getStyle(item)" v-html="item.display(scope,ctx)" @click="item.click?item.click(scope,ctx):''" :disabled="item.disabled?item.disabled(scope,ctx):false" size="mini" v-show="item.display(scope,ctx)"></el-button>
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
        setCellClassName: {
            type: Function,
        },
        // 合并行列
        spanMethod: {
            type: Function,
        },
        tableMaxHeight: {
            type: Number,
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
                this.maxHeight = '100%'
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
    .redIndex {
        color: #ac0015 !important;
    }
}
</style>