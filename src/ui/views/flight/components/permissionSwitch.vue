<template>
  <div v-if="hasRole">
    <slot></slot>
  </div>
  <div v-else-if="!hasRole">{{'--' }}</div>
</template>

<script>

import {hasRole} from "@/ui/lib/common";

export default {
  name: "permissionSwitch",
  props: ['role', 'noRoleDes'],
  computed:{
    hasRole: function (){
      return hasRole(this.role)
    }
  }
}
</script>

<style scoped>

</style>
