<template>
  <grid :cols="2" :show-lr-borders="false" :show-vertical-dividers="false" class="grids">
    <grid-item class="grid" v-for="item in data" :key="Math.random()" @on-item-click="clickItem(item)">
      <div class="item-icon">
        <img v-lazy="item.icon">
      </div>
    </grid-item>
  </grid>
</template>

<script>
  import {mapGetters} from "vuex";
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
          if (item.jump_target === 'wheelgame') {
            this.$router.push({
              path: '/wheel',
              query: {title: '小游戏', full: 1, url: `?base_url=${baseUrl}api/public/&token=${this.token}&uid=${this.uid}`}
            })
          } else {
            this.$router.push({
              path: '/details',
              query: {title: '小游戏', full: 1, url: item.url}
            })
          }
        } else {
          if (item.jump_target === 'wheelgame') {
            this.$router.push({
              path: '/wheel',
              query: {title: '小游戏', full: 1, url: `?base_url=${baseUrl}api/public/&token=${this.token}&uid=${this.uid}`}
            })
          } else {
            this.$router.push({
              path: '/wheel',
              query: {title: '小游戏', full: 1, url: `${baseUrl}${item.url}`}
            })
          }
        }
      }
    },
    computed: {
      ...mapGetters(['token', 'uid'])
    },
    components: {Grid, GridItem}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .grids {
    &::before {
      border: none;
    }
    .grid {
      padding: 0;
      color: @whiteColor;
      border: none;
      &::after {
        border: none;
      }
      .item-icon {
        margin: auto;
        width: 356px;
        height: 436px;
        .img-spread;
      }
    }
  }
</style>
