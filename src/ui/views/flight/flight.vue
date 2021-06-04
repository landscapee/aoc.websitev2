<template>
    <div id="flight">
      <toolBar/>
      <flightTable :columns="columns"/>
    </div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "../../lib/postalStore";
    import {getListHeader} from "@/ui/views/flight/components/flightTable/handleColumn";
    let postalStore = new PostalStore();
  export default {
    data() {
      return {
        columns: [],
      }
    },
    components: {
      'toolBar': () =>
        import(/*webpackChunkName:"com-toolBar"*/ './components/toolBar'),
      'flightTable': () =>
        import(/*webpackChunkName:"com-flightTable"*/ './components/flightTable/flightTable'),
    },
    beforeMount() {
      this.columns = getListHeader();
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

    },
  }
</script>

<style>
  #flight{
    padding-left: 15px;
  }
</style>
