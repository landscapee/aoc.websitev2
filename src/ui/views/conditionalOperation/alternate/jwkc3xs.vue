<template>
	<div class="jwkc3xs">
		<div class="jwkc3xsItem" v-for="(opt,key) in dataMap" :key="key">

			<span class="first" :style="{borderColor:opt.bgColor}">
				<span  :style="{background:opt.bgColor}">
					<span>
						<span :class="key=='composite'?'composite':''">{{opt.name}}</span>
						<span>类</span>
					</span>

				</span>
			</span>
			<span  class="second"></span>
			<span  class="third"> <span>{{data[key]&&data[key].idleNum}}</span>个</span>
		</div>
	</div>
</template>

<script>
    export default {
        name: "jwkc3xs",
        components: {},
        props: {
            data: {
                type: Object,
                default: {
                    C: {idleNum: 0}, D: {idleNum: 0}, E: {idleNum: 0}, F: {idleNum: 0}, 'composite': {idleNum: 0},
                },
            }
        },
        data() {
            return {
                dataMap: {
                    C: {name:'C',bgColor:'#3280e7'}, D: {name:'D',bgColor:'#37B5F9'},
					E: {name:'E',bgColor:'#009F24'}, F: {name:'F',bgColor:'#07B0BD'},
					'composite': {name:'复合',bgColor:'#8D61F2'},
                }
            }
        },
        methods: {},
        created() {
        },
    }
</script>

<style lang="scss" scoped>
	*{


	}
	.jwkc3xs {
		box-sizing: border-box;
	}
	.jwkc3xsItem:first-child{
		margin-top: 35px;
	}
	.jwkc3xsItem {
		background: rgba(216, 216, 216, 0.11);
		margin-top: 16px;
		border-radius: 27px;
		padding: 4px;
		 *{
			 color: #FFF;
		}
		.first{
			box-sizing: border-box;
			width: 45px;
			height: 45px;
			border: 1px solid;
			display: inline-block;
 			border-radius: 50%;
			padding: 2px;
			&>span{
				display: flex;
 				border-radius: 100%;
				width: 40px;
				height:40px;
			 	justify-content: center;
				align-items: center;
				&>span>span:first-child{
					font-size: 28px;
					line-height: 28px;
				}
				&>span>span:last-child{
					font-size: 14px;
				}
			}
			.composite{
				display: inline-block;
				width: 15px;
				line-height: 16px!important;
				font-size: 15px!important;
				/*writing-mode: vertical-lr*/
			}
		}
		.second{
			margin: 0 30px;
			display: inline-block;
 			height: 22px;
 			border-right: 1px solid #979797;
		}
		.third{
			display: inline-block;
			text-align: center;
			width: 70px;
 			span{
				font-family: FjallaOne;
				font-size: 28px;margin-right: 3px;
			}
		}
	}
</style>