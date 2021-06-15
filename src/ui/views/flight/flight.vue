<template>
    <div id="flight">
      <toolBar/>
      <div class="flightWrapper">
        <flightTable :flights="flights" :columns="columns"/>
      </div>
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
        flights: [],
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


      postalStore.sub('Flight.Sync',data=>{
        this.flights = data.flights
      })
      postal.publish({
        channel: 'Worker',
        topic: 'Page.Flight.Start',
        data: getListHeader()
      });
      let header = getListHeader();
      // debugger;
      // postalStore.pub('Worker','Flight.UpdateHeader', header)
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
  .flightWrapper{
    height: calc(100% - 50px);
    position: relative;
  }
</style>
