<template>
  <div class="score-wrapper" ref="scoreWrapper">
    <iframe :src="scoreURL" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
  import api from "../../../api/BaseService";

  export default {
    name: "Index",
    data() {
      return {
        scoreURL: ''
      }
    },
    mounted() {
      this._getScoreUrl();
    },
    methods: {
      async _getScoreUrl() {
        let result = await api.getScoreUrl();
        console.log(result);
        this.scoreURL = result.data.url;
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .score-wrapper {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: @tabBarHeight;
  }
</style>
