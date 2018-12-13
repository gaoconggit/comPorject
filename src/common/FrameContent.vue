/**
*  公用webview
*  路由：details
*/

<template>
  <div>
    <title-bar :title="title"/>
    <frameset>
      <frame :src="$route.query.url"/>
    </frameset>
  </div>
</template>

<script>
  import TitleBar from "@/common/TitleBar";

  export default {
    name: "FrameContent",
    data() {
      return {
        url: this.$route.query.url, //展示的url
        title: "活动详情"
      };
    },
    components: {
      TitleBar
    },
    watch: {
      $route() {
        if (/^\/details/.test(this.$route.path)) {
          this.title = this.$route.query.title;
        }
      }
    }
  };
</script>


