<template>
	<div class="bottomRightIndex">
		<div class="left bottomRightItem">
			<Item  ></Item>

		</div>

		<div class="right bottomRightItem">
			<Indicator></Indicator>
		</div>


	</div>
</template>

<script>

    import Item from './item'
	import {map} from 'lodash'
	import Indicator from '../../../components/indicator'
    export default {
        name: "bottomRightIndex",
        components: {Item,Indicator},
        computed: {
        },
        data() {
            return {

            }
        },
        methods: {

        },


    }
</script>

<style lang="scss" scoped>
	.bottomRightIndex {
		display: flex;
		flex-wrap: wrap;
		color: #fff;
		height: 100%;
		.left{
			margin-right: 14px;
		}
		.bottomRightItem{
			width: calc(50% - 7px);
		}
	}

	/*.item:nth-child(1),*/
	/*.item:nth-child(2) {*/
		/*margin-top: 0 !important;*/
	/*}*/

	/*.item:nth-child(odd) {*/
		/*margin-left: 0 !important;*/
	/*}*/

	/*.item {*/
		/*background: rgba(25, 37, 60, 0.8);*/
		/*border-radius: 5px;*/
		/*padding: 10px 15px;*/
		/*width: calc(50% - 7px);*/
		/*height: calc(33.333333% - 9px);*/
		/*margin: 10px 0 0 14px;*/
		/*!*border:  1px red solid;*!*/
		/*.title {*/
			/*font-size: 14px;*/
			/*font-family: MicrosoftYaHei-Bold;*/
			/*display: flex;*/
			/*align-items: center;*/
			/*.shuxian {*/
				/*margin-right: 8px;*/
				/*width: 4px;*/
				/*height: 14px;*/
				/*background: #0566ff;*/
				/*border-radius: 1px;*/
			/*}*/

		/*}*/
	/*}*/
</style>