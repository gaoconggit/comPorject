<!--
** 娃娃列表
-->

<template>
  <div>
    <div class="item-wrap" v-for="(item,index) in data" :key="item.w_id||item.hid" @click="clickItem(item,index)">
      <slot name="left" :item="item"></slot>
      <div class="icon"><img v-lazy="item.gifticon||item.img" alt=""></div>
      <div class="info">
        <p class="name">{{item.giftname||item.name}}</p>
        <p class="time">{{formatTime(item.ctime)}}</p>
      </div>
      <p class="expire-time" v-if="item.expire_time" :class="{'active':item.expire_time<60*60*24}">
        {{formatSeconds(item.expire_time)}}</p>
      <slot name="right" :item="item"></slot>
    </div>
  </div>
</template>

<script>
  import {formatSeconds, getTimeDate} from "./util/Utils";

  export default {
    name: "WawaListItem",
    props: ['data'],
    methods: {
      clickItem(item, index) {
        this.$emit("on-item-click", item, index);
      },
      formatTime(num) {
        return getTimeDate(num);
      },
      formatSeconds(num) {
        return formatSeconds(num)
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .item-wrap {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .icon {
      margin: 0 20px;
      width: 110px;
      height: 110px;
      border-radius: 20px;
      overflow: hidden;
      .img-spread;
    }
    .info {
      flex: 1;
      line-height: 50px;
      color: #000;
      font-size: @mainFontSize;
      .over-ellip;
      .name {
        .over-ellip;
      }
      .time {
        font-size: @subFontSize;
        color: @grayColor;
      }
    }
    .expire-time {
      font-size: @subFontSize;
      color: #000;
      &.active {
        color: @mainColor;
      }
    }
  }
</style>
