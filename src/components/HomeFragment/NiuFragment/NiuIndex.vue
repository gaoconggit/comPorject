<template>
  <div>我是扭蛋
    <a href="javascript:;" @click="changTab">改变tab</a>
    <router-link :to="{path:'/recharge',query:{}}">我的金币</router-link>
  </div>
</template>

<script>
  import api from "../../../api/BaseService";

  export default {
    name: "Index",
    mounted() {
      this._getBanner();
    },
    methods: {
      async _getBanner() {
        let result = await api.getBanner();
        console.log(result);
      },
      changTab() {
        this.$emit("changeTab", 0);
      }
    }
  }
</script>

<style scoped>

</style>
