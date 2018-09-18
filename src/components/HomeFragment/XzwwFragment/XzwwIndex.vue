<template>
  <div class="xzww-wrapper">
    <iframe v-if="production" ref="iframe" src="../../../../static/web/web-mobile/index.html"></iframe>
    <iframe v-else src="./static/web/web-mobile/index.html"></iframe>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {baseUrl, URL} from "../../../config/config";

  export default {
    name: "XzwwIndex",
    props: ["tabHeight"],
    data() {
      return {
        production: process.env.NODE === 'production' ? true : false,
      }
    },

    mounted() {
      console.log(2)
      window.postMessageXzww = (d) => {
        console.log('ready', d)
        window.dispatchEvent(new Event(d));
      }

      window.addEventListenerXzww = (d, fn) => {
        window.addEventListener(d, fn);
      }

      window.addEventListener('ready', () => {
        this.sentMsg('info', [baseUrl, this.uid, this.token])
      })
      window.addEventListener('message', (data) => {
        console.log(5, data);
      })
    },

    methods: {
      sentMsg(name, data) {
        let a = new CustomEvent('message', {detail: JSON.stringify([name, data])});
        window.dispatchEvent(a);
      }
    },

    computed: {
      ...mapGetters(['token', 'uid'])
    }
  };
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .xzww-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: @tabBarHeight;
    width: 100%;
    iframe {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>
