<template>
  <div class="workbench">
    <!-- <myHead></myHead> -->
    <div class="main">
      <!-- 左边 -->
      <div class="main_left">
        <h2>
          <i class="el-icon-edit"> </i>常用 </h2>
      </div>
      <div class="main_right">
        <!-- 中间 -->
        <div class="main_right_task">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template slot="title">
                <i class="el-icon-menu"></i> 待办任务
              </template>
              <div class="waitting"></div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <!-- 右边 -->
        <div class="main_right_work">
          <!-- 工作通知 -->
          <div class="workbench_right_top">
            <el-collapse v-model="activeNames1">
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="el-icon-menu"></i> 工作通知
                  <!-- <i class="el-icon-refresh"></i> -->
                  <span @click.stop="more" class="moreC"> 更多 </span>
                  <i class="el-icon-refresh"></i>
                </template>
              </el-collapse-item>
            </el-collapse>
          </div>
          <!-- 公司动态 -->
          <div class="workbench_right_bottom">
            <el-collapse v-model="activeNames2">
              <el-collapse-item name="1">
                <template slot="title" class="border_top_bottom">
                  <i class="el-icon-menu"></i> 公司动态
                  <span @click.stop="more" class="moreC"> 更多 </span>
                  <i class="el-icon-refresh"></i>
                </template>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  //import myHead from "../header/header.vue"
  import appContant from "../../util/constant.js"
  export default {
    data() {
      return {
        activeNames: ['1'],
        activeNames1: ['1'],
        activeNames2: ['1']
      }
    },
    mounted() {
      this.setUserInf();
    },
    methods: {
      // 获取用户信息并存储在本地 
      setUserInf(){
        this.get(appContant.platform + "/remote/user/getUserInfo").then(res => {
          localStorage.setItem("userInf", JSON.stringify(res.data));
        })
      },
    },
    /*components: {
      myHead
    },*/
  }

</script>
<style scoped>
  /* public 部分 */

  .moreC {
    float: right;
    margin-right: 35px;
  }

  .border_top_bottom {
    border-top: 1px solid gray;
  }
  /* 大框  */

  .workbench {
    background: #ededed;
    width: 100%;
  }
  .workbench .main {
    height: calc( 100% - 40px);
    overflow: hidden;
    background: #ededed;
    /* min-width: 1366px; */
  }
  /* main */

  .main .main_left,
  .main .main_right {
    float: left;
  }
  /* 左边-常用 */

  .main .main_left {
    height: 100%;
    width: 148px;
    background: white;
    text-align: center;
    padding-top: 10px;
  }

  .main .main_left h2 {
    font-size: 16.5px;
    margin-top: 3px;
  }
  /* 右边-折叠面板 */

  .main .main_right {
    width: calc( 100% - 148px);
    background: white;
    height: 100%;
  }
  /* 代办任务 */

  .main_right .main_right_task{
    float: left;
    width: 50%;
    height: 100%;
    padding: 19px 20px 0 20px;
    /* background: black; */
    background: #ededed;
  }
  .main_right .main_right_work {
    float: left;
    width: 50%;
    height: 100%;
    padding: 19px 20px 0 0px;
    /* background: black; */
    background: #ededed;
  }

  .waitting {
    /* height:800px; */
    background: red;
  }
  .workbench .el-collapse {
    margin-bottom: 10px;
  }
  .workbench_right_top,.workbench_right_bottom{
    height: 43vh;
  }

  @media screen and (min-width: 1366px) {}

</style>
