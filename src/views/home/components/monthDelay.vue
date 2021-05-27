<template>
    <div class="monthDelay" :class="options.position">
        <div class="box_content">
            <div class="left">
                <div class="top">
                    <icon-svg iconClass="monthdelay" />
                    <span class="name">月度放行正常率目标： 90%</span>
                    <i class="iconfont icon-bianji"></i>
                </div>
                <div class="mid">
                    <div>
                        <p>当月累计放行正常率： 92%</p>
                        <p>后续每日放行正常率最低目标：XX %</p>
                    </div>
                    <div>
                        <p>今天限制延误架次： 50</p>
                        <p>今日已延误架次：60</p>
                    </div>
                </div>
                <div class="footer">
                    <div class="top">
                        <icon-svg iconClass="monthtitle" />
                        <span class="name">延误航班统计：</span>
                        <el-select v-model="select" placeholder="请选择" size="mini" @change="loadActiveData">
                            <el-option v-for="item in selectArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <table class="">
                            <thead>
                                <tr>
                                    <th>0.5小时</th>
                                    <th>0.5-1小时</th>
                                    <th>1-2小时</th>
                                    <th>2小时</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{activeData.ltHalfHour}}</td>
                                    <td>{{activeData.ltOneHour}}</td>
                                    <td>{{activeData.ltTwoHour}}</td>
                                    <td>{{activeData.gtTwoHour}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="right">
                <div>
                    <div class="title">
                        最近实际落地航班
                        <icon-svg iconClass="intitle" />
                    </div>
                    <div>
                        <table>
                            <tr>
                                <td>MU5846</td>
                                <td>20L</td>
                                <td>14:24 </td>
                            </tr>
                            <tr>
                                <td>MU5846</td>
                                <td>20L</td>
                                <td>14:24 </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div>
                    <div class="title">
                        最近实际起飞航班
                        <icon-svg iconClass="movementD" />
                    </div>
                    <div>
                        <table>
                            <tr>
                                <td>MU5846</td>
                                <td>20L</td>
                                <td>14:24 </td>
                            </tr>
                            <tr>
                                <td>MU5846</td>
                                <td>20L</td>
                                <td>14:24 </td>
                            </tr>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['options', 'data'],
    data() {
        return {
            select: 'arriveNormal',
            selectArr: [
                { name: '落地正常率', value: 'arriveNormal' },
                { name: '起飞正常率', value: 'departureNormal' },
                { name: '航班正常率', value: 'normal' },
                { name: '始发正常率', value: 'originalAllowTakeOff' },
                { name: '早高峰正常率', value: 'originalInMorning' },
                { name: '放行正常率', value: 'takeOffNormal' },
            ],
            activeData: {
                gtTwoHour: 0,
                ltHalfHour: 0,
                ltOneHour: 0,
                ltTwoHour: 0,
            },
        }
    },
    created() {},
    mounted() {},
    watch: {
        data: function () {
            this.loadActiveData()
        },
    },
    methods: {
        loadActiveData() {
            this.activeData = this.data.rateDelay
                ? this.data.rateDelay[this.select]
                : {
                      gtTwoHour: 0,
                      ltHalfHour: 0,
                      ltOneHour: 0,
                      ltTwoHour: 0,
                  }
        },
    },
}
</script>

<style scoped lang='scss'>
.monthDelay {
    padding: 4px;
    position: absolute;
    .box_content {
        height: 100%;
        width: 100%;
        background: linear-gradient(
            134deg,
            rgba(26, 39, 64, 0.5) 0,
            rgba(29, 47, 67, 0.5) 30%,
            rgba(29, 47, 67, 0.5) 100%
        ) !important;
        display: flex;
        justify-content: space-between;
        .left {
            display: flex;
            flex-direction: column;
            padding: 0 30px;
            border-right: 2px dashed rgba(179, 189, 220, 0.2);
            width: calc(100% - 200px);
            margin: 20px 0;
            .top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px dashed rgba(179, 189, 220, 0.2);
                padding-bottom: 10px;
                i {
                    font-size: 14px;
                    color: #ccc;
                }
                svg {
                    font-size: 24px;
                }
                .name {
                    flex: 1;
                    margin-left: 10px;
                    color: #fff;
                }
            }
            .mid {
                padding: 20px 0;
                border-bottom: 2px dashed rgba(179, 189, 220, 0.2);
                & > div {
                    display: flex;
                    p {
                        width: 50%;
                        color: #fff;
                    }
                }
            }
            .footer {
                margin-top: 20px;
                .top {
                    border: none;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    thead {
                        background: #37455c;
                    }
                    tbody {
                        background: #1f2c42;
                    }
                    th,
                    td {
                        color: #fff;
                        height: 40px;
                        text-align: center;
                    }
                }
            }
        }
        .right {
            padding: 0 14px;
            width: 200px;
            margin: 20px 0;
            & > div {
                height: 50%;
                width: 100%;
                .title {
                    font-size: 12px;
                    height: 30px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    svg {
                        font-size: 24px;
                        margin-left: 5px;
                    }
                }
                table {
                    width: 100%;
                    height: 100%;
                    tr {
                        td {
                            color: #fff;
                            height: 30px;
                        }
                    }
                }
            }
        }
    }
}
</style>
