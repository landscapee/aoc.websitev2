<template>
	<div class="topIndex">
		<div class="item"></div>
	</div>
</template>

<script>
     import PostalStore from "@ui_lib/postalStore";
    let postalStore = new PostalStore();
    export default {
        name: "topIndex",
        components: {},
        data() {
            return {
                pagObj:[
					{isArr:true,name:'ss',data:[{name:''}]}
				],
                postalStoreObj:[

				],
			}
        },
        methods: {},
        created() {

        },
		mounted(){
            postalStore.sub('runwayModels', (data) => {
                // console.log(22);
                this.runway = data;
            })
		}
    }
</script>

<style lang="scss" scoped>
.topIndex{
	height: 100%;
	width: 100%;
}
</style>