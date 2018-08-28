<template>
  <div class="score-wrapper" :style="'padding-bottom:' + tabHeight + 'px'">
    <frameset>
      <frame :src="scoreURL">
    </frameset>
  </div>
</template>

<script>
  import api from "../../../api/BaseService";

  export default {
    name: "Index",
    props: ['tabHeight'],
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
