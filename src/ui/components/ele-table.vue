<template>
    <el-table ref="ref_table" :data="tableData" style="width: 100%" :max-height="maxHeight" :key="componentKey" border stripe>
        <el-table-column v-for="(col,idx) in columnConfig" :key="idx" :label="col.label" :width="col.width" :align="col.align">
            <template slot-scope="scope">
                <!-- <div  v-if="col.display"></div> -->

                <template v-if="col.type=='index'">{{scope.$index+1}}</template>
                <template v-else-if="col.type=='button'">
                    <div v-if="col.display" v-html="col.display(scope)" @click="col.click(scope)" class="tableButton"></div>
                    <div v-else @click="col.click(scope)" class="tableButton">{{scope.row[col.key]}}</div>
                </template>

                <template v-else>
                    <div v-if="col.display" v-html="col.display(scope)"></div>
                    <div v-else>{{scope.row[col.key]}}</div>
                </template>
            </template>
        </el-table-column>
    </el-table>
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
    },
    data() {
        return {
            maxHeight: '100%',
            componentKey: 0,
        }
    },
    mounted() {
        this.maxHeight = this.$refs.ref_table.$el.parentNode.clientHeight
        this.componentKey++
    },
    methods: {},
}
</script>