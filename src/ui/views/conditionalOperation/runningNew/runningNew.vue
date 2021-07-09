<template>
	<div id="runningNew">
		<div class="top"></div>
		<div class="bottom">
			<div class="left"></div>
			<div class="right"></div>
		</div>
	</div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "../../../lib/postalStore";
    let postalStore = new PostalStore();
    export default {
        data() {
            return {}
        },

        methods: {},
        created() {
            postal.publish({
                channel: 'Worker',
                topic: 'Get.message.Data',
            });
        },
        mounted() {
            postalStore.sub('messageClient.data', (data) => {

                console.log('messageClient.data', data);
            });
        },
    }
</script>
<style scoped lang="scss">
	#runningNew {
		padding-bottom: 15px;
		.top {
			height: 100px;
			border: 1px #fff solid;
		}
		.bottom {
			margin-top: 15px;
			height: calc(100% - 115px);
			display: flex;
			.right,
			.left {
				height: 100%;
				border: 1px #fff solid;
				width: calc(50% - 7px);
			}
			.left {

				margin-right: 14px;
			}
		}
	}
</style>