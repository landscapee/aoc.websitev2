<template>
    <div id="com_glob_head">
        <div class="logo_left">
            <div :style="'background-image:url(/src/ui/assets/img/'+sysEdition+'/logoTitle.png);'"></div>
            <span class="sansB">{{$t('message.sysName')}}</span>
        </div>
        <ul class="nav_middle">
            <li v-for="(item,idx) in navList" :key="idx" :class="{active:navFlag==idx}" @click="navHandle(item.path,idx)">
                <div>
                    <icon-svg :iconClass="item.icon" :iconColor="'#fff'" />
                    <span>{{item.name}}</span>
                </div>
            </li>
        </ul>
        <div class="user_right">
            <div class="dateBox">
                <i class="el-icon-date" style="color:#fff;"></i>
                <span class="orbiL flexSC">{{$moment().format('YYYY-MM-DD')}}</span>
            </div>
            <div class="timeBox">
                <i class="el-icon-time" style="color:#fff;"></i>
                <span class="orbiL flexSC">{{$moment().format('HH:mm:ss')}}</span>
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
                    sessionStorage.clear()
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
            let menus = this.getUserMsg.menus || []
            this.navList
            menus.map((list) => {
                let nav = _.find(this.navList, { code: list.code })
                let drop = _.find(this.dropLists, { code: list.code })
                if (nav || drop) {
                    return false
                }

                // if (list.name.indexOf('tobt') >= 0) {
                //     console.log(list, 1111111111)
                // }
                //运行态势
                if (list.code == 'situation-all') {
                    list.icon = 'yunxingtaishi'
                    list.path = 'home'
                    this.navList.push(list)
                }
                //航班动态
                if (list.code == 'flight') {
                    list.icon = 'hangbandongtai1'
                    list.path = 'flight'
                    this.navList.push(list)
                }
                //航班正常监控
                if (list.code == 'normal_monitoring_runway') {
                    list.icon = 'hbzcjk'
                    list.path = 'poolMonitorWithRunway'
                    list.name = '航班正常监控'
                    this.navList.push(list)
                }
                //运行监控
                if (list.code == 'run_monitoring') {
                    list.icon = 'yunxingjiankong'
                    list.path = 'runMonitoring'
                    this.navList.push(list)
                }
                //动态调整
                if (list.code == 'flight_schedule_dynamic_adjustment') {
                    list.icon = 'tiaozheng1'
                    list.path = 'flightAdjustment'
                    this.navList.push(list)
                }
                //不利条件运行
                if (list.code == 'conditionalOperationMain') {
                    list.icon = 'bulitiaojian'
                    list.path = 'conditionalOperation'
                    this.navList.push(list)
                }
                //资源监控
                if (list.code == 'resourceMonitoring') {
                    list.icon = 'ziyuanjiankong'
                    list.path = 'resourceMonitoring'
                    this.navList.push(list)
                }
                //调整调减
                if (list.code == 'adjustReduction') {
                    list.icon = 'tiaozhengtiaojian'
                    list.path = 'adjustmentReduction'
                    this.navList.push(list)
                }
                //消息管理
                if (list.code == 'news_releaseAll') {
                    list.icon = 'xiaoxifabu'
                    list.path = 'specialTreatment'
                    list.name = '消息发布'
                    this.navList.push(list)
                }

                //
            })
            this.setNavFlag()
        },
        setNavFlag() {
            this.navList.forEach((list, index) => {
                if (list.path == this.path) {
                    this.navFlag = index
                }
            })
        },
        navHandle(path, idx) {
            this.navFlag = idx
            this.$router.push('/' + path)
            // if (path == 'flight_full') {
            //     setTimeout(() => {
            //         let ele = $('.flight_full_contariner')[0]
            //         const func =
            //             ele.requestFullscreen ||
            //             ele.mozRequestFullScreen ||
            //             ele.webkitRequestFullscreen ||
            //             ele.msRequestFullscreen
            //         func.call(ele)
            //     }, 500)
            // }
        },
    },
}
</script>

<style lang="scss" scoped>
#com_glob_head {
    height: 40px;
    width: 100%;
    background: linear-gradient(90deg, #183d71 0%, #0172cf 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo_left {
        height: 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: linear-gradient(90deg, #0f4291 0%, #428bff 100%);
        box-shadow: 0px 0px 6px 0px rgba(47, 61, 142, 1);
        border-radius: 0px 0 100px 0px;
        color: #fff;
        padding: 0 20px;

        div {
            height: 100%;
            width: 110px;
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: center left;
        }
        span {
            font-size: 18px;
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
            height: 38px;
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
                    font-size: 16px;
                    color: #fff;
                    margin-left: 6px;
                }
                svg {
                    font-size: 18px;
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
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            span {
                color: #fff;
                font-size: 16px;
                margin-left: 8px;
            }
        }
        .timeBox {
            width: 80px;
            span {
                font-size: 18px;
            }
        }
        .dateBox {
            span {
                font-size: 18px;
            }
        }

        .logoutBox,
        .setBox {
            width: 40px;
            height: 40px;
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
