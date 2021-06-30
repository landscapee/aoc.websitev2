<template>
  <div v-if="hasRole">
    <slot></slot>
  </div>
  <div v-else-if="!hasRole">{{noRoleDes || '--' }}</div>
</template>

<script>

import {hasRole} from "@/ui/lib/common";

export default {
  name: "permissionSwitch",
  props: ['role', 'noRoleDes'],
  computed:{
    hasRole: function (){
      return hasRole(this.role, false)
    }
  }
}
</script>

<style scoped>

</style>
