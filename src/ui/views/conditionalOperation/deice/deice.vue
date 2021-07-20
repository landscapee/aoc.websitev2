<template>
    <div id="deiceIndex">
        <div class="top">
            <Top></Top>
        </div>
        <div class="bottom">
            <Bottom></Bottom>
        </div>
    </div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";
    let postalStore = new PostalStore();

    import Top from "./components/top/index"
    import Bottom from "./components/Bottom/index"


    export default {
        name:'deiceIndex',
        data() {
            return {}
        },
        components: {
            Bottom, Top
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

        }
    }
</style>