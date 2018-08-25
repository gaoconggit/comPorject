/**
 *  扭蛋列表
 *
 */
 <template>
     <div class="list-wrapper">
         <grid :cols="2">
             <grid-item
             v-for="item in niudanList"
             :key="item.id"
             @on-item-click="joinNiuDan(item)"
             >
                 
             </grid-item>
         </grid>
     </div>
 </template>

 <script>
import { Grid, GridItem } from "vux";
export default {
  name: "ListNiuDan",
  props: ["niudanList"],
  methods: {
    joinNiuDan(item) {
      console.log(item);
    }
  },
  components: {
    Grid,
    GridItem
  }
};
</script>
 
 <style scoped lang="less">
.list-wrapper {
}
</style>
 