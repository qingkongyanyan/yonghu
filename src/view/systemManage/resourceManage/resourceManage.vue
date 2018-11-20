<!-- 系统管理-资源管理-->
<template>
<div>
  <div class="resourceManage main-div"  @click="getDropDownSelect">
    <div class="tabContainer">
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <el-tab-pane label="用户资源" name="yonghu">用户资源</el-tab-pane>
        <el-tab-pane label="风控资源" name="xinshen">风控资源</el-tab-pane>
        <el-tab-pane label="信贷资源" name="xindai">信贷资源</el-tab-pane>
        <el-tab-pane label="理财报表" name="licaibb">理财报表</el-tab-pane>
        <el-tab-pane label="信贷报表" name="xindaibb">信贷报表</el-tab-pane>
        <el-tab-pane label="信贷APP后台" name="xindaiappht">信贷APP后台</el-tab-pane>
        <el-tab-pane label="普惠金融" name="puhuijinrong">普惠金融</el-tab-pane>
      </el-tabs>
    </div>
    <div class="title edit-div">
        <span class="titleText">
          <i class="el-icon title-icon"></i>
          资源列表
        </span>
        <span class="iconContainer">
          <span class="icon-item" @click="handleItem('add')">
            <i class="el-icon addIcon"></i><span class="el-icon-text">新增</span>
          </span>
        </span>
      </div>  
    <div class="listContainer">
      <!-- <div class="iconContainer">
        <span class="icon-item" @click="handleItem('add')">
          <i class="el-icon addIcon"></i><span class="el-icon-text">新增</span>
        </span>
      </div> -->
      <div style="border-radius:4px; border:1px solid #e6eaee;">
        <div class="titleContainer">
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span style="width:170px;text-indent:2em">资源名称</span>
            <span style="flex: 1; display: flex; align-items: center;justify-content: flex-end">
              <span style="width:120px;text-indent:3em;">资源编号</span>
              <span style="width:160px;text-align:center">上级资源</span>
              <span style="flex: 1; display: flex; align-items: center;justify-content: flex-end">
                <span style="flex: 1; display: flex; align-items: center;justify-content: center">
                  <span class="resUrl">资源路径</span>
                </span>
                <span style="width:100px;text-align:center">资源类型</span>
                <span style="width:100px;text-align:center">资源次序</span>
              </span>
            </span>
            <span style="width:100px;text-align:center">操作</span>
          </span>
        </div>

        <el-tree
          :data="resDatas"
          node-key="id"
          :indent=16
          :props="defaultProps"
          :expand-on-click-node= false
          @node-click="getItem"
          highlight-current
          :render-content="renderContent">
        </el-tree>
      </div>
    </div>

    <!-- 添加 -->
    <el-dialog title="新增资源" :visible.sync="dialogAddVisible">
      <el-form :model="newItem" :rules="rules" ref="ruleForm">
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源名称：" prop="resName" :label-width="formLabelWidth">
            <el-input v-model="newItem.resName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="superRes" label="资源编号：" prop="resCode" :label-width="formLabelWidth">
            <el-input v-model="newItem.resCode" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="dialogResUrl" label="资源路径：" :label-width="formLabelWidth">
          <el-input v-model="newItem.resUrl" auto-complete="off"></el-input>
        </el-form-item>
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源类型：" prop="resType" :label-width="formLabelWidth">
            <!-- <el-input v-model="newItem.resType" auto-complete="off"></el-input> -->
            <el-select v-model="newItem.resType" @change="setResType" placeholder="">
              <el-option    
                v-for="item in resTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="superRes" label="上级资源：" :label-width="formLabelWidth">
            <div class="dropdown">
                <span class="dropdownInput" v-bind:title=resName>{{resName}}</span>
                <!-- <span style="float:rigth;"> -->
                <!-- <i class="el-select__caret el-input__icon el-icon-arrow-up is-reverse"></i> -->
                <!-- </span> -->
                <div class="dropList" v-show="dropdownFlag">
                  <el-tree
                    v-if="resDatas.length"
                    :data="resDatas"
                    node-key="id"
                    :props="defaultProps"
                    :expand-on-click-node= false
                    @node-click="getItemSelect">
                  </el-tree>
                </div>
                <i id="dropdownInput-arrow" class="el-select__caret el-input__icon el-icon-arrow-down" :class="{reverse:isActive,reverse2:!isActive}"></i>
            </div>
          </el-form-item>
        </div>
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源图标：" :label-width="formLabelWidth">
            <el-input v-model="newItem.resIcon" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="superRes" label="资源次序：" :label-width="formLabelWidth">
            <el-input type="number" v-model="newItem.resSeq" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="服务系统：" :label-width="formLabelWidth">
          <el-select v-model="newItem.reqFlag" placeholder="">
            <el-option
              v-for="item in reqFlags"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="marR10" label="资源描述：" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="3" v-model="newItem.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loadingFlag" @click="commitAddItem('ruleForm')">{{loadingTxt}}</el-button>
      </div>
    </el-dialog>

    <!-- 编辑框 -->
    <el-dialog title="编辑资源" :visible.sync="dialogEditVisible">
      <el-form :model="itemOfLists" :rules="rules" ref="ruleForms">
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源名称：" prop="resName" :label-width="formLabelWidth">
            <el-input v-model="itemOfLists.resName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="superRes" label="资源编号：" prop="resCode" :label-width="formLabelWidth">
            <el-input v-model="itemOfLists.resCode" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="dialogResUrl" label="资源路径：" :label-width="formLabelWidth">
          <el-input v-model="itemOfLists.resUrl" auto-complete="off"></el-input>
        </el-form-item>
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源类型：" prop="resType" :label-width="formLabelWidth">
            <!-- <el-input v-model="itemOfLists.resType" auto-complete="off"></el-input> -->
            <el-select v-model="itemOfLists.resType" @change="setResType" placeholder="请选择">
              <el-option    
                v-for="item in resTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="superRes" label="上级资源：" :label-width="formLabelWidth">
            <div class="dropdown">
                <span class="dropdownInput" v-bind:title=resNameEdit>{{resNameEdit}}</span>
                <!-- <span style="float:rigth;"> -->
                <!-- <i class="el-select__caret el-input__icon el-icon-arrow-up is-reverse"></i> -->
                <!-- </span> -->
                <div class="dropList" v-show="dropdownFlag">
                  <el-tree
                    v-if="resDatas.length"
                    :data="resDatas"
                    node-key="id"
                    :props="defaultProps"
                    :expand-on-click-node= false
                    @node-click="getItemSelect">
                  </el-tree>
                </div>
                <i id="dropdownInput-arrow" class="el-select__caret el-input__icon el-icon-arrow-down" :class="{reverse:isActive,reverse2:!isActive}"></i>
            </div>
          </el-form-item>
        </div>
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源图标：" :label-width="formLabelWidth">
            <el-input v-model="itemOfLists.resIcon" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="superRes" label="资源次序：" :label-width="formLabelWidth">
            <el-input type="number" v-model="itemOfLists.resSeq" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="marR10" label="资源描述：" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="3" v-model="itemOfLists.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loadingFlag" @click="commitEditedItem('ruleForms')">{{loadingTxt}}</el-button>
      </div>
    </el-dialog>

    <!-- 查看框 -->
    <el-dialog title="资源详情" :visible.sync="dialogCheckVisible">
      <el-form>
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源名称：" :label-width="formLabelWidth">
            <el-input readonly v-model="itemOfLists.resName"></el-input>
          </el-form-item>
          <el-form-item class="superRes" label="资源编号：" :label-width="formLabelWidth">
            <el-input readonly v-model="itemOfLists.resCode"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="dialogResUrl" label="资源路径：" :label-width="formLabelWidth">
          <el-input readonly v-model="itemOfLists.resUrl"></el-input>
        </el-form-item>
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源类型：" :label-width="formLabelWidth">
            <el-input readonly v-model="itemOfLists.resTypeTxt"></el-input>
          </el-form-item>
          <el-form-item class="superRes" label="上级资源：" :label-width="formLabelWidth">
            <el-input readonly v-model="itemOfLists.parentResName"></el-input>
          </el-form-item>
        </div>
        <div style="display:flex;justify-content: space-between;">
          <el-form-item label="资源图标：" :label-width="formLabelWidth">
            <el-input readonly v-model="itemOfLists.resIcon"></el-input>
          </el-form-item>
          <el-form-item class="superRes" label="资源次序：" :label-width="formLabelWidth">
            <el-input readonly type="number" v-model="itemOfLists.resSeq"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="marR10" label="资源描述：" :label-width="formLabelWidth">
          <el-input readonly type="textarea" :rows="3" v-model="itemOfLists.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogCheckVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
