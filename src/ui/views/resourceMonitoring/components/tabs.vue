<template>

	<span class="tabs" ref="tabs">
 		<span @click="tabItemClick( tab)" class="tabItem cursor"
			  :class="activeName==tab.key?'tabItemActive':''"
			  :ref="tab.key"
			  v-for="(tab) in tabs" :key="tab.key">
			{{tab.name}}
		</span>
		<span class="allWidth"></span>
 		<span class="itemWidth"   :style="getItemWidthStyle"></span>
	</span>
</template>

<script>
    export default {
        name: "mytabs",
        components: {},
        props: ['tabs','activeName'],
        data() {
            return {
                // activeName: '全部',
                mountedIs:false,
            }
        },
		watch:{
            tabs:function (n) {
                console.log(n,'qweqweqw');
            }
		},
        computed: {
            getItemWidthStyle() {
                if(this.mountedIs){
                    let width=0
                    let width1=0
                    let element=null
					this.$nextTick(()=>{
                        element= this.$refs[this.activeName]&&this.$refs[this.activeName][0]
					})
                    if(element){
                        width=parseInt(window.getComputedStyle(element).width)
                        width1= element.offsetLeft
                    }
                    console.log(this.$refs[this.activeName],element,this.activeName,'getItemWidthStyle');
                    return {width: width + 'px', left: width1 + 'px'}

				}
            },
        },
        methods: {
            tabItemClick( tab) {
				this.$emit('tabClick',tab)
            },
        },
        created() {
        },
		mounted(){
            console.log(this.$refs[this.activeName],'11111qweqweqw');
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