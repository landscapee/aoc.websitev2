<template>
    <div id="flight">
      <toolBar :toggleFieldSetting="toggleFieldSetting"/>
      <fieldSetting :refreshColumn="refreshColumn" :toggleFieldSetting="toggleFieldSetting" v-if="showFieldSetting"/>
      <div class="flightWrapper">
        <flightTable :flights="flights" :columns="columns">
        </flightTable>
      </div>
      <TOBTTooltip v-if="getTOBTVisibility"></TOBTTooltip>
    </div>
</template>

<script>
    import postal from 'postal';
    import PostalStore from "../../lib/postalStore";
    import {getListHeader} from "@/ui/views/flight/components/flightTable/handleColumn";
    import _ from 'lodash';
    import ColumnsDefine from './columnDefine'
    import {mapGetters, mapState} from "vuex";
    let postalStore = new PostalStore();
  export default {
    data() {
      return {
        columns: [],
        flights: [],
        showFieldSetting: false,
      }
    },
    components: {
      'toolBar': () =>
        import(/*webpackChunkName:"com-toolBar"*/ './components/toolBar'),
      'flightTable': () =>
        import(/*webpackChunkName:"com-flightTable"*/ './components/flightTable/flightTable'),
      'complex-column': () =>
        import(/*webpackChunkName:"complex-column"*/ './components/complexColumnDom'),
      'fieldSetting': () =>
        import(/*webpackChunkName:"fieldSetting"*/ './components/fieldSetting'),
      'TOBTTooltip': () =>
        import(/*webpackChunkName:"TOBTTooltip"*/ './components/TOBTTooltip'),
    },
    beforeMount() {
      this.setColumns(getListHeader())
    },
    mounted() {

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
      },

      toggleFieldSetting: function (){
        this.showFieldSetting = !this.showFieldSetting
      },

      refreshColumn: function (){
        this.setColumns(getListHeader());
        this.calcColumnWidth(this.flights)
      },

      calcColumnWidth: function (flights){
        let oldC = this.columns;
        _.map(oldC,item => {
          if (item.widthCalc){
            item.width = item.widthCalc.call(null, flights)
          }
        })
        this.columns = oldC
      }
    },
    watch: {
      flights(value){
        this.calcColumnWidth(value)
      }
    },
    computed: {
      // ...mapGetters(['flight/getTOBTVisibility']),
      ...mapState({
        getTOBTVisibility: state => state.flight.showTOBTToolTip
      })
    }
  }
</script>

<style lang="scss">
  #flight{
    padding-left: 15px;
  }
  .flightWrapper{
    height: calc(100% - 50px);
    position: relative;
  }
  .TOBTTooltip{
    width: 301px;
    height: 240px;
    opacity: 1;
    background: #25395c;
    border-radius: 5px;
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.50);
    position: fixed;
    z-index: 10;
    padding: 15px;
    color: #fff;
    top: 0;
    right: 0;
    .tableContainer{
      display: flex;
      align-items: center;
      margin-top: 15px;
      flex-direction: column;
      .tableRow{
        width: 260px;
        height: 36px;
        opacity: 1;
        background: #293756;
        border: 1px solid #45547c;
        display: flex;
        flex-wrap: wrap;
      }
      .contentTableRow{
        background-color: #1d2840;
        border-top: 0;
      }
      .tableItem{
        text-align: center;
        height: 36px;
        line-height: 36px;
        flex: 1;
        border-right: 1px solid #45547c;
      }
      .tabletTitle{
        font-weight: bold;
      }
      //.border-right{
      //    border-right: 1px solid #45547c;
      //}
    }
    .inputRow{
      display: flex;
      justify-content: flex-end;
      .label{
        width: 40px;
        display: inline-block;
        margin-right: 8px;
        margin-top: 12px;
      }
      .default-input{
        width: 214px;
        background-color: #0c172a!important;
      }
    }
    .buttonBox{
      margin-top: 10px;
      text-align: center;
      .btn-small{
        width: 87px!important;
        height: 24px!important;
        line-height: 24px;
        padding: 0;
        font-size: 14px;
        &:first-of-type{
          margin-right: 10px;
        }
      }
    }
  }
</style>
