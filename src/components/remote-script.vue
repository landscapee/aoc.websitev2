<template>
    <div></div>
</template>
<script>
export default{
	data(){
        return{
            
        }

    },
    props:['src','hasCode'],
    watch:{
        
    },
    beforeMount(){
        
    },
	mounted () {
        if(!!!window[this.hasCode]){
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = this.src;
            document.body.appendChild(s);
        }
        
    },
	methods:{
        
    }
	
}
</script>
<style lang="scss" scoped>

</style>