//import myHead from "@/view/header/header";
import appConstant from '../../../util/constant'
import systemManageHttp from "../systemManage_ser";
export default {
  data() {
    return {
      resDatas: [],
      resDatasAll:[],

      newItem: {
        reqFlag: '04'
      },
      itemOfLists: {},

      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogCheckVisible: false,

      dropdownFlag: false,
      resName:'',
      resNameEdit: '',

      resTypes: [{
        value: '01',
        label: '菜单'
      },{
        value: '02',
        label: '功能'
      }],

      // tab 的默认值
      activeName: 'yonghu',
      reqFlag: '04',
      reqFlags: [{value: '04',label: '用户系统'}],

      formLabelWidth: "100px",

      defaultProps: {
        children: "children",
        label: "resName"
      },

      param: {
        reqFlag: "04",
        resType: "",
        validFlag: "",
        recursiveFlag: 1,
        pid: "",
      },//tab 切换时的入参

      // 加载中
      loadingFlag: false,
      loadingTxt: "确 定",
      // 表单校验
      rules: {
        resName:[
          { required:true, message: '请输入资源名称', trigger:'blur'}
        ],
        resCode:[
          { required:true, message: '请输入资源编号', trigger:'blur'}
        ],
        resUrl:[
          { required:true, message: '请输入资源路径', trigger:'change'}
        ],
        resType: [
          { required: true, message: '请输入资源类型', trigger: 'blur' }
        ]
      },
      isActive:false,
    };
  },
  watch: {
    '$route' (to, from) {
      if (to.path == '/resourceManage') {
        this.getResTree();
      }
    }
  },
  created() {
    this.getResTree();
  },
  methods: {
    // 树形结构的渲染函数
    renderContent(h, { node, data, store }) {
      return (
        <span style="border-bottom:1px solid #efefef;flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 13px; padding-right: 8px;">
          <span style="width:200px;">{data.resName}</span>
          <span style="flex: 1; display: flex; align-items: center;justify-content: flex-end">
            <span style="width:100px;">{data.resCode}</span>
            <span style="width:100px;">{data.parentResName}</span>
            <span style="flex: 1; display: flex; align-items: center;justify-content: flex-end">
              <span style="flex: 1; display: flex; align-items: center;justify-content: center">
                <span class="resUrl" title={data.resUrl}>
                  {data.resUrl}
                </span>
              </span>
              <span style="width:100px;">{data.resTypeTxt}</span>
              <span style="width:60px;">{data.resSeq}</span>
            </span>
          </span>
          <span>
            <el-button
              class="btn-sm" size="small" type="text" on-click={ () => {this.dialogEditVisible = true;this.$refs['ruleForms']?this.$refs['ruleForms'].resetFields():'';} }>
              编辑
            </el-button>
            <el-button class="btn-sm" size="small" type="text" on-click={ () => this.dialogCheckVisible=true }>
              查看
            </el-button>
          </span>
        </span>
      );
    },

    // 添加
    handleItem(flag) {
      if (flag === "add") {
        // this.newItem = {};
        this.$refs['ruleForm']?this.$refs['ruleForm'].resetFields():'';
        this.newItem.resName = "";
        this.newItem.resCode = "";
        this.newItem.resUrl = "";
        this.newItem.resType = "";
        this.newItem.resIcon = "";
        this.newItem.resSeq = "";
        this.newItem.remark = "";
        this.newItem.pid = "";
        this.resName = "";

        // this.newItem.reqFlag = "";

        this.loadingFlag = false;
        this.loadingTxt = "确 定";
        this.dialogAddVisible = true;
      }
    },

    setResType(value){
      for(var i=0,len=this.resTypes.length;i<len;i++){
        if(this.resTypes[i].value === value){
          this.$forceUpdate(function(){
            this.newItem.resType = value;
          })
        }
      }
    },

    // 获取资源列表
    getResTree() {
      systemManageHttp
        .getResTree(this.param)
        .then(res => {
          this.resDatas = res.data.data;
        });
    },

    // 获取某一条资源的信息
    getItem(row,node,arr){
      this.get(appConstant.baseUrl_user+"res/get/"+row.id +"?"+(+new Date())).then(res => {
        this.itemOfLists = res.data;
        this.resNameEdit = res.data.parentResName;
      });
    },
    sendEditUser(){
      this.loadingFlag = true;
      this.loadingTxt = "加载中";
      systemManageHttp
        .update(this.itemOfLists)
        .then(res => {
          if(res.data.statusCode === 200){
            this.$message({
              message: res.data.msg?res.data.msg:"操作成功！",
              type: 'success'
            })
            this.getResTree();
            this.dialogEditVisible = false;
            this.loadingFlag = false;
            this.loadingTxt = "确 定";
          }else{
            this.$message({
              message: '操作失败！',
              type: 'error'
            })
            this.dialogEditVisible = false;
            this.loadingFlag = false;
            this.loadingTxt = "确 定";
          }
        })
        .catch(err => {
          this.$message({
            message: '网络错误！',
            type: 'error'
          })
          this.dialogEditVisible = false;
          this.loadingFlag = false;
          this.loadingTxt = "确 定";
        });
    },
    // 确定编辑一条资源
    commitEditedItem(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            //alert('qqqsubmit!');
            this.sendEditUser();
          } else {
            //return false;
          }
        });
    },
    sendAddUser(){
      /*if(!this.newItem.resName || !this.newItem.resCode||!this.newItem.resType){
        this.$message({
          message: '请输入必填项！',
          type: 'warning'
        });
        return;
      }*/

      this.loadingFlag = true;
      this.loadingTxt = "加载中";
      systemManageHttp
        .add(this.newItem)
        .then(res => {
          if(res.data.statusCode === 200){
            this.$message({
              message: res.data.msg?res.data.msg:"操作成功！",
              type: 'success'
            })
            this.getResTree();
            this.dialogAddVisible = false;
            this.loadingFlag = false;
            this.loadingTxt = "确 定";
          }else{
            this.$message({
              message: '操作失败！',
              type: 'error'
            })
            this.dialogAddVisible = false;
            this.loadingFlag = false;
            this.loadingTxt = "确 定";
          }
        })
        .catch(err => {
          this.$message({
            message: '网络错误！',
            type: 'error'
          })
          this.dialogAddVisible = false;
          this.loadingFlag = false;
          this.loadingTxt = "确 定";
        });
    },
    // 确定提交一条新增资源
    commitAddItem(ruleForm){
      this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            //alert('submit!');
            this.sendAddUser();
          } else {
            //return false;
          }
        });
    },

    // 打开下拉菜单里的树形结构
    getDropDownSelect(event){
      if(this.isActive == true){
        this.isActive = false;
      };
      if((!this.dropdownFlag && event.target.className ==='dropdownInput') || (!this.dropdownFlag && event.target.id ==='dropdownInput-arrow')){
        this.dropdownFlag = true;
        //alert('ooooo');
        this.isActive = true;
      }else{
        this.dropdownFlag = false;
      }
    },
    // 下拉菜单里的树形结构选取某一级数据
    getItemSelect(row,node,arr){
      this.dropdownFlag = false;
      this.isActive = false;
      this.get(appConstant.baseUrl_user+"res/get/"+row.id +"?"+(+new Date())).then(res => {
        this.newItem.pid = res.data.id;
        this.itemOfLists.pid = res.data.id;
        this.resName = res.data.resName;
        this.resNameEdit = res.data.resName;
      });
    },

    // 切换 tab
    tabChange(tab){
      if(tab.name==='xindai'){
        this.param.reqFlag = '01';
        this.newItem.reqFlag = '01';
        this.reqFlags = [{value: '01',label: '信贷系统'}];
      }else if(tab.name==='xinshen'){
        this.param.reqFlag = '02';
        this.newItem.reqFlag = '02';
        this.reqFlags = [{value: '02',label: '风控系统'}];
      }else if(tab.name==='yonghu'){
        this.param.reqFlag = '04';
        this.newItem.reqFlag = '04';
        this.reqFlags = [{value: '04',label: '用户系统'}];
      }else if(tab.name==='licaibb'){
        this.param.reqFlag = '05';
        this.newItem.reqFlag = '05';
        this.reqFlags = [{value: '05',label: '理财报表'}];
      }else if(tab.name==='xindaibb'){
        this.param.reqFlag = '06';
        this.newItem.reqFlag = '06';
        this.reqFlags = [{value: '06',label: '信贷报表'}];
      }else if(tab.name==='xindaiappht'){
        this.param.reqFlag = '07';
        this.newItem.reqFlag = '07';
        this.reqFlags = [{value: '07',label: '信贷APP后台'}];
      }else if(tab.name ==='puhuijinrong'){
        this.param.reqFlag = '08';
        this.newItem.reqFlag = '08';
        this.reqFlags = [{value: '08',label: '普惠金融'}];
      }
      this.getResTree();
    }
  },
};
</script>

