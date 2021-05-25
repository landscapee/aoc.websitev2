<template>
    <div style="width:100%;height:100%;" id="app">
        <router-view v-if="isRouterShow" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            isRouterShow: true,
            handleTimer: null,
            outrTimer: null,
        }
    },
    provide() {
        return {
            reload: this.reload,
        }
    },
    destroyed() {
        clearTimeout(this.handleTimer)
        clearTimeout(this.outrTimer)
    },
    methods: {
        async reload() {
            this.isRouterShow = false
            await this.$nextTick()
            this.isRouterShow = true
        },
        autoEsc() {
            if (this.outrTimer) {
                clearTimeout(this.outrTimer)
            }
            this.outrTimer = setTimeout(() => {
                //连续操作，记录最后一次
                if (this.handleTimer) {
                    clearTimeout(this.handleTimer)
                }
                this.handleTimer = setTimeout(() => {
                    //重置计时器
                    clearTimeout(this.handleTimer)
                    this.$router.push('/')
                }, 10 * 60 * 1000)
            }, 300)
        },
    },
}
</script>
<style lang="scss">
@import './styles/App.scss';
</style>