<template>
    <div class="runway">
        <div class="box_content">
            <div class="title">
                跑道运行模式
            </div>
            <div class="direction">
                <el-input v-model="selectDirectionObj[selectDirection]" :disabled="true"></el-input>
            </div>
            <div>
                <div class="selectGroup" v-for="(item,idx) in selectArr" :key="idx">
                    <el-input v-model="item.value[item.select]" :disabled="true">
                        <template slot="prepend">{{item.label}}</template>
                    </el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// const runwayNorth = ['01', '02', '11'];
// const runwaySouth = ['19', '20', '11'];
// const runwayNull = ['', '', ''];
// export const oOptions = { 0: '落地', 1: '起飞', 2: '起飞+落地', 3: '暂停使用' };
// const specialOOptions = { 1: '起飞', 3: '暂停使用' };
export default {
    props: ['data', 'flight_runwayModels'],
    data() {
        return {
            selectDirection: 'north',
            selectDirectionObj: {
                north: '北',
                south: '南',
            },
            selectArr: [],
            runwayNorth: [
                {
                    label: '01',
                    value: { 0: '落地', 1: '起飞', 2: '起飞+落地', 3: '暂停使用' },
                    select: '',
                },
                {
                    label: '02',
                    value: { 0: '落地', 1: '起飞', 2: '起飞+落地', 3: '暂停使用' },
                    select: '',
                },
                { label: '11', value: { 1: '起飞', 3: '暂停使用' }, select: '' },
            ],
            runwaySouth: [
                {
                    label: '19',
                    value: { 0: '落地', 1: '起飞', 2: '起飞+落地', 3: '暂停使用' },
                    select: '',
                },
                {
                    label: '20',
                    value: { 0: '落地', 1: '起飞', 2: '起飞+落地', 3: '暂停使用' },
                    select: '',
                },
                { label: '11', value: { 1: '起飞', 3: '暂停使用' }, select: '' },
            ],
            lists: [],
        }
    },
    created() {
        // this.getLists()
    },
    mounted() {},
    watch: {
        flight_runwayModels: function (val) {
            this.lists = val || []
            if (this.lists.length > 0) {
                this.selectDirection = this.lists[0].direction
            }
            this.loadSelectObj()
        },
    },
    methods: {
        loadSelectObj() {
            let selectArr = this.selectDirection == 'north' ? this.runwayNorth : this.runwaySouth
            if (this.lists.length > 0) {
                selectArr.map((arr) => {
                    let list = _.find(this.lists, {
                        runway: arr.label,
                        direction: this.selectDirection,
                    })
                    arr.select = list ? list.usage : ''
                })
            }
            this.selectArr = selectArr
        },
        runwayHandle() {
            let data = {
                direction: this.selectDirection,
            }

            this.selectArr.map((list) => {
                data[list.label] = list.select
            })
            this.$request.post('situation', 'runwayModels/save', data).then((res) => {
                if (res.data) {
                    this.getLists()
                }
            })
        },
        getLists() {
            this.$request.post('situation', 'runwayModels/list').then((res) => {
                if (res.data) {
                    this.lists = res.data
                    if (this.lists.length > 0) {
                        this.selectDirection = this.lists[0].direction
                    }
                }
                this.loadSelectObj()
            })
        },
    },
}
</script>

<style scoped lang='scss'>
.runway {
    padding: 8px;
    .box_content {
        padding: 5px 15px 0;
        overflow: hidden;
        .title {
            color: #fff;
            line-height: 20px;
            display: flex;
            align-items: center;
        }
        .title:before {
            content: '';
            display: inline-block;
            height: 16px;
            width: 5px;
            background: #0566ff;
            border-radius: 1px;
            margin-right: 5px;
        }
        .direction {
            padding: 15px 0;
            border-bottom: 2px dashed rgba(179, 189, 220, 0.2);
        }
        .selectGroup {
            display: flex;
            margin: 15px 0;
            .label {
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: #fff;
                border-width: 1px 0 1px 1px;
                border-color: #37455c;
                border-style: solid;
                width: 30px;
                font-size: 12px;
                background: #101c2f;
            }
        }
        button {
            width: 100%;
            height: 34px;
            opacity: 1;
            background: #2e67f6;
            border-radius: 2px;
            border: none;
            margin-top: 20px;
            color: #fff;
        }
    }
}
</style>

<style lang="scss">
.selectGroup {
    .el-input-group__prepend {
        padding: 0;
        width: 36px;
        text-align: center;
        background: #101c2f;
        border-color: #37455c;
        color: #fff;
    }
}
</style>
