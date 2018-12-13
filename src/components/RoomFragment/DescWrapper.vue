<template>
  <div class="desc-wrapper">
    <tab v-model="index" active-color='#000'>
      <tab-item class="tab-item" selected @on-item-click="onItemClick">娃娃详情</tab-item>
      <tab-item class="tab-item" @on-item-click="onItemClick">最近抓中记录</tab-item>
    </tab>
    <swiper ref="descSwiper" class="desc-swiper" v-model="index" :show-dots="false" @on-index-change="onItemClick">
      <swiper-item ref="imgWrapper">
        <div class="img-wrapper" ref="imgBox">
          <p v-if="Number(addscore)" class="need-coin">抓取失败，免费获得积分： <span>{{addscore}}</span></p>
          <img class="img-item" v-for="img in imgs" :src="img" alt="">
        </div>
      </swiper-item>
      <swiper-item ref="historyWrapper">
        <ul class="history-wrapper" ref="historyBox">
          <li v-for="item in history" class="history-item">
            <div class="avatar">
              <img :src="item.avatar_thumb" alt="">
            </div>
            <div class="info">
              <p class="name">{{item.user_nicename}}</p>
              <p class="time">{{formatTime(item.ctime)}}</p>
            </div>
          </li>
        </ul>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import {Tab, TabItem, Swiper, SwiperItem} from "vux";
  import {getTimeDate} from "@/common/util/Utils"

  export default {
    name: "DescWrapper",
    props: ['history', 'imgs', 'addscore'],
    data() {
      return {
        index: 0,
        list2: [1, 2, 3]
      }
    },
    watch: {
      history() {
        this.$nextTick(() => {
          let descSwiper = this.$refs.descSwiper.$el;
          let historyWrapper = this.$refs.historyWrapper.$el;
          let imgWrapper = this.$refs.imgWrapper.$el;
          let imgBox = this.$refs.imgBox.clientHeight;
          let historyBox = this.$refs.historyBox.clientHeight;
          let maxHeight = historyBox > imgBox ? historyBox : imgBox;
          historyWrapper.style.height = historyBox + 'px';
          imgWrapper.style.height = imgBox + 'px';
          descSwiper.style.height = maxHeight + 'px';
        })
      }
    },
    methods: {
      onItemClick(index) {
        this.index = index;
      },
      formatTime(num) {
        return getTimeDate(num);
      }
    },
    components: {
      Tab, TabItem, Swiper, SwiperItem
    }
  }
</script>

<style lang="less">
  @import "~assets/style/index.less";

  @roomTabHeight: 80px;
  .desc-wrapper {
    margin: 0 auto;
    width: 710px;
    border-radius: 40px;
    overflow: hidden;
    .vux-tab-wrap {
      padding: 0 !important;
      height: @roomTabHeight !important;
    }
    .vux-tab-container {
      height: @roomTabHeight !important;
    }
    .vux-tab {
      height: @roomTabHeight !important;
    }
    .tab-item {
      height: @roomTabHeight !important;
      line-height: @roomTabHeight !important;
      font-size: @mainFontSize !important;
    }
    .desc-swiper {
      .vux-swiper {
        height: 100% !important;
      }
      .vux-swiper-item {
        background-color: @whiteColor
      }
      .need-coin {
        padding: 20px 0;
        text-align: center;
        font-size: @subFontSize;
        color: #000;
        span {
          font-weight: 600;
        }
      }
      .img-item {
        width: 100%;
      }
      .history-item {
        padding: 20px;
        display: flex;
        align-items: center;
        .avatar {
          margin: 0 20px;
          width: 100px;
          height: 100px;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          overflow: hidden;
          .img-spread;
        }
        .info {
          flex: 1;
          overflow: hidden;
          p {
            line-height: 50px;
            font-size: @mainFontSize;
            color: #000;
            &.name {
              width: 100%;
              .over-ellip;
            }
            &.time {
              font-size: @subFontSize;
              color: @grayColor;
            }
          }
        }
      }
    }
  }
</style>
