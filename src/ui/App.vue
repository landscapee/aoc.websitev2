<template>
	<div style="width:100%;height:100%;" id="app">
		<router-view v-if="isRouterShow"/>
		<el-dialog class="appDialog" title="" :close-on-click-modal="false" center
				   :visible.sync="dialogFormVisible"
				   :before-close="close">
			<div class="appDialogDiv"><i class="el-icon-warning"></i> 账号已在其他地方登陆</div>
			<el-button @click="close" type="primary" size="mini">确定</el-button>
		</el-dialog>

	</div>
</template>
<script>
    import router from './router'
    import Vue from 'vue';
    import {memoryStore} from "@/worker/lib/memoryStore";

    import PostalStore from "./lib/postalStore";
    import {clearCookie} from "./lib/localStorageTemp";

    let postalStore = new PostalStore();
    export default {
        data() {
            return {
                dialogFormVisible: false,
                isRouterShow: true,
                handleTimer: null,
                outrTimer: null,
                checkTokenTimer: null,
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
        mounted() {

            postalStore.sub('Web', 'Login.Out', (data) => {
                this.clearUserInfo(data)
            });
            postalStore.sub('Web', 'Time.Sync', (time) => {
                // console.log(2,time);
                memoryStore.setItem('global', {now: time});
            });
            postalStore.sub('Web', 'LoginSuccessCheckToken', (user) => {

                this.checkTokenTimer = window.setInterval(() => {
                    console.log(555, this.checkTokenTimer);
                    this.checkToken(user)
                }, 10 * 1000)
            });
            postalStore.sub('Web', 'Global.Alert', (opts) => {
                Vue.prototype.$alert(...opts)
            })
        },
        methods: {
            close() {
                this.dialogFormVisible = false
            },
            async reload() {

                this.isRouterShow = false
                await this.$nextTick()
                this.isRouterShow = true
            },
            clearUserInfo(data) {
                clearCookie()
                localStorage.clear()
                sessionStorage.clear()
                localStorage.removeItem('User');
                clearInterval(this.checkTokenTimer)
                console.log(this.$route.path, 222, this.checkTokenTimer);
                // data==true 表示由路由直接访问登录
                if (!data) {
                    this.$router.push('/')
                }

            },
            autoEsc() {
                if (this.outrTimer) {
                    clearTimeout(this.outrTimer)
                }
                this.outrTimer = setTimeout(() => {
                    //连续操作，记录最 后一次
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
            loginFail(user) {
                this.$request.post('login', `/logout?userId=${user.id}`, null, false).then((res) => {
                    this.clearUserInfo()
                    this.dialogFormVisible = true
                })
            },
            checkToken(user) {
                this.$request.post('login', `/authorizeIsLogin?userId=${user.id}&auth=${user.auth}`, null, false).then((res) => {
                    if (res.data !== true || res.responseCode !== 1000) {
                        this.loginFail(user);
                        // this.$message.warning('账号已在其他地方登录')
                    }
                }).catch(() => {
                })
            },
        },
        beforeDestroy() {
            postalStore.unsubAll()
            clearInterval(this.checkTokenTimer)
        }
    }
</script>
<style lang="scss">
	@import './styles/App.scss';

	.appDialog {
		.el-dialog {
			width: 450px !important;
			.el-dialog__body {
				text-align: center;
 				 .el-button {
					margin-top: 30px;
				}
			}
		}
	}

	.appDialogDiv {
		text-align: center;
		color: #fff;
		i {
			/*background: #fff;*/
			color: rgb(255, 165, 0);
			/*border-radius: 100%;*/
		}
	}
</style>
