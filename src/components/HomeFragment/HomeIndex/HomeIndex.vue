<template>
  <div>
    <scroller
      class="scroller" lock-x use-pullup use-pulldown
      v-model="scrollStatus"
      @on-pulldown-loading="onPulldownLoading"
      @on-pullup-loading="onPullupLoading"
      height="-50"
      ref="scrollerEvent">
      <div class="box2">
        <header>
          <router-link class="name" :to="{path:'/my',query:{}}">我的</router-link>
          <router-link :to="{path:'/recharge',query:{}}">我的金币</router-link>
        </header>
        <p v-for="i in 60">placeholder {{i}}</p>
        <p v-show="scrollStatus.pullupStatus === 'disabled'" class="no-more">没有更多房间了哟~</p>
      </div>
      <!--下拉刷新-->
      <div slot="pulldown"
           class="xs-plugin-pulldown-container xs-plugin-pulldown-down">
        <x-icon v-show="scrollStatus.pulldownStatus!=='loading'" type="ios-arrow-up"
                :class="{'rotate': scrollStatus.pulldownStatus === 'down'}"></x-icon>
        <span v-show="scrollStatus.pulldownStatus === 'loading'">
            <load-more tip="正在刷新" class="loadmore"></load-more>
          </span>
      </div>
      <!--上拉加载更多-->
      <div v-show="scrollStatus.pullupStatus !== 'disabled'" slot="pullup"
           class="xs-plugin-pullup-container xs-plugin-pullup-up">
        <x-icon v-show="scrollStatus.pullupStatus!=='loading'" type="ios-arrow-down"
                :class="{'rotate': scrollStatus.pullupStatus === 'down'}"></x-icon>
        <span v-show="scrollStatus.pullupStatus === 'loading'">
            <load-more :tip="scrollStatus.pullupText" class="loadmore"></load-more>
          </span>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {Scroller, LoadMore} from "vux";
  import api from "../../../api/BaseService";

  export default {
    name: "HomeIndex",
    data() {
      return {
        scrollHeight: '600px',
        scrollStatus: {
          pullupStatus: 'default',
          pulldownStatus: 'default',
          pullupText: '拼命加载中'
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.scrollerEvent.reset({top: 0})
      });
      this._getBanner();
      // this._getCategory();
    },
    methods: {
      async  _getBanner() {
        let result = await api.getBanner();
        console.log(result);
      },
      async  _getCategory() {
        let result = await api.getCategory();
        console.log(result);
      },
      onPulldownLoading() {
        console.log(2)
        setTimeout(() => {
          this.$refs.scrollerEvent.enablePullup();
          this.$refs.scrollerEvent.donePulldown();
        }, 3000)
      },
      onPullupLoading() {
        console.log(3)
        setTimeout(() => {
          console.log("没有更多房间了哟");
          this.$refs.scrollerEvent.disablePullup();
        }, 3000)
      }
    },
    components: {
      Scroller, LoadMore
    }
  }
</script>

<style scoped lang="less">
  @import "../../../assets/style/index.less";

  .name {
    .font-dpr(16px);
  }

  [data-dpr="2"] .name {
    font-size: 20px;
  }

  .loadmore {
    margin: 0 auto 5px !important;
    span {
      color: #b7bbbf;
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

  .no-more {
    text-align: center;
    line-height: 30px;
    .font-dpr(14px);
  }
</style>
