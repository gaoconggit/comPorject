<!--
** 首页公告展示
-->

<template>
  <transition-scale>
    <div class="public-wrapper" style="z-index: 3;" v-if="isShowPublic">
      <div class="img" @click="clickPublic"><img v-lazy="data[publicIndex].pic" alt=""></div>
      <div class="close" @click="closePublic"><img src="~/img/com_img/close_black.png" alt=""></div>
    </div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";
  import {clickBannerItem} from "../../common/util/Utils";

  export default {
    name: "PublicNotice",
    props: ['data'],
    data() {
      return {
        publicIndex: 0,     //默认展示第一个公告
        isShowPublic: true, //默认展示第一个公告
      }
    },
    methods: {
      clickPublic() {
        let info = {};
        info.slide_url = this.data[this.publicIndex].url;
        info.jump_target = this.data[this.publicIndex].jump_target;
        info.slide_content = '';
        console.log(info);
        let gotoTab = clickBannerItem.call(this, info);
        if (gotoTab != null) {
          this.$emit('change-tab', gotoTab);
        }
        this.$emit('close-public');
      },
      closePublic() {
        this.publicIndex += 1;
        //如果有多个公告轮回弹
        if (this.data[this.publicIndex]) {
          this.isShowPublic = false;
          setTimeout(() => {
            this.isShowPublic = true;
          }, 300)
        } else {
          this.$emit('close-public');
        }
      }
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .public-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img {
      margin-top: -50px;
      width: 500px;
      height: 600px;
      .img-spread;
    }
    .close {
      margin-top: 50px;
      width: 60px;
      height: 60px;
      .img-spread;
    }
  }
</style>
