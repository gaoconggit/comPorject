/**
 *  公用webview
 * 
 */

<template>
    <div>
        <title-bar :title="title" />
        <frameset>
            <frame :src="$route.query.url" />
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
      title: ""
    };
  },
  created() {
    this.title = this.$route.query.title;
  },
  components: {
    TitleBar
  }
};
</script>


