<template>
    <div id="com_glob_head">
        <div class="logo_left">
            <div :style="'background-image:url('+url+');'"></div>
            <span class="sansB">{{$t('message.sysName')}}</span>
        </div>
        <ul class="nav_middle">
            <li v-for="(item,idx) in navList" :key="idx" :class="{active:navFlag==idx}" @click="navHandle(item.path,idx)">
                <div>
                    <icon-svg :iconClass="item.icon" :iconColor="'#fff'" />
                    <span>{{item.title}}</span>
                </div>
            </li>
        </ul>
        <div class="user_right">
            <div class="dateBox">
                <i class="el-icon-date" style="color:#fff;"></i>
                <span class="fo">{{$moment().format('YYYY-MM-DD')}}</span>
            </div>
            <div class="timeBox">
                <i class="el-icon-time" style="color:#fff;"></i>
                <span class="fo">{{$moment().format('HH:mm:ss')}}</span>
            </div>
            <div>
                <!-- <icon-svg :iconClass="'yonghu'" :iconColor="'#fff'"></icon-svg> -->
                <el-dropdown @command="userHandleCommand" trigger="click">
                    <span class="el-dropdown-link sansB pointer flexSC">
                        {{getUserMsg&&getUserMsg.name?getUserMsg.name:''}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="password">{{$t('message.changePassword')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="logoutBox" :title="$t('message.logout')" @click="outLogin">
                <i class="el-icon-switch-button" style="color:#fff;"></i>
            </div>
        </div>
        <el-dialog :visible.sync="changePasswordShow" class="nodeDialog passwordNodeDialog" :show-close="false" center width="500px" :append-to-body="true" @close="changePasswordClose">
            <template slot="title">
                <div class="blankDiv"></div>
                <div class="el-dialog_header_step">{{$t('message.changePassword')}}</div>
                <div class="blankDiv"><i class="el-icon-circle-close" @click="changePasswordShow = false"></i></div>
            </template>
            <el-form :model="passwordObj" label-width="100px" :rules="rules" ref="configPassword" :label-position="lagnuage=='zh'?'right':'top'">
                <el-form-item :label="$t('message.oldPassword')" prop="oldPwd">
                    <el-input v-model="passwordObj.oldPwd" :placeholder="$t('message.nowPassword')" :type="oldPwdShow?'password':'text'">
                        <el-button slot="append" icon="el-icon-view" @click="oldPwdShow=!oldPwdShow"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.newPassword')" prop="newPwd">
                    <el-input v-model="passwordObj.newPwd" :placeholder="$t('message.newPassword')" :type="newPwdShow?'password':'text'">
                        <el-button slot="append" icon="el-icon-view" @click="newPwdShow=!newPwdShow"></el-button>
                    </el-input>
                    <font style="color:red;line-height:30px;display:flex;">请输入8-16位密码，至少包含大小写字母以及数字，可以包含特殊字符。例如：Aabc1234。</font>
                </el-form-item>
                <el-form-item :label="$t('message.confirmNewPassword')" prop="configPwd">
                    <el-input v-model="passwordObj.configPwd" :placeholder="$t('message.confirmNewPassword')" :type="configPwdShow?'password':'text'">
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
import { mapGetters } from 'vuex'
import { encryptedData } from '../lib/des-coder.js'
import { routes } from '../router/index'
let url = require('../assets/img/' + sysEdition + '/logoTitle.png')
import { map } from 'lodash'
export default {
    data() {
        var validateName = (rule, value, callback) => {
            if (value === '' || value === null || value === undefined) {
                callback(new Error(this.$t('message.validateNull')))
            } else {
                callback()
            }
        }
        var validatePassword = (rule, value, callback) => {
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
            url,
            navList: [],
            navFlag: 0,
            date: {
                time: null,
                date: null,
            },
            changePasswordShow: false,
            passwordObj: {
                oldPwd: '',
                newPwd: '',
                configPwd: '',
            },
            rules: {
                oldPwd: [{ required: true, validator: validateName, trigger: 'blur' }],
                newPwd: [{ required: true, validator: validatePassword, trigger: 'blur' }],
                configPwd: [{ required: true, validator: validateName1, trigger: 'blur' }],
            },
            handoverId: '',
            handoverShow: false,
            officeTree: [],
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            office_user_list: [],
            userStatus: 'online',
            searchName: '',
            oldPwdShow: true,
            newPwdShow: true,
            configPwdShow: true,
            lagnuage: 'zh',
            dropLists: [],
            path: '',
        }
    },
    props: ['seatFalg', 'planConfig', 'activeUserStatus'],
    beforeMounte() {},
    watch: {
        searchName: function (val) {
            this.office_user_list = this.office_user_list_all.filter((list) => {
                return _.includes(list.name, val)
            })
        },
        '$route.name': function (val) {
            this.path = val
        },
    },
    computed: {
        ...mapGetters(['getServerTime', 'getUserMsg']),
    },
    mounted() {
        this.path = this.$route.name
        this.getNavList()
        this.lagnuage = localStorage.lang || 'zh'
    },
    methods: {
        outLogin() {
            this.$confirm(this.$t('message.sureLogout'), this.$t('message.prompt'), {
                type: 'warning',
            })
                .then(() => {
                    this.$router.push('/')
                    // sessionStorage.clear()
                })
                .catch(() => {})
        },
        userHandleCommand(command) {
            if (command == 'password') {
                this.passwordObj = {
                    oldPwd: '',
                    newPwd: '',
                    configPwd: '',
                }
                this.changePasswordShow = true
            }
        },
        resetUseroffice(data) {
            data.map((list) => {
                list = _.extend(list, list.data)
                if (list.children.length == 0) {
                    list.children = null
                } else {
                    this.resetUseroffice(list.children)
                }
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
                            id: this.getUserMsg.id,
                            oldPwd: this.coder
                                ? encryptedData(this.passwordObj.oldPwd)
                                : this.passwordObj.oldPwd,
                            newPwd: this.coder
                                ? encryptedData(this.passwordObj.newPwd)
                                : this.passwordObj.newPwd,
                        })
                        .then((res) => {
                            if (res && res.responseCode == '1000') {
                                this.changePasswordShow = false
                                this.$alert(res.data, this.$t('message.prompt'), {
                                    type: 'success',
                                    center: true,
                                    showClose: false,
                                    callback: () => {
                                        this.$router.push('/')
                                    },
                                })
                            }
                        })
                } else {
                    this.$alert(this.$t('message.valueNot'), this.$t('message.prompt'), {
                        type: 'error',
                        center: true,
                    })
                    return false
                }
            })
        },
        passwordAlert() {
            if (!this.passwordObj.oldPwd) {
                this.$alert(this.$t('message.oldPasswordNotNull'), this.$t('message.prompt'), {
                    type: 'error',
                    center: true,
                })
                return false
            }
            if (!this.passwordObj.newPwd) {
                this.$alert(this.$t('message.newPasswordNotNull'), this.$t('message.prompt'), {
                    type: 'error',
                    center: true,
                })
                return false
            }
            if (this.passwordObj.newPwd != this.passwordObj.configPwd) {
                this.$alert(this.$t('message.validatePassword2'), this.$t('message.prompt'), {
                    type: 'error',
                    center: true,
                })
                return false
            }
            if (
                !/^(?=.*[a-z].*)(?=.*[A-Z].*)(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,16}$/.test(
                    this.passwordObj.newPwd
                )
            ) {
                this.$alert(this.$t('message.validatePassword1'), this.$t('message.prompt'), {
                    type: 'error',
                    center: true,
                })
                return false
            }
            return true
        },
        getNavList() {
            this.navList = []
            let route = routes[2].children
            let menus = this.getUserMsg?.menus || []
            let codeObj = {}
            map(menus, (list) => {
                codeObj[list.code] = 1
            })
            map(route, (k, l) => {
                if (codeObj[k.role]) {
                    this.navList.push(k)
                }
            })
            this.setNavFlag()
        },
        setNavFlag() {
            console.log(this.navList, this.path, this.$route)

            let path = this.path

            if (
                path == 'decrease' ||
                path == 'delayNew' ||
                path == 'weatherNew' ||
                path == 'deice' ||
                path == 'runningNew' ||
                path == 'alternate'
            ) {
                path = 'conditionalOperation'
            }

            this.navList.forEach((list, index) => {
                if (list.path == path) {
                    this.navFlag = index
                }
            })
        },
        navHandle(path, idx) {
            this.navFlag = idx
            this.$router.push(path)
        },
    },
}
</script>

