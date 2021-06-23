<template>
    <div id="flight">
      <toolBar/>
      <div class="flightWrapper">
        <flightTable :flights="flights" :columns="columns">
<!--          <complex-column :item="scope.item" :scope="scope.scope"/>-->
        </flightTable>
      </div>
    </div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "../../lib/postalStore";
    import {getListHeader} from "@/ui/views/flight/components/flightTable/handleColumn";
    import _ from 'lodash';
    import ColumnsDefine from './columnDefine'
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
      'complex-column': () =>
        import(/*webpackChunkName:"complex-column"*/ './components/complexColumnDom'),
    },
    beforeMount() {
      this.setColumns(getListHeader())
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
      setColumns: function (Columns) {
        let newColumns = _.map(Columns, (h) => {
          if (ColumnsDefine[h.key]) {
            return _.extend({}, h, ColumnsDefine[h.key]);
          } else {
            return h;
          }
        });
        this.columns = newColumns
      }
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
