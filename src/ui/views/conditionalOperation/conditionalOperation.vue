<template>
    <div id="conditionalOperation">
        <ul class="conditional_navBox">
            <li v-for="(nav,idx) in navList" :key="idx" :class="navFlag.path==nav.path?'active':''" @click="navHandle(nav)">
                {{nav.name}}
            </li>
        </ul>
        <router-view ref="ref_conditionalPage" class="conditional_content" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            navList: [
                { name: '大面积备降', path: 'alternate' },
                { name: '低能见运行', path: 'runningNew' },
                { name: '除冰', path: 'deice' },
                { name: '气象灾害', path: 'weatherNew' },
                { name: '大面积延误', path: 'delayNew' },
                { name: '调整调减', path: 'decrease' },
            ],
            navFlag: {},
        }
    },
    created() {
        let nav = _.find(this.navList, { path: this.$route.name })
        this.navHandle(nav ? nav : this.navList[0])
    },
    mounted() {},
    methods: {
        navHandle(nav) {
            this.navFlag = nav
            this.$router.push(nav.path)
        },
    },
}
</script>
<style scoped lang="scss">
#conditionalOperation {
    padding: 0 15px;
    position: relative;
    .conditional_navBox {
        display: flex;
        padding: 10px 0;
        li {
            height: 30px;
            background: #39404b;
            border-radius: 17px;
            color: #fff;
            line-height: 30px;
            text-align: center;
            padding: 0 15px;
            margin-right: 10px;
            cursor: pointer;
        }
        li.active {
            background: #0566ff;
        }
    }
    .conditional_content {
        height: calc(100% - 50px);
        width: 100%;
    }
}
</style>