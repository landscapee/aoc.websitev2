<template>
  <div id="menu">
    <el-row type="flex" justify="center">
      <el-col class="navBox" v-for="(nav,index) in navBox" v-if="hasRole(nav.role, false)" :key="index" @click.native="toPage(nav)">
        <img :src="nav.src" alt="">
        <span>{{ nav.name }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {hasRole} from "@ui_lib/common";
import {getUserSerializ} from "@ui_lib/localStorageTemp";

const runcontrol = require('../../assets/img/menu/runcontrol.png')
export default {
  data() {
    return {
      navBox: [],
    }
  },
  mounted() {
    this.loadNav()
  },
  methods: {
    hasRole,
    loadNav() {
      let ipCfg = {
        test: '173.101.1.30:6082',
        tf: '10.33.64.1:6079',
        dev: '173.100.1.34:18078',
      };
      let urlIp = ipCfg[BUILD_ENVIROMENT] || ipCfg['dev'];
      let menus = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {}
      // menus.map(list=>{
      //     if(list.code=='home')
      // })
      let token = getUserSerializ().token
      this.navBox = [
        {name: '运行控制', src: runcontrol, path: '/#/home', role: 'runControl',},
        {
          name: '运行保障KPI',
          src: require('@/ui/assets/img/menu/operation.png'),
          path: '/kpi/#/runSecurityKPI',
          isOther: true,
          role: 'operationKPI',
        },
        {
          name: '综合统计',
          src: require('@/ui/assets/img/menu/statistics.png'),
          path: '/home',
          sitePath: 'http://10.34.80.17:37799/webroot/decision',
          role: 'sts'
        },
        {name: 'ASOMS', src: require('@/ui/assets/img/menu/flightRout.png'), sitePath: 'http://10.35.80.10/', role: 'ASOMS'},
        {name: '拖机系统', src: require('@/ui/assets/img/menu/drag.png'), sitePath: `http://${urlIp}/#/login?token=${token}`, role: 'drag'},
      ]
    },
    toPage(nav) {
      let url
      if (nav.sitePath) {
        url = nav.sitePath
      } else {
        url = `http://${location.hostname}:${location.port}${nav.path}`
      }
      window.open(url)
    },
  },
}
</script>

<style scoped lang='scss'>
#menu {
  background: url('~@/ui/assets/img/menu/menuBg.png');
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .navBox {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0 50px;
    cursor: pointer;

    img {
      width: 180px;
    }

    span {
      color: #fff;
      margin-top: 30px;
      font-size: 18px;
    }
  }

  .navBox:hover {
    span {
      color: #007bff;
    }
  }
}
</style>
