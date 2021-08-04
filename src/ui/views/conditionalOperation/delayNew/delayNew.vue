<template>
    <div id="runningNew">
        <div class="top">
            <Top setting="delayNewObj"></Top>
        </div>
        <div class="middle">
            <div class="left">
                <middleLeft  ></middleLeft>
            </div>
            <div class="right">
                <middleRight  ></middleRight>
            </div>
        </div>
        <div class="footer">
            <Footer></Footer>
        </div>
    </div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";
    let postalStore = new PostalStore();

    import Top from "../components/top/index"
    import middleLeft from "./components/middleLeft/index"
    import middleRight from "./components/middleRight/index"
    import Footer from "./components/footer/index"

    export default {
        data() {
            return {}
        },
        components: {
            middleRight, middleLeft, Top,Footer
        },
        methods: {},
        created() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.delayNew.Start',
            });
        },
        mounted() {

        },
        beforeDestroy() {
            postal.publish({
                channel: 'Worker',
                topic: 'Page.delayNew.Stop',
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
        .middle {
            margin: 12px  0;
            height: calc(45% - 98px);
            display: flex;
            .right,
            .left {
                height: 100%;
             }
            .left {
                width: calc(40% - 14px  );
                margin-right: 14px;
            }
            .right{
                width: 60%;
            }
        }
        .footer{
             height: 55%;
        }
    }
</style>