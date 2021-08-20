<template>
    <div class="login-container">
        <div class="login-bg blur" :style="'background-image: url('+bg+');'"></div>
        <div class="loginPanle">
            <div class="loginTitle"><span>天府机场A-CDM管理系统</span></div>
            <el-row class="left">
                <img :src="loginLogo" alt="" />
            </el-row>
            <el-row class="right">
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                    <el-form-item prop="username" class="input-panel-g">
                        <span class="imgbox">
                            <img :src="userimg" />
                        </span>
                        <el-input ref="username" v-model="loginForm.username" :placeholder="$t('message.inputUsername')" name="username" type="text" tabindex="1" auto-complete="on" />
                    </el-form-item>
                    <el-form-item prop="password" class="input-panel-r">
                        <span class="imgbox">
                            <img class="pwdicon" :src="pwdimg" />
                        </span>
                        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" :placeholder="$t('message.inputPassword')" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin"></el-input>
                        <span class="imgbox pointer" style="top:0;right:0;" @click="showPwd">
                            <i class="el-icon-view" style="color:#999;"></i>
                        </span>
                    </el-form-item>
                    <el-button :loading="loading" class="loginBtn" @click.native.prevent="handleLogin($event)">{{$t('message.login')}} →</el-button>
                </el-form>
<!--                <div class="languageBox">-->
<!--                    <el-select v-model="language" size="mini">-->
<!--                        <el-option v-for="item in languageLists" :key="item.value" :label="item.name" :value="item.value"></el-option>-->
<!--                    </el-select>-->
<!--                </div>-->
            </el-row>
        </div>
        <el-dialog :visible.sync="changePasswordShow" class="nodeDialog passwordNodeDialog" :show-close="false" center width="600px" :append-to-body="true" @close="changePasswordClose">
            <template slot="title">
                <div class="blankDiv"></div>
                <div class="el-dialog_header_step">{{$t('message.changePassword')}}</div>
                <div class="blankDiv"><i class="el-icon-circle-close" @click="changePasswordShow = false"></i></div>
            </template>
            <el-form :model="passwordObj" label-width="100px" :rules="rules" ref="configPassword" :label-position="language=='zh'?'right':'top'">
                <el-form-item :label="$t('message.oldPassword')" prop="oldPwd">
                    <el-input v-model="passwordObj.oldPwd" :placeholder="$t('message.nowPassword')" :type="oldPwdShow?'password':'text'">
                        <el-button slot="append" icon="el-icon-view" @click="oldPwdShow=!oldPwdShow"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.newPassword')" prop="newPwd">
                    <el-input v-model="passwordObj.newPwd" :placeholder="$t('message.changeNewPassword')" :type="newPwdShow?'password':'text'">
                        <el-button slot="append" icon="el-icon-view" @click="newPwdShow=!newPwdShow"></el-button>
                    </el-input>
                    <font style="color:red;line-height:30px;display:flex;">请输入8-16位密码，至少包含大小写字母以及数字，可以包含特殊字符。例如：Aabc1234。</font>
                </el-form-item>
                <el-form-item :label="$t('message.changeNewPassword')" prop="configPwd">
                    <el-input v-model="passwordObj.configPwd" :placeholder="$t('message.changeNewPassword')" :type="configPwdShow?'password':'text'">
                        <el-button slot="append" icon="el-icon-view" @click="configPwdShow=!configPwdShow"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button @click="changePasswordShow = false">{{$t('message.cancel')}}</el-button>
                <el-button type="primary" @click="changePassword">{{$t('message.submit')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import userimg from './assets/img/login-username.png'
import pwdimg from './assets/img/login-password.png'
import bg from 'ui/assets/img/tianfu/loginBg2.jpg'
import loginLogo from 'ui/assets/img/tianfu/login-logo.png'
import './assets/index.scss'
import { encryptedData } from '../../lib/des-coder.js'
import { memoryStore } from '../../../worker/lib/memoryStore'
import PostalStore from '@/ui/lib/postalStore'
import { find, get } from 'lodash'
import postal from 'postal';

let postalStore = new PostalStore()
import { getUser, setUser } from '../../lib/localStorageTemp'
export default {
    name: 'login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!value.trim().length > 0) {
                callback(new Error(this.$t('message.validateUsername')))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 4) {
                callback(new Error(this.$t('message.validatePassword')))
            } else {
                callback()
            }
        }
        var validateName = (rule, value, callback) => {
            if (value === '' || value === null || value === undefined) {
                callback(new Error(this.$t('message.validateNull')))
            } else {
                callback()
            }
        }
        var validatePassword1 = (rule, value, callback) => {
            if (value === '' || value === null || value === undefined) {
                callback(new Error(this.$t('message.validateNull')))
            } else if (
                !/^(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,16}$/.test(
                    value
                )
            ) {
                callback(new Error(' '))
            } else {
                callback()
            }
        }
        var validateName1 = (rule, value, callback) => {
            if (value === '' || value === null || value === undefined) {
                callback(new Error(this.$t('message.validateNull')))
            } else if (value !== this.passwordObj.newPwd) {
                callback(new Error(this.$t('message.validatePassword2')))
            } else {
                callback()
            }
        }
        return {
            bg,
            loginLogo,
            userimg,
            pwdimg,
            languageLists: [
                { name: '中文', value: 'zh' },
                { name: 'English', value: 'en' },
            ],
            loginForm: {
                username: '',
                password: '',
            },
            loginRules: {
                username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
            },
            loading: false,
            passwordType: 'password',
            changePasswordShow: false,
            passwordObj: {
                oldPwd: '',
                newPwd: '',
                configPwd: '',
                userData: {},
                userToken: '',
            },
            rules: {
                oldPwd: [{ required: true, validator: validateName, trigger: 'blur' }],
                newPwd: [{ required: true, validator: validatePassword1, trigger: 'blur' }],
                configPwd: [{ required: true, validator: validateName1, trigger: 'blur' }],
            },
            oldPwdShow: true,
            newPwdShow: true,
            configPwdShow: true,
            language: 'zh',
        }
    },
    watch: {
        language: function (val) {
            localStorage.setItem('lang', val)
            this.$store.commit('setLanguage', val)
            this.$i18n.locale = val
        },
    },
    created() {},
    mounted() {
        this.language = localStorage.lang || 'zh'
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = 'text'
            } else {
                this.passwordType = 'password'
            }
        },
        handleLogin(e) {
            $(e.target).blur()
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$request
                        .post('login', 'loginWithRsa', {
                            username: encryptedData(this.loginForm.username),
                            password: encryptedData(this.loginForm.password),
                        })
                        .then((res, resBody) => {
                            // console.log(resBody)
                            this.loading = false
                            if (res) {
                                // if (
                                //     res.responseCode == 30002 ||
                                //     res.responseCode == 30003 ||
                                //     res.responseCode == 30010
                                // ) {
                                //     this.passwordObj.userData = res.data
                                //     this.passwordObj.userToken = res.data.token
                                //     this.$pub('Worker', 'LoginSuccess', { token: res.data.token })
                                //     sessionStorage.setItem('token', res.data.token)
                                //     memoryStore.setItem('global', { token: res.data.token })
                                //     this.$alert(res.responseMessage, this.$t('message.prompt'), {
                                //         type: 'warning',
                                //         center: true,
                                //         callback: () => {
                                //             this.changePasswordShow = true
                                //         },
                                //     })
                                //     return false
                                // }

                                if (
                                    (res.responseCode == 30003 ||
                                        res.responseCode == 30002 ||
                                        res.responseCode == 1000) &&
                                    res.data
                                ) {
                                    let storageData = {
                                        token: res.data.token,
                                    }
                                    postalStore.pub('Worker', 'LoginSuccess', res.data)
                                    // app页面
                                    postal.publish({
                                        channel: 'Web',
                                        topic: 'LoginSuccessCheckToken',
                                        data:res.data
                                    });
                                     memoryStore.setItem('global', storageData)
                                    this.$store.commit('setUserMsg', res.data)
                                    // sessionStorage.setItem('token', res.data.token)
                                    // sessionStorage.setItem(
                                    //     'User',
                                    //     JSON.stringify(res.data)
                                    // )
                                    // 登录信息保存本地
                                    setUser(res.data)
                                    if (res.responseCode == 30002) {
                                        this.$message({
                                            message: res.responseMessage,
                                            type: 'warning',
                                        })
                                    }
                                    this.$router.push('/menu')
                                    // this.routerHandle(res.data.menus || [])
                                } else {
                                    this.$message({ message: res.responseMessage, type: 'warning' })
                                }
                            }
                        })
                } else {
                    this.$message({
                        message: this.$t('message.checkNamePassword'),
                        type: 'warning',
                    })
                }
            })
        },
        routerHandle(menus) {
            let redirect = this.$route.query.redirect || ''
            let flight_monitor = _.find(menus, { code: 'flight_monitor' })

            if (redirect) {
                this.$router.push(redirect)
                return false
            }

            if (flight_monitor) {
                this.$router.push('/flight_monitor')
                return false
            }
            let flight_full = _.find(menus, { code: 'flight_full' })
            if (flight_full) {
                this.$router.push('/flight_full')
                return false
            }
            let flight_dynamics = _.find(menus, { code: 'flight_dynamics' })
            if (flight_dynamics) {
                this.$router.push('/flight_dynamics')
                return false
            }
            let support_monitor = _.find(menus, { code: 'support_monitor' })
            if (support_monitor) {
                this.$router.push('/support_monitor')
                return false
            }

            this.$alert('您还没有页面权限，请找管理员开通！', this.$t('message.prompt'), {
                type: 'warning',
                center: true,
            })
        },
        changePasswordClose() {
            Object.assign(this.$data.passwordObj, this.$options.data().passwordObj)
            this.$refs['configPassword'].clearValidate()
            this.oldPwdShow = true
            this.newPwdShow = true
            this.configPwdShow = true
        },
        changePassword() {
            let alert = this.passwordAlert()
            if (!alert) {
                return false
            }
            this.$refs['configPassword'].validate((valid) => {
                if (valid) {
                    this.$axios
                        .post('/sys/user/changeUserPwd', {
                            id: this.passwordObj.userData.id,
                            oldPwd: this.coder
                                ? encryptedData(this.passwordObj.oldPwd)
                                : this.passwordObj.oldPwd,
                            newPwd: this.coder
                                ? encryptedData(this.passwordObj.newPwd)
                                : this.passwordObj.newPwd,
                        })
                        .then((res) => {
                            if (res) {
                                this.changePasswordShow = false
                                this.$alert(res.data, this.$t('message.prompt'), {
                                    type: 'success',
                                    center: true,
                                })
                            }
                        })
                } else {
                    this.$message({ message: this.$t('message.valueNot'), type: 'error' })
                    return false
                }
            })
        },
        passwordAlert() {
            if (!this.passwordObj.oldPwd) {
                this.$message({ message: this.$t('message.oldPasswordNotNull'), type: 'error' })
                return false
            }
            if (!this.passwordObj.newPwd) {
                this.$message({ message: this.$t('message.newPasswordNotNull'), type: 'error' })
                return false
            }
            if (this.passwordObj.newPwd != this.passwordObj.configPwd) {
                this.$message({ message: this.$t('message.validatePassword2'), type: 'error' })
                return false
            }
            if (
                !/^(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,16}$/.test(
                    this.passwordObj.newPwd
                )
            ) {
                this.$message({ message: this.$t('message.validatePassword1'), type: 'error' })
                return false
            }
            return true
        },
    },
}
</script>



