<template>
  <div class="tag">
    <div ref='tag_wrap' class="tagWrap">
      <div ref='tag_ref' class="tag_Ref" :style="{left:activeLeft+'px'}">
        <nobr>
          <div :class="[isActive(tag)?'active':'','pai']" :key="ind" v-for="(tag,ind) in visitedViews">
            <router-link :to='tag.path' ref="tag_self">
              <p class="button_bottom">
                <span @click.stop.prevent="handleClose(tag,$event)" :class="[(isActive(tag)&&tag.name!='工作台')?'spanActive':'close_tag','el-icon-close']"> </span> {{tag.name}}
              </p>
            </router-link>
          </div>
        </nobr>
      </div>
    </div>
    <div class="rightBtn Btn" @click="rightMove">
      <i class="el-icon-arrow-right "></i>
    </div>
    <div class="leftBtn Btn" @click="leftMove">
      <i class="el-icon-arrow-left "></i>
    </div>
  </div>
</template>

<style>
  .tag {
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.11px;
    width: 100%;
    min-width: 1366px;
    height: 39px;
  }

  .tagWrap {
    width: 100%;
    height: 39px;
    position: absolute;
    overflow: hidden;
  }

  .tag_Ref {
    position: absolute;
    left: 30px;
  }

  .button_bottom {
    /* display: inline-block; */
    margin-right: 2px;
    padding: 9px 22px 9px 9px;
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
    color: #ffffff;
    /* background: rgba(0, 119, 255, 0.5); */
    background: rgba(0, 119, 255, 0.5);
    box-shadow: 0 10px 20px 0 #b7d8ff;
    position: relative;
  }

  .button_bottom:hover {
    background: white;
    color: rgb(0, 119, 255);

  }

  a:hover {
    text-decoration: none;
  }

  .tag_bottom {
    margin-right: 2px;
    padding: 9px;
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
    color: #ffffff;
    background: rgba(0, 119, 255, 0.5);
    box-shadow: 0 10px 20px 0 #b7d8ff;
  }

  .tag_bottom:hover {
    background: white;
    color: rgb(0, 119, 255)
  }

  .bottom_sy {
    border-radius: 3px;
    color: #ffffff;
    background: rgba(0, 119, 255, 0.5);
    box-shadow: 0 10px 20px 0 #b7d8ff;
  }

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .pai {
    display: inline-block
  }

  .active {
    /* opacity: 1; */
    background: rgba(0, 119, 255,0.8);
  }
  .spanActive{
    display: block !important;
    position: absolute;
    right: 5px;
    font-size: 12px;
    top: 5px;
  }

  .close_tag {
    position: absolute;
    right: 5px;
    font-size: 12px;
    top: 5px;
    display: none !important;
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 30;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  }

  .contextmenu li {
    cursor: pointer;
    border: 2px solid green;
    margin-top: 3px;
  }

  .Btn {
    color: #409EFF;
    position: absolute;
    top: 0;
    bottom: 0;
    line-height: 40px;
    width: 25px;
    text-align: center;
    background: #e0eeff;
    height: 39px;
  }

  .rightBtn {
    right: 0;
  }

  .leftBtn {
    left: 0
  }

</style>

<script>
  export default {
    data() {
      return {
        nodeName: '',
        right: null,
        left: null,
        tagWidth: null,
        tagWrapWidth: null,
        views: null,
        styleLeft: 0,
        activeLeft: 30,
      };
    },
    computed: {
      visitedViews() {
        return this.$store.state.visitedViews
      }
    },
    watch: {
      $route(to, from) {
        this.addViewTags()
        this.moveToCurrentTag()
      },
    },
    mounted() {
      this.addViewTags()
    },
    methods: {
      addViewTags() {
        const route = this.$route;
        if (!route) {
          return false
        }
        if (route.path == '/workbench') {
          return
        }
        if (route.path == '/organManage') { // 初审 审批
          this.nodeName = "机构管理";
        }else if(route.path == '/userManage'){
          this.nodeName = "用户管理";
        }else if(route.path == '/functionalRoleManage'){
          this.nodeName = "功能角色";
        }else if(route.path == '/processRoleManage'){
          this.nodeName = "流程角色";
        }else if(route.path == '/appConfig'){
          this.nodeName = "分单配置";
        }else if(route.path == '/resourceManage'){
          this.nodeName = "资源管理";
        }else if(route.path == '/HolidaySetting'){
          this.nodeName = "节假日设置";
        }else if(route.path == '/workingTimeSetting'){
          this.nodeName = "工作时段设置";
        }
        this.$store.dispatch('addVisitedViews', {
          name: this.nodeName,
          path:route.path,
        })
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag_self
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to === this.$route.fullPath) {
              this.moveToTarget(tag.$el)
              break
            }
          }
        })
      },
      moveToTarget($target) {
        const $container = this.$refs.tag_wrap
        const $containerWidth = $container.offsetWidth
        const $tag_refWidth = this.$refs.tag_ref.offsetWidth
        const $tag_refLeft = Math.abs(this.$refs.tag_ref.offsetLeft)
        const $targetLeft = $target.offsetLeft
        const $targetWidth = $target.offsetWidth
        if ($targetLeft + $targetWidth < $tag_refLeft) {
          this.activeLeft = 30
        } else if ($targetLeft > $containerWidth) {
          this.activeLeft = $containerWidth - $targetLeft - $targetWidth - 30;
        }
      },
      isActive(route) {
        return  route.path == this.$route.path;
      },
      handleClose(view, ev) {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0];
            if (latestView) {
              this.$router.push(latestView.path);
            } else {
              this.$router.push('/workbench');
            }
          }
        })
      },
      rightMove() {
        this.right = parseFloat(this.$refs.tag_ref.style.left);
        this.tagWidth = $('.tag_Ref').width();
        this.tagWrapWidth = $('.tag').width();
        if (this.tagWidth <= this.tagWrapWidth - 50) {
          this.$refs.tag_ref.style.left = '30px';
        } else {
          if (this.right <= (this.tagWidth - this.tagWrapWidth) * -1) {
            this.$refs.tag_ref.style.left = (this.tagWidth - this.tagWrapWidth + 40) * -1 + 'px';
          } else {
            this.$refs.tag_ref.style.left = this.right - 50 + "px";
          }
        }
      },
      leftMove() {
        if (parseFloat(this.$refs.tag_ref.style.left) >= -20) {
          this.$refs.tag_ref.style.left = '30px';
        } else {
          this.$refs.tag_ref.style.left = parseFloat(this.$refs.tag_ref.style.left) + 50 + "px";
        }
      },
    },
  }

</script>
