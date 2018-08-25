<template>
    <div>我是房间详情</div>
</template>

<script>
export default {
  name: "RoomIndex",
  data() {
    return {
      roomId: 0, //房间ID，通过url传输
    };
  },
  created() {
    if (!this.$route.query.id) {
      this.roomId = this.$route.query.id;
      this.$router.push({ path: "/" });
    }
  },
  methods: {}
};
</script>

<style scoped lang="less">
</style>


