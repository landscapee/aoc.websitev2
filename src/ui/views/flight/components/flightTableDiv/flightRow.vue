<template>
  <div>
    <div
        :class="rowClass(row)"
        @mouseenter="$emit('update:hoverId', row.flightId)"
        @click="$emit('update:clickId', row.flightId)"
        @mouseleave="$emit('update:hoverId', '')"
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

export default {
  name: "flightTableRow",
  props: ['data', 'columns', 'hoverId', 'clickId'],
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
      })
    }
  }
}
</script>

