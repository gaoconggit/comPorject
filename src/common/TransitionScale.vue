<template>
  <transition name="scale" v-transfer-dom>
    <slot></slot>
  </transition>
</template>

<script>
  import {TransferDom} from 'vux'

  export default {
    name: "TransitionScale",
    directive: {TransferDom}
  }
</script>

<style scoped>
  .scale-enter-active, .scale-leave-active {
    transition: all 0.3s cubic-bezier(.51, -0.33, .52, 1.35);
  }

  .scale-enter-active {
    transform: scale(1, 1);
  }

  .scale-enter, .scale-leave-active {
    transform: scale(0, 0);
  }
</style>
