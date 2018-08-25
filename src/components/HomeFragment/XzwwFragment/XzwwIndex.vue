<template>
  <div class="xzww-wrapper" :style="'bottom:' + tabHeight + 'px'">
    <frameset>
      <frame src="https://www.baidu.com" />
    </frameset>
  </div>
</template>

<script>
export default {
  name: "XzwwIndex",
  props: ["tabHeight"]
};
</script>

<style scoped lang="less">
.xzww-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
