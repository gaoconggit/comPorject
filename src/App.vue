<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition><transition name="router-fade" mode="out-in">
    <keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </keep-alive>
  </transition>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style lang="less">
  .router-fade-enter-active,.router-fade-leave-active{
    transition: all 0.3s;
  }
  .router-fade-enter,.router-fade-leave-active{
    opacity: 0;
  }
</style>
