<template>
    <div style="width:100%;height:100%;">
        <router-view v-if="isRouterShow" />
    </div>
</template>
<script>
    import router from './router'
    import Vue from 'vue';
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
  mounted(){
    this.$sub('Web','Login.Out',()=>{
      Vue.prototype.$alert('用户已过期，请重新登录！', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        router.replace("/")
      })
    });
    this.$sub('Web','Global.Alert',(opts)=>{
      Vue.prototype.$alert(...opts)
    })
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