<style lang="scss" scoped>
#com_glob_head {
    height: 36px;
    width: 100%;
    background: linear-gradient(90deg, #183d71 0%, #0172cf 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    position: fixed;
    .logo_left {
        height: 36px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: linear-gradient(90deg, #0f4291 0%, #428bff 100%);
        box-shadow: 0px 0px 6px 0px rgba(47, 61, 142, 1);
        border-radius: 0px 0 100px 0px;
        color: #fff;
        padding: 0 30px 0 15px;

        div {
            height: 20px;
            width: 60px;
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: center left;
        }
        span {
            font-size: 17px;
            margin-left: 15px;
        }
    }
    .nav_middle {
        display: flex;
        align-items: center;
        margin-left: 22px;
        flex: 1;
        li {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 34px;
            cursor: pointer;

            div {
                height: 20px;
                width: 100%;
                padding: 0 10px;
                border-left: 1px solid rgba(255, 255, 255, 0.3);
                display: flex;
                justify-content: center;
                align-items: center;

                span {
                    font-size: 13px;
                    color: #fff;
                    margin-left: 6px;
                }
                svg {
                    font-size: 16px;
                }
            }
        }
        li.active {
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(61, 132, 255, 1) 100%);
        }
    }
    .user_right {
        display: flex;
        align-items: center;
        & > div {
            margin: 0 12px;
            height: 36px;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            span {
                color: #fff;
                font-size: 13px;
                margin-left: 8px;
            }
        }
        .timeBox {
            width: 60px;
            span {
                font-size: 13px;
            }
        }
        .dateBox {
            span {
                font-size: 13px;
            }
        }

        .logoutBox,
        .setBox {
            width: 36px;
            height: 36px;
            background: rgba(14, 52, 113, 1);
            opacity: 0.6;
            cursor: pointer;
        }
        .logoutBox {
            margin: 0;
            border-left: 1px solid rgba(255, 255, 255, 0.3);
            justify-content: center;
        }
    }
}
</style>
<style lang="scss">
.handover_content {
    h3 {
        font-weight: 600;
    }
    .left_Box {
        width: 260px;
        height: 400px;
        border: 1px solid #ddd;
        margin-right: 15px;
        padding: 10px;
        overflow: auto;

        .treeBox {
            flex: 1;
            padding: 10px 0;
        }
    }
    .right_Box {
        flex: 1;
        border: 1px solid #ddd;
        padding: 10px;
        height: 400px;
        overflow: auto;
        .userBox {
            flex: 1;
            padding: 10px 0;
            label {
                margin: 5px 10px;
            }
        }
    }
}
.el-range-editor.el-input__inner {
    padding: 0 0 0 10px;
}
.el-range-separator {
    width: auto !important;
}
</style>
