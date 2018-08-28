<template>
  <scroller
    class="scroller" lock-x use-pullup use-pulldown :scrollbarY="scrollbarY"
    v-model="status"
    @on-pulldown-loading="onPulldownLoading"
    @on-pullup-loading="onPullupLoading"
    @on-scroll-bottom="onScrollBottom"
    @on-scroll="onScroll"
    :scroll-bottom-offset="scrollBottomOffset"
    :height="tabHeight + ''"
    ref="scroller">
    <div>
      <slot></slot>
      <p class="bottom-text" v-show="status.pullupStatus === 'disabled' && showBottom.isShow">没有更多娃娃了哟~</p>
    </div>
    <!--下拉刷新-->
    <div slot="pulldown"
         class="xs-plugin-pulldown-container xs-plugin-pulldown-down">
      <x-icon v-show="status.pulldownStatus!=='loading'" type="ios-arrow-up"
              :class="{'rotate': status.pulldownStatus === 'down'}"></x-icon>
      <span v-show="status.pulldownStatus === 'loading'">
            <load-more tip="正在刷新" class="loadmore"></load-more>
          </span>
    </div>
    <!--上拉加载更多-->
    <div v-show="status.pullupStatus !== 'disabled'" slot="pullup"
         class="xs-plugin-pullup-container xs-plugin-pullup-up">
      <x-icon v-show="status.pullupStatus!=='loading'" type="ios-arrow-down"
              :class="{'rotate': status.pullupStatus === 'down'}"></x-icon>
      <span v-show="status.pullupStatus === 'loading'">
            <load-more :tip="status.pullupText" class="loadmore"></load-more>
          </span>
    </div>
  </scroller>
</template>

<script>
  import {Scroller, LoadMore} from "vux";

  export default {
    name: "ScrollView",
    props: {
      scrollbarY: {
        //是否显示垂直滚动条
        type: Boolean,
        default: true
      },
      scrollBottomOffset: {
        //距离底部多少距离时触发事件
        type: Number,
        default: 10
      },
      tabHeight: {
        //scroll距离底部距离
        type: Number,
        default: 0
      },
      showBottom: {
        //是否显示无更多数据提示文字
        type: Object,
        default: () => {
          return {
            isShow: false,
            text: "没有更多东西了~"
          };
        }
      }
    },
    data() {
      return {
        status: {
          pullupStatus: "default",
          pulldownStatus: "default",
          pullupText: "拼命加载中"
        }
      };
    },
    methods: {
      onPulldownLoading() {
        this.$emit("on-pulldown-loading");
      },
      onPullupLoading() {
        this.$emit("on-pullup-loading");
      },
      onScrollBottom() {
        this.$emit("on-scroll-bottom");
      },
      onScroll(pos) {
        this.$emit("on-scroll", pos);
      },
      reset(param, duration, easing) {
        this.$refs.scroller.reset(param, duration, easing);
      },
      donePullup() {
        this.$refs.scroller.donePullup();
      },
      donePulldown() {
        this.$refs.scroller.donePulldown();
      },
      enablePullup() {
        this.$refs.scroller.enablePullup();
      },
      disablePullup() {
        this.$refs.scroller.disablePullup();
      }
    },
    components: {
      Scroller,
      LoadMore
    }
  };
</script>

<style lang="less">
  .scroller {
    .bottom-text {
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 14px;
    }
    .loadmore {
      margin: 0 auto 5px !important;
      span {
        color: #000;
      }
    }

    .rotate {
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
    }

    .pullup-arrow {
      display: block;
      transition: all linear 0.2s;
      -webkit-transition: all linear 0.2s;
      color: #666;
      font-size: 25px;
    }

    .xs-plugin-pulldown-down {
      position: absolute;
      width: 100%;
      height: 30px;
      line-height: 30px;
      top: -30px;
      text-align: center;
    }
  }
</style>
