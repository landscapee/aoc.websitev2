<template>
	<div class="warn">
		<div class="title">
			<div class="shuxian"></div>
			<div class="text">MDRS预警</div>
			<div class="status" :style="{color:statusObj[status],borderColor:statusObj[status]}">
				{{mdrsWarnOpt[status]}}
			</div>
		</div>
		<div class="content">
			{{messageData.content}}
		</div>
	</div>
</template>

<script>
    import {memoryStore} from "@/worker/lib/memoryStore";

    import postal from 'postal';
    import PostalStore from "@ui_lib/postalStore";

    let postalStore = new PostalStore();
    import moment from 'moment'
    import {filter, map, get} from 'lodash'

    export default {
        name: "bottomLeftIndex",
        components: {},
        data() {
            return {
                status: 2,
                mdrsWarnOpt: {
                    1: '生效',
                    2: '待生效',
                    3: '失效',
                },
                statusObj: {
                    1: '#24ca87', //sx
                    2: '#3280e7', //dsx
                    3: '#888888', //sx
                },
                messageData: {},//MDRS预警
            }
        },
        methods: {},
        created() {
            // Get.message.Data

        },
        mounted() {


            postalStore.sub('push.message.Data', (messageClientData) => {
                let mdrs = filter(messageClientData, (item) => item.category === 'MDRS预警');
                let mdrsObj = mdrs[0] || {};
                let now = memoryStore.getItem('global').now;
                // 1:生效 2:待生效 3:失效
                // 当前时间早于开始时间 待生效
                if (moment(now).isBefore(mdrsObj.closeStartTime)) {
                    this.status = 2;
                }
                // 当前时间晚于开始时间 并且 早于结束时间 生效
                if (moment(now).isAfter(mdrsObj.closeStartTime) && moment(now).isBefore(mdrsObj.closeEndTime)) {
                    this.status = 1;
                }
                // 当前时间晚于结束时间 失效
                if (moment(now).isAfter(mdrsObj.closeEndTime)) {
                    this.status = 3;
                }
                this.messageData = mdrsObj;
            });
            postal.publish({
                channel: 'Worker',
                topic: 'Get.message.Data',
            });

        },
        beforeDestroy() {
            postalStore.unsubAll()
        },
    }
</script>

<style lang="scss" scoped>
	.warn {
		height: 100%;
		width: 100%;
		margin-right: 10px;
		padding: 10px 10px;
		color: #fff;
		.title {
			font-size: 14px;
			display: flex;
			align-items: center;
			.shuxian {
				width: 4px;
				height: 14px;
				background: #0566ff;
				border-radius: 1px;
			}
			.text {
				margin: 0 12px 0 8px;
			}
			.status {

				padding: 2px 9px;
				border: 1px solid;
				border-radius: 10px 10px 10px 0px;
			}

		}
		.content {
			display: flex;
			align-items: center;
			height: calc(100% - 22px);
			margin: 0 12px;
			line-height: 22px;
		}
	}
</style>