<template>

	<span class="tabs" ref="tabs">
		<span @click="tabItemClick( tab)" class="tabItem"
			  :class="activeName==tab.key?'tabItemActive':''"
			  :ref="tab.key"
			  v-for="(tab,index) in tabs" :key="index+'tabs'">
			{{tab.name}}
		</span>
		<span class="allWidth"></span>
		<span class="itemWidth" :style="getItemWidthStyle"></span>
	</span>
</template>

<script>
    export default {
        name: "index",
        components: {},
        props: ['tabs'],
        data() {
            return {
                activeName: '',
                mountedIs:false,
            }
        },
        computed: {
            getItemWidthStyle() {
                if(this.mountedIs){
                    let element=this.$refs[this.activeName][0]
					let width=parseInt(window.getComputedStyle(element).width)
					let width1= element.offsetLeft
                    console.log(222,width1);
                    return {width: width + 'px', left: width1 + 'px'}
				}
            },
        },
        methods: {
            tabItemClick( tab) {
                this.activeName= tab.key
				this.$emit('tabClick',tab)
            },
        },
        created() {
            this.activeName=this.tabs[0]?.key
        },
		mounted(){
            this.mountedIs=true
		}
    }
</script>

<style lang="scss" scoped>


	.tabs {
		display: inline-block;
		width: auto;
		position: relative;
		& > span {
			display: inline-block;
		}
		.allWidth {
			width: 100%;
			background: #214059;
			height: 3px;
			border-radius: 4px;
			position: absolute;
			bottom: -3px;
			left: 0;
		}
		.itemWidth {
			position: absolute;
			bottom: -3px;
			left: 0;
			height: 3px;
			background: #85b9ff;
			border-radius: 4px;
			width: 40px;
			transition: .3s;
		}
		.tabItem {
			color: #fff;
			padding: 8px 16px;
			font-size: 18px;
		}
		.tabItemActive {
			color: #85b9ff !important;
		}
	}
</style>