<style>
.resourceManage .titleContainer{
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #efefef;
  font-size: 14px;
  color: #000;
  font-weight: bold;
  background-color: #f8f9fd;
}

.resourceManage .tabContainer .el-tabs__header{
  margin: 0;
  padding-left: 25px;
  background-color: rgba(0,119,255,.75);
  border:1px solid rgba(0,119,255,.75);
  border-radius:6px 6px 0 0;
}
.resourceManage .tabContainer .el-tabs__header .el-tabs__nav-wrap::after{
  height: 0;
}
.resourceManage .tabContainer .el-tabs__header .el-tabs__item{
  color: #fff;
  height: 48px;
  line-height: 48px;
  font-size: 15px;
}
.resourceManage .tabContainer .el-tabs__header .el-tabs__active-bar{
  bottom: 10px;
  background-color: #fff;
}
.resourceManage .tabContainer .el-tabs__content{
  height: 0px;
}

.resourceManage .btn-sm {
  border-radius: 3px;
  width: 44px;
  height: 24px;
  font-size: 12px;
  padding: 0;
}
.resourceManage .el-tree-node__content {
  height: 35px;
  font-size: 13px;  
  align-items: normal;
}

.resourceManage .resUrl {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 500px;
  text-align: center;
}

.resourceManage [class*=" el-icon-"], .resourceManage [class^=el-icon-]{
  line-height: 2;
}

