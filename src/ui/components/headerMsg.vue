<template>
    <div class="globHeaderMsg">
        <div class="msgBox" @click="headrMsgHandle">
            <i class="iconfont icon-xiaoxi"></i>
            <div v-show="unreadCount>0">{{unreadCount}}</div>
        </div>
        <ul class="hearMsgBox" v-show="listShow" infinite-scroll-distance="300px" v-infinite-scroll="load" style="overflow:auto">
            <li v-for="(item,idx) in msgList" :key="idx" class="infinite-list-item">
                <div class="left" :class="item.isUnRead?'unread':''">

                </div>
                <div class="right">
                    <div>
                        {{ item.messageContent }}
                    </div>
                    <span>{{$moment(item.createTime).format('YYYY-MM-DD HH:mm')}}</span>
                </div>

            </li>
        </ul>
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
            size: 20,
            msgList: [],
            unreadCount: 0,
            listShow: false,
            unreadList: [],
        }
    },
    mounted() {
        postalStore.sub('Web', 'Public.GetMsg.Sync', (data) => {
            data.isUnRead = true
            this.unreadList.unshift({ ...data, isUnRead: true })
            this.unreadCount = this.unreadList.length
            if (this.listShow) {
                this.msgList.unshift(data)
            }
        })
        postalStore.pub('Worker', 'Network.Connected.Adverse', '')
    },
    methods: {
        getData() {
            this.$request
                .get('adverse', 'message/list?current=' + this.current + '&size=20')
                .then((res) => {
                    res.data.records.map((list) => {
                        let unread = _.find(this.unreadList, { id: list.id })
                        if (unread) {
                            list.isUnRead = true
                        }
                    })
                    this.msgList = _.concat(this.msgList, res.data.records)
                })
        },
        headrMsgHandle() {
            this.msgList = []
            this.current = 1
            this.listShow = !this.listShow
            if (!this.listShow) {
                this.unreadCount = 0
                this.unreadList = []
            } else {
                this.getData()
            }
        },
        load() {
            this.current++
            this.getData()
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
    .hearMsgBox {
        position: fixed;
        z-index: 10;
        top: 40px;
        right: 10px;
        height: calc(100% - 40px);
        width: 400px;
        padding: 15px;
        background: #25395c;
        box-shadow: 0 10px 10px 0 rgb(0 0 0 / 50%);
        li {
            display: flex;
            color: #fff;
            padding: 10px 0 15px;
            border-bottom: 1px solid #192c46;
            .left {
                width: 4px;
                height: 4px;

                border-radius: 4px;
                margin: 8px 10px 0 0;
            }
            .left.unread {
                background: red;
            }
            .right {
                display: flex;
                flex-direction: column;
                div {
                    font-size: 16px;
                }
                span {
                    margin-top: 15px;
                    color: hsla(0, 0%, 100%, 0.3);
                }
            }
        }
    }
}
</style>