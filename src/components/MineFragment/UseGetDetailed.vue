/**
* 金币，积分明细
*/

<template>
  <div>
    <title-bar :title="title"/>
  </div>
</template>

<script>
  import TitleBar from "@/common/TitleBar";

  export default {
    name: "CoinDetailed",
    data() {
      return {
        title: this.$route.name,
        type: this.$route.path.replace(/\//g, ''),         //是金币还是积分
      }
    },
    mounted() {
    },
    methods: {},
    components: {
      TitleBar,
    }
  }
</script>

<style scoped>

</style>