.resourceManage .iconContainer {
  /*line-height: 50px;
  margin-right: 0px;
  background-color: rgba(238,240,249,.75);
  border-radius: 6px;
  width: 100%;
  height: 50px;
  float:none;*/
}
.resourceManage .iconContainer .icon-item {
  cursor: pointer;
  margin-right: 14px;
}
.resourceManage .iconContainer .el-icon {
 /*  color: #0077ff;
 margin-right: 6px;
 vertical-align: middle;
 height: 30px;
 width: 30px;
 display: inline-block;
 background-repeat: no-repeat;
 background-size: 30px 30px;
 background-position: center center; */
}

.resourceManage .iconContainer .el-icon-text {
  font-size: 14px;
  color: #1f2d3d;
  vertical-align: middle;
}

.resourceManage .el-dialog{
  width: 660px;
}

.resourceManage .el-dialog .dialogResUrl .el-input__inner{
  width: 100%;
}

.resourceManage .el-dialog .el-form-item .dropList{
  /* background-color: #fff;
  border: 1px solid #dfe4ed;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  position: absolute;
  top: 50px;
  left: 0;
  z-index: 111;
  height: 235px;
  width: 184px;
  font-size: 12px;
  overflow-y: scroll;
  overflow-x: scroll; */
}
.resourceManage .el-dialog .el-tree-node>.el-tree-node__children{
  overflow:visible;
}
.resourceManage .dropdown .reverse{
  transform: rotateZ(-180deg);
  transform-origin:center center;/* 旋转中心要是正中间 才行 */
  -webkit-transform: rotate(-180deg);
  -moz-transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  transition: transform 0.3s; /* 过度时间 可调 */
  -moz-transition: -moz-transform 0.3s; 
  -moz-transition: -moz-transform 0.3s; 
  -o-transition: -o-transform 0.3s; 
  -ms-transition: -ms-transform 0.3s;
}
.resourceManage .dropdown .el-select__caret{
  position: absolute;
  color: #b4bccc;
  font-size: 14px;
  right: 3px;
  top: 0px;
  line-height: 28px;
}
</style>
