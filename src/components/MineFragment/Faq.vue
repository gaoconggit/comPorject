<!--
**  常见问题
-->

<template>
  <div>
    <title-bar title="常见问题"/>
    <frameset>
      <frame :src="url"/>
    </frameset>
  </div>
</template>

<script>
  import TitleBar from "@/common/TitleBar";
  import api from "../../api/BaseService";

  export default {
    name: "Faq",
    data() {
      return {
        url: ''
      }
    },
    mounted() {
      this._getSettingFaq();
    },
    methods: {
      async _getSettingFaq() {
        let result = await api.getSettingFaq();
        this.url = result.data.url;
      }
    },
    components: {TitleBar}
  }
</script>

<style scoped>

</style>
