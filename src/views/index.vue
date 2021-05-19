<template>
    <div id="index">
        <com-glob-head />
        <router-view ref="ref_indexPage" />
    </div>
</template>
<script>
export default {
    data() {
        return {}
    },
    components: {
        'com-glob-head': () =>
            import(/*webpackChunkName:"com-globHead"*/ '../components/com-glob-head'),
    },
    mounted() {},
    methods: {},
}
</script>
<style lang="scss" scoped>
#index {
    height: 100%;
    width: 100%;
}
</style>