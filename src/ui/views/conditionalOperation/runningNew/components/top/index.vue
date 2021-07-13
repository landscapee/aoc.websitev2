<template>
	<div class="topIndex">

		<div  :class="'item item' +index" v-for="(opt,index) in pageObj" :style="opt.style" :key="index+'q'">

		</div>
	</div>
</template>

<script>
    import moment from 'moment'
    import PostalStore from "@ui_lib/postalStore";

    let postalStore = new PostalStore();
    export default {
        name: "topIndex",
        components: {},
        data() {
            return {
                pageObj:[
					{name:'',key:'',style:{background:'#0566ff'}},
					{name:'',key:'',style:{background:'#32c8e7'}},
					{name:'',key:'',style:{background:'#24ca87'}},
					{name:'',key:'',style:{background:'#5d9d52'}},
					{name:'',key:'',style:{background:'#5f3fb0'}},
					{name:'',key:'',style:{background:'#8f35aa'}},
				],
                emergencyEventNode: [],
                postalStoreObj: [],
                emergencyCfg: {
                    准备阶段: 'ready',
                    实施阶段: 'doing',
                    结束阶段: 'finish',
                },
        }
        },
        computed: {
            displayTime() {
                return (v, type, emptyStr) => {
                    if (!v || !moment(v).isValid()) {
                        return emptyStr !== undefined ? emptyStr : '--';
                    }
                    return moment(v).format(type);
                }
            }
        },
        methods: {},
        created() {

        },
        mounted() {
            postalStore.sub('emergencyEventNode', (data) => {
                console.log(22, data);
                this.emergencyEventNode = data;
            })
        }
    }
</script>

<style lang="scss" scoped>
	.topIndex {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		display: flex;
		.item{
			flex: 1 1 auto;
 			height: 100%;
			border-radius: 5px;
			box-shadow: 0px 2px 10px 0px rgba(63,78,90,0.05);
			margin-left: 10px;
		}
		.item0{
			flex: 0 1 auto;
 			width: 570px;
			margin-left: 0;
		}
	}
</style>