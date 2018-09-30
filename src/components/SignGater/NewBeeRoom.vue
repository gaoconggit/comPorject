<!--
** 新手场房间
-->

<template>
  <transition-scale>
    <div class="new-bee-wrapper" style="z-index: 3">
      <div class="goto-room-img" @click="gotoNewRoom">
        <img src="~/img/sign/newcomer_bg.png" alt="">
      </div>
    </div>
  </transition-scale>
</template>

<script>
  import TransitionScale from "@/common/TransitionScale";
  import api from "../../api/BaseService";
  import {showToast} from "../../common/util/Utils";

  export default {
    name: "NewBeeRoom",
    data() {
      return {
        newBeeData: [],       //新手场房间信息
      }
    },
    mounted() {
      this._getNewBeeRoomInfo();
    },
    methods: {
      async _getNewBeeRoomInfo() {
        let result = await api.getNewBeeRoomInfo();
        if (result.code == 1) {
          if (parseInt(result.data.room_id) < 0) {
            showToast(result.msg, 'cancel');
            setTimeout(() => {
              this.$emit('close-new-bee');
            }, 1500);
          } else {
            this.newBeeData = result.data;
          }
        } else {
          showToast('新手场获取失败', 'cancel');
          setTimeout(() => {
            this.$emit('close-new-bee')
          }, 1500)
        }
      },
      gotoNewRoom() {
        this.$emit('close-new-bee', true)
        this.$router.push({path: '/room', query: {id: this.newBeeData.gift_id, roomId: this.newBeeData.room_id}});
      },
    },
    components: {TransitionScale}
  }
</script>

<style scoped lang="less">
  @import "~assets/style/index.less";

  .new-bee-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: @bgOpacity;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .goto-room-img {
      width: 613px;
      height: 535px;
      .img-spread;
    }
  }
</style>
