<template>
  <swiper :aspect-ratio="300/668" ref="swiper" loop auto dots-position="center" dots-class="dots_item" index="0">
    <swiper-item v-for="banner in data" :key="Math.random()" @click.native="swiperItem(banner)">
      <img :src="banner.slide_pic" alt="">
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from "vux";

  export default {
    name: "SwiperList",
    props: ['data'],
    methods: {
      swiperItem(item) {
        this.$emit('swiper-item', item);
      },
      xheight() {
        return this.$refs.swiper.xheight;
      }
    },
    components: {
      Swiper, SwiperItem
    }
  }
</script>

<style lang="less">
  @import "~assets/style/index.less";

  .vux-slider {
    // height: 334/2px;
    .vux-swiper {
      // height: 100% !important;
      .vux-swiper-item {
        .img-spread;
      }
    }
    .dots_item {
      .vux-icon-dot {
        width: 10px !important;
        height: 10px !important;
        border-radius: 20px !important;
        &.active {
          width: 20px !important;
          background-color: #ff8dac !important;
        }
      }
    }
  }
</style>
