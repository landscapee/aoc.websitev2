<template>
  <div>
    <div
        :class="rowClass(row)"
        @mouseenter="$emit('update:hoverId', row.flightId)"
        @click="$emit('update:clickId', row.flightId)"
        @mouseleave="$emit('update:hoverId', '')"
        @contextmenu.prevent="contextMenu($event, row)"
        @click.alt="altClick(row)"
        v-for="row in data"
    >
      <div v-for="c in columns" :style="{width: pxtorem(c.width) + 'rem'}" class="cell">
        <slot :row="row" :item="c"></slot>
      </div>
    </div>
  </div>

</template>

<script>
import {pxtorem} from "@/ui/lib/viewSize";
import classNames from "classnames";
import {getFlightDelayWarn} from "@/lib/helper/flight";
import PostalStore from "@/ui/lib/postalStore";
let postalStore = new PostalStore();
export default {
  name: "flightTableRow",
  props: ['data', 'columns', 'hoverId', 'clickId', 'checkFlightId'],
  methods:{
    pxtorem:function (px){
      return pxtorem(parseInt(px))
    },
    rowClass: function (row){
      let {movement, flightId} = row;
      let departWarn = getFlightDelayWarn(row);
      let A = movement == 'A';
      let D = movement == 'D';
      let hover = flightId === this.hoverId
      let click = flightId === this.clickId
      return classNames('row', {
        active:hover || click,
        bgA:A,
        bgD:D,
        departWarnGreen: departWarn === 'departWarnGreen',
        departWarnRed: departWarn === 'departWarnRed',
        departWarnYellow: departWarn === 'departWarnYellow',
        departWarnOrange: departWarn === 'departWarnOrange',
        checkedFlight: this.checkFlightId.indexOf(flightId) > -1
      })
    },
    contextMenu: function (e, flight){
      postalStore.pub('Web', 'OnContextMenu', {event:e, flight})
    },
    altClick(f){
      postalStore.pub('Web', 'OnAltClick', f)
    }
  }
}
</script>

