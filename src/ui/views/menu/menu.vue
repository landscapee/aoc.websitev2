<template>
    <div id="menu">
        <el-row type="flex" justify="center">
            <el-col class="navBox" v-for="(nav,index) in navBox" :key="index" @click.native="toPage(nav)">
                <img :src="nav.src" alt="">
                <span>{{nav.name}}</span>
            </el-col>
        </el-row>
    </div>
</template>

<script>
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
        loadNav() {
            console.log()
            let menus = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {}
            // menus.map(list=>{
            //     if(list.code=='home')
            // })
            this.navBox = [
                { name: '运行控制', src: '/src/ui/assets/img/menu/runcontrol.png', path: '/home' },
                {
                    name: '运行保障KPI',
                    src: '/src/ui/assets/img/menu/operation.png',
                    path: '/home',
                },
                { name: '综合统计', src: '/src/ui/assets/img/menu/statistics.png', path: '/home' },
                { name: 'ASOMS', src: '/src/ui/assets/img/menu/flightRout.png', path: '/home' },
                { name: '拖机系统', src: '/src/ui/assets/img/menu/drag.png', path: '/home' },
            ]
        },
        toPage(nav) {
            this.$router.push(nav.path)
        },
    },
}
</script>

<style scoped lang='scss'>
#menu {
    background: url('/src/ui/assets/img/menu/menuBg.png');
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
