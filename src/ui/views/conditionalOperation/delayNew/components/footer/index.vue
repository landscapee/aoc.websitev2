<template>
	<div class="footerIndex">
		<div class="left item">
			<TrafficCapacity></TrafficCapacity>
		</div>
		<div class="right item"></div>
	</div>
</template>

<script>
    import TrafficCapacity from '../../../components/trafficCapacity/trafficCapacity'

    export default {
        name: "footerIndex",
        components: {TrafficCapacity},
        data() {
            return {}
        },
        methods: {},
        created() {
        },
    }
</script>

<style lang="scss" scoped>
.footerIndex{
	height: 100%;
	width: 100%;
	display: flex;
	.item{
		width: calc(50% - 6px);
	}
	.left{
		margin-right: 12px;
	}

}
</style>