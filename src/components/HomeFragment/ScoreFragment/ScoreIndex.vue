<template>
  <div class="score-wrapper">
    <frameset>
      <frame :src="scoreURL">
    </frameset>
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

<style scoped>
  .score-wrapper {
    padding-bottom: 48px
  }
</style>
