<template>

	<span class="tabs" ref="tabs"  >

 		<span @click="tabItemClick( tab)" class="tabItem cursor"
			  :class="activeName == tab['name']  ? 'tabItemActive' : ''"

			  v-for="(tab) in tabs" :key="tab.key">
			{{tab.name}}
		</span>
		<span class="allWidth"></span>
 		<span class="itemWidth"   :style="style"></span>
 	</span>
</template>

<script>

    export default {
        name: "mytabs",
        components: {},
        props: ['tabs','activeName'],
        data() {
            return {
                flag:null,
                 element:null,
                 mountedIs:false,
				 style:{},
                 // activeName: '全部',
             }
        },
		watch:{
            tabs:function (n) {
                let ele=this.$el.getElementsByClassName('tabItemActive')
                ele=ele&&ele[0]
                if (!this.flag && ele){
                  this.flag = true
                  	this.getItemWidthStyle()
            	}
              }
            },


        methods: {
            getItemWidthStyle() {
                if(this.mountedIs){
                    this.$nextTick(()=>{
                        let width=0
                        let width1=0
                        let element=this.$el.getElementsByClassName('tabItemActive')
                        element=element&&element[0]
                        if(element){
                            width=parseInt(window.getComputedStyle(element).width)
                            width1= element.offsetLeft
                        }
                         this.style= {width: width + 'px', left: width1 + 'px'}
					})


                }
            },
            tabItemClick( tab) {
				    this.$emit('tabClick',tab)
                this.getItemWidthStyle()
            },
        },

        created() {
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
			/*width: 40px;*/
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
