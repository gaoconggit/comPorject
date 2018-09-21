<template>
  <div class="xzww-wrapper" :style="'bottom:' + tabHeight + 'px'">
    <!--frameset html框架
      被用来组织一个或者多个 <frame> 元素。每个 <frame> 有各自独立的文档。
    -->
    <frameset>
      <frame :src="xzwwURL" />
    </frameset>
  </div>
</template>

<script>
import {baseUrl} from "../../../config/config";

export default {
  name: "XzwwIndex",
  props: ["tabHeight"],
  data(){
    return {
      xzwwURL: `${baseUrl}spinning_wawa/index.php`,       //旋转娃娃地址
    }
  }
};
</script>

<style scoped lang="less">
.xzww-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
