<template>
    <div>
        <el-button @click="testClick">22222</el-button>
    </div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "../../lib/postalStore";
    let postalStore = new PostalStore();
  export default {
    data() {
      return {}
    },
    components: {
      // 'com-glob-head': () =>
      //   import(/*webpackChunkName:"com-globHead"*/ '../components/com-glob-head'),
    },
    mounted() {
      postalStore.sub('Test',a=>{
        console.log('------', a)
      });


      postal.publish({
        channel: 'Worker',
        topic: 'Page.Flight.Start',
        data: ''
      })
    },
    beforeDestroy() {
      postal.publish({
        channel: 'Worker',
        topic: 'Page.Flight.Stop',
        data: ''
      })

      postalStore.unsubAll()
    },
    methods: {
      testClick(){
        console.log('asdasdas')
        // this.$pub('Worker','Test','')
      }
    },
  }
</script>
