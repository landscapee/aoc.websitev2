<template>
    <div id="runningNew">
        <div class="top">

            <Top setting="weatherNewObj"></Top>
        </div>
        <div class="bottom">
            <div class="left">
                <BottomLeft  ></BottomLeft>
            </div>
            <div class="right">
                <BottomRight  ></BottomRight>
            </div>
        </div>
    </div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";
    let postalStore = new PostalStore();

    import Top from "../components/top/index"
    import BottomLeft from "./components/bottomLeft/index"
    import BottomRight from "./components/bottomRight/index"

    export default {
        data() {
            return {}
        },
        components: {
            BottomRight, BottomLeft, Top
        },
        methods: {},
        created() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.runningNew.Start',
            });
        },
        mounted() {

        },
        beforeDestroy() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.runningNew.Stop',
            })
            postalStore.unsubAll()
        },
    }
</script>
<style scoped lang="scss">
    #runningNew {
        padding-bottom: 15px;
        .top {
            height: 74px;
        }
        .bottom {
            margin-top: 10px;
            height: calc(100% - 84px);
            display: flex;
            .right,
            .left {
                height: 100%;

            }
            .left {
                width: calc(60%  );
                margin-right: 14px;
            }
            .right{
                width: calc(40% - 14px);
            }
        }
    }
</style>