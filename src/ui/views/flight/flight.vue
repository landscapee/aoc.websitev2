<template>
    <div id="flight">
      <toolBar/>
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
      'toolBar': () =>
        import(/*webpackChunkName:"com-globHead"*/ './components/toolBar'),
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

<style>
  #flight{
    padding-left: 15px;
  }
</style>
