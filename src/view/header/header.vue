<template>
  <div class="mheader">
    <!-- 导航图片 -->
    <div class="logoDiv">
      <!-- <img class="logo" src="/static/images/logo.png"> -->
      用户管理系统
    </div> 
    <!-- 左按钮 -->
    <div class="icon" style="left:199px;background:#2ea8e0;display:none;" @click="le" id="iconl">
       <img src="/static/images/leftjt.png">
    </div>
    <!-- 导航内容 -->
    <div class="wrap" ref="wrapRef" style="position:relative;left:198px;">
      <!-- 具体菜单内容 -->
      <div class="navContain" ref="contains" style="left:0px;">
        <nobr>
          <el-menu 
            router 
            unique-opened 
            ref="navbar"
            mode="horizontal"
            active-text-color="#ffd04b"
            :default-active="onRoutes"
            @select="selectMenu">
            <el-menu-item is="nav-item" v-for="(item, n) in datas" :item="item" :navIndex="String(n)" :key="n"></el-menu-item>
          </el-menu>
        </nobr>
      </div>
    </div>
    <!-- 右按钮 -->
    <div class="icon" style="right:124px;background:#4fc9ed;display:none;" @click="ri" id="iconr">
       <img src="/static/images/rightjt.png">
    </div>
    <div class="backIcon" @click="backLoin">
      <img src="../../../static/images/backLoin.png">
      <span>返回首页</span>
    </div>
  </div>
</template>

<script>
import NavItem from '@/view/navItem'
import appContant from '../../util/constant.js'
import systemManageHttp from '../systemManage/systemManage_ser'
  export default {
    data() {
      return {
        datas:[], 
        userInf: {}
      };
    },

    mounted () {
      this.request();
    },
    methods: {
      request(){
        setTimeout(() => {
          this.userInf = JSON.parse(localStorage.getItem("userInf"));
          systemManageHttp.getNavTree({
            reqFlag: '04',
            validFlag: '1',
            recursiveFlag: '1',
            limitIdsList: this.userInf.resIdsList
          }).then(res=>{
            if(res.data){
              this.datas = res.data.data;
              this.bbb();
            }
          })
        }, 300);
      },
      bbb(){
          setTimeout(function(){
            if($('.navContain').width()>$('.wrap').width()){
              $('.icon').css('display','block');
              $('.wrap').width($('.wrap').width()-60);
              $('.wrap').css('left','229px');
            }else{
              this.aaa = false;
            }
          },100);

        },
      selectMenu(index, indexPath){
        /**
         * 在选择父级菜单时自动关闭其下所有子菜单
         * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
         * 关闭位于当前打开菜单中该索引值之后的全部菜单
         */
        // 获取当前打开的所有菜单
        let openMenu = this.$refs.navbar.openedMenus.concat([])
        // 获取点击菜单的父级index，如果当前点击的是根节点，则直接关闭所有打开菜单
        let nowMenuPath = indexPath.length > 1 ? indexPath[indexPath.length-2] : ""
        if(nowMenuPath){
          // 获取父级index在数组中索引，关闭其后所有的菜单
          let menuIndex = openMenu.indexOf(nowMenuPath)
          openMenu = openMenu.slice(menuIndex+1)
        }
        openMenu = openMenu.reverse()
        openMenu.forEach((ele) => {
          this.$refs.navbar.closeMenu(ele)
        })
      },
      backLoin(){
        window.location.href = appContant.platform + "/#/workbench";
      },
      le(){
          if($('.navContain').width()<=$('.wrap').width()){
            $('#iconl').attr("disabled",true);
          }else{
            if(parseInt(this.$refs.contains.style.left) == ($('.wrap').width()-$('.navContain').width()) || parseInt(this.$refs.contains.style.left) < ($('.wrap').width()-$('.navContain').width()) ){
              $('#iconl').attr("disabled",true);
            }else{
              this.$refs.contains.style.left = parseFloat(this.$refs.contains.style.left) - 150 + "px";
            }
          }
        },
       ri(){
        if($('.navContain').width()<=$('.wrap').width()){
            $('#iconr').attr("disabled",true);
          }else if($('.navContain').width()>$('.wrap').width()){
            if(this.$refs.contains.style.left == '0px' || this.$refs.contains.style.left > '0px'){
              $('#iconr').attr("disabled",true);  
             }else{
              this.$refs.contains.style.left = parseFloat(this.$refs.contains.style.left) + 150 + "px";
             }
          }
        },
    },
    computed: {
      onRoutes(){
          return this.$route.resUrl
      },
    },
    components: {
      NavItem,
    },
  };
</script>


<style scoped>
  .mheader{
    width: 100%;
    min-width: 1366px;
    height: 50px;
    line-height: 50px;
    /* background: #20a0ff; */
    background-image: url(/static/images/daoLogo.png);
    background-size: 100% 100%;
    background-repeat: repeat-y;
   /*  background-image:linear-gradient(-62deg, #3196e4 0%, #1f64b4 36%, #0f3889 100%); */
    font-size: 30px;
    color: white;
    position: relative;
  }
  .mheader .logoDiv{
    float: left;
    height: 50px;
    border-right: 1px solid #bfcbd9;
    /* background: rgba(69,115,227,.2); */
    background: rgb(51, 158, 225);
    font-size: 18px;
    color:#fff;
    padding:0 33px;
    line-height: 50px;
    letter-spacing: 2px;
    position: absolute;
    z-index: 2000;
  }
  .wrap{
    width: calc( 100% - 324px );
    height: 100%;
    float: left;
    /* background: pink; */
  }
  /* .mheader .logoDiv .logo{
    width: 58px;
    height: 34px;
    margin:15px 0 21px 28px;
  } */
  /* 导航内容 */
  .mheader .navContain{
    /* width: calc( 100% - 300px );
    float: left;
    height: 70px; */
    height: 50px;
    position: absolute;
  }
  .mheader .backIcon{
    /* width: 60px;
    padding: 0 20px;
    line-height: 70px;
    float: right;
    cursor: pointer; */
    width: 60px;
    padding: 0 16px;
    height: 50px;
    line-height: 40px;
    background: #4fc9ed;
    position: absolute;
    right: 0px;
    width: 124px;
    z-index: 200;
    cursor: pointer;
  }
  .mheader .backIcon img{
    float: left;
    padding: 14px 5px 0 0;
  }
  .mheader .backIcon span{
    font-size: 14px;
  }
  .icon {
    width: 30px;
    height: 50px;
    position: absolute;
    color: blue;
    z-index: 210;
    line-height: 40px;
    text-align: center;
    /* float: left; */
  }
   /*.mheader .navContain .el-menu div:nth-of-type(1){
    margin-left: 108px; 
  }*/
  .mheader .navContain .el-menu div {
    width: auto;
    display: inline-block;
    height: 50px;
    float: left;
  }
</style>
