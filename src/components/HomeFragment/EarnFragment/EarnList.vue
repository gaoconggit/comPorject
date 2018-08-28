<template>
  <grid :cols="2" :show-lr-borders="false" :show-vertical-dividers="false">
    <grid-item v-for="item in data" :key="Math.random()" @on-item-click="clickItem(item)">
      <div class="item-icon">
        <img v-lazy="item.icon">
      </div>
    </grid-item>
  </grid>
</template>

<script>
  import {Grid, GridItem} from "vux";
  import {baseUrl} from "../../../config/config";

  export default {
    name: "EarnList",
    props: ['data'],
    data() {
      return {}
    },
    methods: {
      clickItem(item) {
        console.log(item);
        if (/http:\/\//.test(item.url)) {
          this.$router.push({path: '/details', query: {title: '小游戏', full: 1, url: item.url}})
        } else {
          this.$router.push({path: '/details', query: {title: '小游戏', full: 1, url: `${baseUrl}${item.url}`}})
        }
      }
    },
    components: {Grid, GridItem}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .weui-grids {
    &::before {
      border: none;
    }
    .weui-grid {
      padding: 0;
      color: @whiteColor;
      border: none;
      &::after {
        border: none;
      }
      .item-icon {
        margin: auto;
        width: 356/2px !important;
        height: 436/2px !important;
        .img-spread;
      }
    }
  }
</style>
