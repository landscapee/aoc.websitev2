<template>
    <div class="globHeaderMsg">
        <div class="msgBox" @click="headrMsgHandle">
            <i class="iconfont icon-xiaoxi"></i>
            <div v-show="unreadCount>0">{{unreadCount}}</div>
        </div>

    </div>

</template>

<script>
import PostalStore from '@/ui/lib/postalStore'
let postalStore = new PostalStore()
import { memoryStore } from '@/worker/lib/memoryStore'
export default {
    data() {
        return {
            current: 1,
            size: 15,
            msgList: [],
            unreadCount: 0,
            listShow: false,
        }
    },
    mounted() {
        this.msgList = []
        this.getData()
        postalStore.sub('Web', 'Public.GetMsg.Sync', (data) => {
            console.log(data)
            this.unreadCount = data.length
            if (this.listShow) {
                this.msgList = _.concat(this.msgList, data)
            }
        })
    },
    methods: {
        getData() {
            this.$request
                .get('adverse', 'message/list?current=' + this.current + '&size=15')
                .then((res) => {
                    // let prev = memoryStore.getItem('Public').msgList || []
                    // prev.push(...res.data.records)
                    // let data = _.orderBy(prev, 'createTime', 'desc')
                    // memoryStore.setItem('Public', { msgList: data })
                    this.msgList = _.concat(this.msgList, res.data.records)
                })
        },
        headrMsgHandle() {
            this.unreadCount = 0
            this.listShow = true
        },
    },
}
</script>

<style lang="scss" scoped>
.globHeaderMsg {
    .msgBox {
        height: 24px;
        width: 24px;
        border-radius: 14px;
        background: #005aa5;
        position: relative;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
            color: #fff;
            font-size: 12px;
        }
        div {
            position: absolute;
            top: -3px;
            right: -8px;
            background: red;
            padding: 1px 2px;
            border-radius: 10px;
            color: #fff;
            font-size: 12px;
        }
    }
}
</style>