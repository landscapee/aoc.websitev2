<template>
    <div class="settting">
        <div class="title">调时调减设置</div>
        <div class="content">
            <div class="nav">
                <ul>
                    <li :class="navFalg==0?'active':''" @click="navFalg=0">常态化</li>
                    <li :class="navFalg==1?'active':''" @click="navFalg=1">大面积延误</li>
                </ul>
                <div>
                    <icon-svg iconClass="xingzhuangjiehe" />
                    最大起降架次
                </div>
            </div>
            <div>

            </div>

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            navFalg: 0,
        }
    },
}
</script>
<style scoped lang='scss'>
.settting {
    top: 0;
    left: 0;
    height: 60%;
    width: 600px;
    .title {
        width: calc(100% - 8px);
        height: 28px;
        background: linear-gradient(180deg, #2e67f6, rgba(0, 75, 205, 0.8));
        box-shadow: 0px 0px 6px 0px #2f3d8e;
        color: #fff;
        line-height: 28px;
        text-align: center;
        margin: 4px;
    }
    .content {
        padding: 10px;
        .nav {
            height: 34px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            background: #16294a;
            border-bottom: 1px solid rgba(65, 129, 233, 0.5);

            ul {
                li {
                    display: inline-block;
                    height: 100%;
                    line-height: 34px;
                    padding: 0 16px;
                    cursor: pointer;
                }
                li.active {
                    background: #0566ff;
                    border-radius: 4px 4px 0px 0px;
                }
            }
            div {
                cursor: pointer;
                margin-right: 5px;
            }
        }
    }
}
</style>
