<template>
  <div>
    <div class="row" v-for="row in data">
      <div v-for="c in columns" :style="{width: pxtorem(c.width) + 'rem'}" class="cell">
        <slot :row="row" :item="c"></slot>
      </div>
    </div>
  </div>

</template>

<script>
import {pxtorem} from "@/ui/lib/viewSize";

export default {
  name: "flightTableRow",
  props: ['data', 'columns'],
  methods:{
    pxtorem:function (px){
      return pxtorem(parseInt(px))
    }
  }
}
</script>

