<template>
  <div class="d-flex header">
    <div :style="{width: pxtorem(parseInt(c.width)) + 'rem'}" class="text-center headerItem" v-for="c in columns">
      <i v-if="c.lock" @click="changeLockStatus(c, c.lock)" class="iconfont icon-suoding2 text-yellow font-xs cursor"></i>
      <i v-else class="icon-lock-2 cursor"></i>
      {{c.text}}
      <span @click="changeSort(c.referenceTo || c.key)" :class="classNames('sort',{'d-none': !c.sort})">
        <i :class="classNames('iconfont icon-paixu icon-asc', {'text-blue-009': active(c) && order === 'asc',})" />
        <i :class="classNames('iconfont icon-paixu icon-dsc', {'text-blue-009': active(c) && order === 'desc',})" />

<!--        <i class={descClassName} />-->
      </span>
    </div>
  </div>

</template>

<script>
import {pxtorem} from "@ui_lib/viewSize";
import classNames from 'classnames';
import PostalStore from "@/ui/lib/postalStore";
let postalStore = new PostalStore();
export default {
  name: "flightHeader",
  props: ['columns', 'changeLockStatus', 'activeKey', 'order'],
  methods: {
    pxtorem,
    classNames,
    active(c){
      return this.activeKey === c.key || this.activeKey === c.referenceTo
    },
    changeSort(key) {
      let order;
      if (this.activeKey === key) {
        if (this.order === 'asc') {
          order = 'desc';
        }
        if (this.order === 'desc') {
          order = false;
          key = false;
        }
      } else {
        order = 'asc';
      }
      // let order = this.state.key == key ? (this.state.order == 'asc' ? 'desc' : 'asc') : 'asc';
      let sort = {
        key: key,
        order: order,
      };
      this.$emit('update:activeKey', key)
      this.$emit('update:order', order)
      if (!order && !key) {
        postalStore.pub('Web', 'SendFilterOpt', null)
      } else {
        postalStore.pub('Web', 'SendFilterOpt', sort)
      }
    }
  },
  computed: {

  },
  mounted() {
    postalStore.sub('Web', 'ClearSort', () => {
      this.$emit('update:activeKey', '')
      this.$emit('update:order', '')
    })
  },
  destroyed() {
    postalStore.unsubAll()
  }
}
</script>

<style scoped>

</style>