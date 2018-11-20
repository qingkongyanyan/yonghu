<template>
  <div id="app">
    <myHead></myHead>
    <!-- <img src="../static/img/20171122102421.png" width="100%"> -->
    <keep-alive>
      <router-view class="Abody" ref="ddd"></router-view>
    </keep-alive>
    <!-- <div v-show="false" > </div> -->
    <bottomWord class="fottt"></bottomWord>
  </div>
</template>
<script>
import myHead from "./view/header/header"
import bottomWord from "./view/bottomWord"
export default {
  methods: {
    loadpage() {
      this.$store.state.visitedViews = [{
        name: '工作台',
        path: '/workbench',
      }];
      this.$router.push({
        path: '/workbench',
      });
    },
  },
  mounted() {
    window.onbeforeunload = this.loadpage();
  },
  components: {
    bottomWord,
    myHead
  }
}

</script>
<style>
@import "../static/css/common.css";
@import "../static/css/element_UI.css";
@import "../static/css/base.css";
.header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #20a0ff;
}
.fottt {
    position: absolute;
    left: 0;
    bottom: 1px;
    background: #e0eeff;
    height: 39px;
    z-index: 2;
  }
</style>
