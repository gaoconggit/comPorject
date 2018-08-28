<template>
  <div>我是房间详情</div>
</template>

<script>
  import api from "../../api/BaseService";

  export default {
    name: "RoomIndex",
    data() {
      return {
        roomId: 0, //房间ID，通过url传输
        roomInfo: [],       //房间信息
      };
    },
    created() {
      if (!this.$route.query.id) {
        this.$router.push({path: "/"});
      } else {
        this.roomId = this.$route.query.id;
        this._getJoinRoom();
      }
    },
    methods: {
      async _getJoinRoom() {
        let result = await api.getJoinRoom(this.roomId);
        console.log(result);
        if (result.code != 1) {
          this.$router.back();
        }
        this.roomInfo = result.data;
      },
    }
  };
</script>

<style scoped lang="less">
</style>


