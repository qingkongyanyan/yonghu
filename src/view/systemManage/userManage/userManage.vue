<!-- 系统管理-用户管理-->
<template>
  <div>
    <!-- <my-head></my-head> -->
    <div class="main-div userManage" @click="getDropDownSelect">
      <!-- <my-head></my-head> -->
      <div class="keywordContainer search-div">
        <el-row class="row row1" type="flex">
          <el-col class="search-item" :span="6" :offset="0">
            <span class="keywordText">用户名称：</span>
            <el-input class="" v-model="userName_la" placeholder="请输入用户名称"></el-input>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">用户编号：</span>
            <el-input class="" v-model="userCode" placeholder="请输入用户编号"></el-input>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">证件号码：</span>
            <el-input class="" v-model="certificateCode" placeholder="请输入证件号码"></el-input>
          </el-col>
          <el-col class="search-item" :span="6" :offset="0">
            <span class="keywordText">用户状态：</span>
            <el-select v-model="validFlag" placeholder="请选择用户状态">
              <el-option v-for="item in validFlags" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="row row2" type="flex">

          <el-col class="search-item" :span="6">
            <span class="keywordText" style="float:left;line-height:30px;">所属机构：</span>
            <div class="dropdown" style="float:left">
              <span class="dropdownInput" v-show="subOrg">{{subOrg}}</span>
              <span class="dropdownInput" v-show="!subOrg" style="color:#B5BCCD;">请选择所属机构</span>
              <div class="dropList" v-show="dropdownFlag">
                <el-tree :data="orgDatasEdit" node-key="id" :load="loadNode" lazy :props="defaultProps"
                  :expand-on-click-node=false @node-click="getItemSelect">
                </el-tree>
              </div>
              <i id="dropdownInput-arrow" class="el-select__caret el-input__icon el-icon-arrow-down" :class="{reverse:isActive,reverse2:!isActive}"></i>
            </div>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">功能角色：</span>
            <el-select v-model="roleId" placeholder="请选择功能角色">
              <p class="selectTop">
                <span>角色编码</span>
                <span>角色名称</span>
              </p>
              <el-option v-for="item in roleIds" :key="item.id" :label="item.roleName" :value="item.id">
                <span style="float: left;width:66px">{{ item.roleCode }}</span>
                <span style="float: left; color: #8492a6; font-size: 13px;margin-left: 20px;">{{ item.roleName }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col class="search-item" :span="6" :offset="0">
            <span class="keywordText">流程角色：</span>
            <el-select v-model="flowRoleId" placeholder="请选择流程角色">
              <p class="selectTop">
                <span>角色编码</span>
                <span>角色名称</span>
              </p>
              <el-option v-for="item in flowRoleIds" :key="item.id" :label="item.flowRoleName" :value="item.id">
                <span style="float: left;width:66px">{{ item.flowRoleCode }}</span>
                <span style="float: left; color: #8492a6; font-size: 13px;margin-left: 20px;">{{ item.flowRoleName }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">联系电话：</span>
            <el-input v-model="tel" placeholder="请输入联系电话"></el-input>
          </el-col>
        </el-row>
        <el-row class="row row3" type="flex">
          <el-col :span="8"></el-col>
          <el-col :span="8"></el-col>
          <el-col :span="8"></el-col>
          <el-col class="search-item search-btn" :span="8">
            <el-button class="btn query" @click="getUsersByKey" type="primary">查询</el-button>
            <el-button class="btn reset" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="title titleContainer edit-div">
        <span class="titleText">
          <i class="el-icon title-icon"></i>
          用户列表
        </span>
        <span class="iconContainer">
          <span class="icon-item" @click="handleItem('add')">
            <i class="el-icon addIcon"></i><span class="el-icon-text">新增</span>
          </span>
          <span class="icon-item" @click="handleItem('func')">
            <i class="el-icon authIcon"></i><span class="el-icon-text">授权功能角色</span>
          </span>
          <span class="icon-item" @click="handleItem('proc')">
            <i class="el-icon authIcon"></i><span class="el-icon-text">授权流程角色</span>
          </span>
          <span class="icon-item" @click="handleItem('reset')">
            <i class="el-icon resetIcon"></i><span class="el-icon-text">重置密码</span>
          </span>
          <span class="icon-item" @click="handleItem('rest')">
            <i class="el-icon restIcon"></i><span class="el-icon-text">休息</span>
          </span>
          <span class="icon-item" @click="handleItem('active')">
            <i class="el-icon enableIcon"></i><span class="el-icon-text">激活</span>
          </span>
          <span class="icon-item" @click="handleItem('logout')">
            <i class="el-icon logoutIcon"></i><span class="el-icon-text">注销</span>
          </span>
        </span>
      </div>
      <div class="listContainer">
        <el-table :data="userDatas" border height="510" highlight-current-row @row-click="selectRow" style="width: 100%">
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="userName" label="用户名称" width="120">
          </el-table-column>
          <el-table-column prop="userCode" label="用户编号" width="110">
          </el-table-column>
          <el-table-column prop="certificateCode" label="证件号码" width="170">
          </el-table-column>
          <el-table-column prop="tel" label="联系电话" width="110">
          </el-table-column>
          <el-table-column prop="sexTxt" label="性别" width="50">
          </el-table-column>
          <el-table-column prop="orgName" label="所属机构" width="140">
          </el-table-column>
          <el-table-column prop="subOrgName" label="所属机构科室" width="140">
          </el-table-column>
          <el-table-column prop="orgCode" label="机构编号" width="80">
          </el-table-column>
          <el-table-column prop="postidset" label="岗位" width="140">
          </el-table-column>
          <el-table-column prop="roleNameList" label="功能角色" show-overflow-tooltip min-width="180">
          </el-table-column>
          <el-table-column prop="flowRoleNameList" label="流程角色" show-overflow-tooltip min-width="180">
          </el-table-column>
          <el-table-column prop="registerDate" label="注册日期" width="100">
          </el-table-column>
          <el-table-column prop="validFlagTxt" label="用户状态" width="80">
          </el-table-column>
          <el-table-column prop="autoAssignTaskFlagTxt" label="自动分单标识" width="110">
          </el-table-column>
          <el-table-column label="操作" width="130" fixed="right">
            <template slot-scope="scope">
              <el-button class="btn-sm edit" size="small" type="text" @click="handleClick('edit',scope.row)">编辑</el-button>
              <el-button class="btn-sm check" size="small" type="text" @click="handleClick('check',scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 页码 -->
        <div class="page">
          <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page.sync="currentPage"
            :page-sizes=pageSizesArr :page-size=pageSizesArr[0] layout="total, sizes, prev, pager, next, jumper" :total=responseDatas.totalRecord>
          </el-pagination>
        </div>
      </div>

      <!-- 添加、编辑框 -->
      <el-dialog :title="titleTxt" :visible.sync="dialogEditVisible">
        <el-form :model="itemOfLists" :rules="rules" ref="ruleForm">
          <div>
            <el-form-item class="fl" label="所属机构：" prop="orgName" :label-width="formLabelWidth">
              <div class="dropdown">
                <!-- <span class="dropdownInputD1">{{itemOfLists.orgName}}</span> -->
                <!-- <input type="text" class="dropdownInputD1 el-input__inner" readonly v-model="itemOfLists.orgName"> -->
                <el-input class="dropdownInputD1" name="dropdownInputD1" readonly v-model="itemOfLists.orgName"></el-input>
                <div class="dropList" v-show="dropdownFlagD1">
                  <el-tree :data="orgDatasEditD1" node-key="id" :load="loadNode" lazy :props="defaultProps"
                    :expand-on-click-node=false @node-click="getItemSelectD1">
                  </el-tree>
                </div>
                <i class="el-select__caret el-input__icon el-icon-arrow-down" :class="{reverse:isActives,reverse2:!isActives}"
                  id="dropdownInputD1-arrow"></i>
              </div>
            </el-form-item>
            <el-form-item class="fr" label="机构编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.orgCode" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="用户编号：" prop="userCode" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.userCode" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="用户名称：" prop="userName" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.userName" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item class="fl" label="所属机构科室：" :label-width="formLabelWidth">
              <div class="dropdown">
                <!-- <span class="dropdownInputD2">{{itemOfLists.subOrgName}}</span> -->
                <!-- <input type="text" class="dropdownInputD2 el-input__inner" readonly v-model="itemOfLists.subOrgName"> -->
                <el-input class="dropdownInputD2" name="dropdownInputD2" readonly v-model="itemOfLists.subOrgName"></el-input>
                <div class="dropList" v-show="dropdownFlagD2">
                  <el-tree :data="orgDatasEditD2" node-key="id" :load="loadNode" lazy :props="defaultProps"
                    :expand-on-click-node=false @node-click="getItemSelectD2">
                  </el-tree>
                </div>
                <i class="el-select__caret el-input__icon el-icon-arrow-down" :class="{reverse:isActivest,reverse2:!isActivest}"
                  id="dropdownInputD2-arrow"></i>
              </div>
            </el-form-item>
            <el-form-item class="fr" label="机构科室编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.subOrgCode" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item class="fl" label="映射机构：" prop="mappingOrgName" :label-width="formLabelWidth">
              <div class="dropdown">
                <!-- <span class="dropdownInputD3">{{itemOfLists.mappingOrgName}}</span> -->
                <!-- <input type="text" class="dropdownInputD3 el-input__inner" readonly v-model="itemOfLists.mappingOrgName"> -->
                <el-input class="dropdownInputD3" name="dropdownInputD3" readonly v-model="itemOfLists.mappingOrgName"></el-input>
                <div class="dropList" v-show="dropdownFlagD3">
                  <el-tree :data="orgDatasEditD3" node-key="id" :load="loadNodeD3" lazy :props="defaultProps"
                    :expand-on-click-node=false @node-click="getItemSelectD3">
                  </el-tree>
                </div>
                <i class="el-select__caret el-input__icon el-icon-arrow-down" :class="{reverse:isActivess,reverse2:!isActivess}"
                  id="dropdownInputD3-arrow"></i>
              </div>
            </el-form-item>
            <el-form-item class="fr" label="映射机构编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.mappingOrgCode" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="证件类型：" prop="certificateType" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.certificateType" placeholder="" @change="isIdNumber">
                <el-option v-for="item in cerdTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr" label="证件编号：" prop="certificateCode" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.certificateCode" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc bottom14">
            <el-form-item class="fl productName newProName" label="经营产品：" :label-width="formLabelWidth" style="height:auto;">
              <el-select v-model="proIdList" multiple placeholder="" @change="multipleSelect">
                <p class="selectTop">
                  <span>产品编号</span>
                  <span>产品名称</span>
                </p>
                <el-option v-cloak v-for="item in products" :key="item.id" :label="item.proName" :value="item.id">
                  <span style="float: left;width:66px">{{ item.proCode }}</span>
                  <span style="float: left; color: #8492a6; font-size: 13px;margin-left: 20px;">{{ item.proName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="性别：" prop="sex" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.sex" placeholder="">
                <el-option v-for="item in sex" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="最高学历：" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.highDegree" placeholder="">
                <el-option v-for="item in educations" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr" label="联系电话：" prop="tel" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.tel" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="岗位：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.postidset" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="自动分单标识：" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.autoAssignTaskFlag" placeholder="">
                <el-option v-for="item in yesOrNo" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="addOrEdit==='edit'" @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" v-if="addOrEdit==='edit'" :loading="loadingFlag" @click="commitEditedItem('ruleForm')">{{loadingTxt}}</el-button>
          <el-button type="primary" v-if="addOrEdit==='add'" :loading="loadingFlag" @click="commitAddItem('ruleForm')">{{loadingTxt}}</el-button>
        </div>
      </el-dialog>

      <!-- 查看框 -->
      <el-dialog title="用户详情" :visible.sync="dialogCheckVisible">
        <el-form :model="itemOfLists">
          <div>
            <el-form-item class="fl" label="所属机构：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.orgName"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.orgCode"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="用户编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.userCode"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="用户名称：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.userName"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item class="fl" label="所属机构科室：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.subOrgName"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构科室编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.subOrgCode"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item class="fl" label="映射机构：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.mappingOrgName"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="映射机构编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.mappingOrgCode"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="证件类型：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.certificateTypeTxt"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="证件编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.certificateCode"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl productName productNameCheck newProName" label="经营产品：" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="1" resize=none readonly v-model="itemOfLists.proNameList"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="性别：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.sexTxt"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="最高学历：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.highDegreeTxt"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="联系电话：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.tel"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="岗位：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.postidset"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="自动分单标识：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.autoAssignTaskFlagTxt"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogCheckVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 授权功能角色 -->
      <el-dialog v-bind:title=authTxt :visible.sync="dialogFuncVisible" width="750" custom-class="functionalDialog">
        <el-table :data="userRoleLists" tooltip-effect="dark" style="width: 94%" height="500" @row-click="selectFuncRole">
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="roleCode" label="角色编号" width="130">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="170">
          </el-table-column>
          <el-table-column label="使用权限" align="center" width="140">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.uf" @change="selectUseRoleFlag(scope.row,scope.row.uf,scope.row.af)"
                :checked="scope.row.useFlag==='1'" :true-label='1' :false-label='0'></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="可授权权限" align="center" width="140">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.af" @change="selectUseRoleFlag(scope.row,scope.row.uf,scope.row.af)"
                :checked="scope.row.assignFlag==='1'" :true-label='1' :false-label='0'></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFuncVisible = false">取 消</el-button>
          <el-button type="primary" @click="grantUserRole">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 重置密码 -->
      <!--     <el-dialog title="询问" :visible.sync="dialogResetVisible" width="30%">
      <span>您确定要重置密码吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogResetVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </span>
    </el-dialog> -->

      <!-- 激活 -->
      <!-- <el-dialog title="询问" :visible.sync="dialogActiveVisible" width="30%">
      <span>确定操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogActiveVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateValidFlag('0')">确 定</el-button>
      </span>
    </el-dialog> -->

      <!-- 休息 -->
      <!-- <el-dialog title="询问" :visible.sync="dialogRestVisible" width="30%">
      <span>确定操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRestVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateValidFlag('1')">确 定</el-button>
      </span>
    </el-dialog> -->

      <!-- 注销 -->
      <!-- <el-dialog title="询问" :visible.sync="dialoglogoutVisible" width="30%">
      <span>确定操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialoglogoutVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateValidFlag('2')">确 定</el-button>
      </span>
    </el-dialog> -->

      <!-- 未选中提示 -->
      <!-- <el-dialog title="提示" :visible.sync="dialogAlertVisible" width="30%">
      <span>请选中要操作的记录！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAlertVisible = false">确定</el-button>
      </span>
    </el-dialog> -->


    </div>
  </div>
</template>

<script>
  import systemManageHttp from "../systemManage_ser";
  export default {
    data() {
      var isOnly = (rule, value, callback) => {
        var oldValue = this.cacheUserCode.split("");
        var newValue = value.split("");
        // 编辑时，用户编号可以是带出值（原值）
        if (this.addOrEdit == 'edit' && oldValue.join("") == newValue.join("")) {
          return callback()
        }
        systemManageHttp.checkUserCodeUnique({
          params: {
            userCode: value,
            timestamp: +new Date()
          }
        }).then(res => {
          if (res.data.data == 1) {
            return callback(new Error('用户编号已存在!'));
          } else {
            return callback()
          }
        })
      }
      return {
        // 从本地存储里取出的个人信息
        userInf: {},
        // 关键字查询
        userName_la: '',
        userCode: '',
        certificateCode: '',
        validFlag: '',
        orgId: '',
        roleId: '',
        flowRoleId: '',
        tel: '',

        responseDatas: {}, // 角色列表请求的返回值

        currentPage: 1, // 默认显示的当前页
        pageSizesArr: [10, 20, 30, 40, 50], // 每页显示的数据数


        defaultProps: {
          children: "children",
          label: "orgName",
          isLeaf: 'leaf',
        },

        // 查询的所属机构
        subOrg: '',
        orgDatasEdit: [],
        dropdownFlag: false,

        // 弹窗里的所属机构
        // subOrgD1: '',
        orgDatasEditD1: [],
        dropdownFlagD1: false,

        // 弹窗里的所属机构科室
        // subOrgD2: '',
        orgDatasEditD2: [],
        dropdownFlagD2: false,

        // 弹窗里的映射机构
        // subOrgD3: '',
        orgDatasEditD3: [],
        dropdownFlagD3: false,

        // 弹窗的显示隐藏标志位
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogCheckVisible: false,
        dialogAlertVisible: false,
        dialogFuncVisible: false,
        dialogResetVisible: false,
        dialogActiveVisible: false,
        dialogRestVisible: false,
        dialoglogoutVisible: false,

        userRoleLists: '', //授权功能角色时，授权流程角色时，获取角色列表

        authTxt: '',

        proIdList: [], // 选择经营产品
        products: [], //获取用户的经营产品
        orgLevels: [], //所属机构科室

        // 必填项校验
        itemOfLists: {
          orgName: '',
          userCode: '',
          userName: '',
          mappingOrgName: '',
          certificateType: '',
          certificateCode: '',
          sex: '',
          tel: ''
        },
        rules: {
          orgName: [{
            required: true,
            message: '请选择所属机构',
            trigger: 'change'
          }],
          userCode: [{
              required: true,
              message: '请输入用户编号',
              trigger: 'blur'
            },
            {
              validator: isOnly,
              trigger: 'change'
            }
          ],
          userName: [{
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }],
          mappingOrgName: [{
            required: true,
            message: '请选择映射机构',
            trigger: 'change'
          }],
          certificateType: [{
            required: true,
            message: '请选择证件类型',
            trigger: 'change'
          }],
          certificateCode: [{
            required: true,
            message: '请输入证件号码',
            trigger: 'blur'
          }],
          sex: [{
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }],
          tel: [{
              required: true,
              message: '请输入联系电话',
              trigger: 'blur'
            },
            {
              validator: this.checkTelephone,
              trigger: 'blur'
            }
          ],
        },


        // 自动分单标示
        yesOrNo: [{
            label: "是",
            value: "1"
          },
          {
            label: "否",
            value: "0"
          },
        ],

        // 性别
        sex: [{
            label: "男",
            value: "0"
          },
          {
            label: "女",
            value: "1"
          },
        ],

        // 最高学历
        educations: [{
            label: "硕士及以上",
            value: "01"
          },
          {
            label: "本科",
            value: "02"
          },
          {
            label: "专科",
            value: "03"
          },
          {
            label: "高中",
            value: "04"
          },
          {
            label: "初中及以下",
            value: "05"
          },
        ],

        // 证件类型
        cerdTypes: [{
            label: "身份证",
            value: "01"
          },
          {
            label: "户口本",
            value: "02"
          },
          {
            label: "护照",
            value: "03"
          },
          {
            label: "军官证",
            value: "04"
          },
          {
            label: "士兵证",
            value: "05"
          },
          {
            label: "港澳居民来往内地通行证",
            value: "06"
          },
          {
            label: "台湾同胞来往内地通行证",
            value: "07"
          },
          {
            label: "临时身份证",
            value: "08"
          },
          {
            label: "外国人居住证",
            value: "09"
          },
          {
            label: "警官证",
            value: "10"
          },
          {
            label: "驾驶证",
            value: "11"
          },
          {
            label: "社会保障号",
            value: "12"
          },
          {
            label: "其他证件",
            value: "13"
          }
        ],

        // 用户状态
        validFlags: [{
            label: "正常",
            value: "0"
          },
          {
            label: "休息",
            value: "1"
          },
          {
            label: "注销",
            value: "2"
          }
        ],
        // 所属机构
        organs: [{
            label: "正常",
            value: "01"
          },
          {
            label: "休息",
            value: "02"
          },
          {
            label: "注销",
            value: "03"
          }
        ],
        // 功能角色
        roleIds: [],
        // 流程角色
        flowRoleIds: [],

        formLabelWidth: "130px",

        queryParam: {
          userName_la: '',
          userCode: '',
          certificateCode: '',
          validFlag: '',
          orgId: '',
          roleId: '',
          flowRoleId: '',
          tel: '',
          pageNum: '',
          pageSize: '',
          orders: '',
        },

        // 用户列表数据
        userDatas: [],
        currentRow: null,
        currentFuncRow: null,

        roleInfoDtoList: [], // 授权功能角色时，勾选的使用权限数组，用于传参
        flowRoleDtoList: [], // 授权功能角色时，勾选的可授权权限数组，用于传参

        // 添加用户
        newItem: {},

        titleTxt: '', // 添加编辑框的标题
        addOrEdit: '',

        // 暂存的用户编号，用来校验唯一性
        cacheUserCode: "",
        // 加载中
        loadingFlag: false,
        loadingTxt: "确 定",
        isActive: false,
        isActives: false,
        isActivest: false,
        isActivess: false,
      };
    },
    /*watch: {
      '$route' (to, from) {
        if (to.path == '/userManage') {
          this.getUserInf();
          this.getUsersAll();
          this.getCurrentUserRole();
          this.getCurrentUserFlowRole();
        }
      }
    },*/
    mounted() {
      this.getUserInf();
      this.getUsersAll();
      this.getCurrentUserRole();
      this.getCurrentUserFlowRole();
    },
    methods: {
      // 从本地取出个人信息
      getUserInf() {
        this.userInf = JSON.parse(localStorage.getItem("userInf"));
      },

      // 下拉框获取功能角色
      getCurrentUserRole() {
        systemManageHttp.getCurrentUserRole({
          params: {
            timestamp: +new Date()
          }
        }).then(res => {
          this.roleIds = res.data.data;
        })
      },
      // 下拉框获取流程角色
      getCurrentUserFlowRole() {
        systemManageHttp.getCurrentUserFlowRole({
          params: {
            timestamp: +new Date()
          }
        }).then(res => {
          this.flowRoleIds = res.data.data;
        })
      },

      //请求数据接口
      getUsers(param) {
        systemManageHttp
          .getUsersByPage(this.queryParam)
          .then(res => {
            if (res.data.statusCode === 200) {
              this.responseDatas = res.data.data;
              this.userDatas = this.responseDatas.recordList;
            } else {
              this.responseDatas = {};
              this.userDatas = [];
              this.responseDatas.totalRecord = 0;
            }
          })
          .catch(err => {
            console.log(err);
          });
      },

      // 根据 id 查询角色
      getUserById(id) {
        systemManageHttp
          .getUserById({
            params: {
              userId: id,
              timestamp: +new Date()
            }
          })
          .then(res => {
            this.itemOfLists = res.data.data;
            this.cacheUserCode = this.itemOfLists.userCode;
            this.proIdList = this.itemOfLists.proIds ? this.itemOfLists.proIds.split(",") : [];
          })
          .catch(err => {
            console.log(err);
          });
      },

      // 请求全部数据
      getUsersAll() {
        this.queryParam.userName_la = "";
        this.queryParam.userCode = "";
        this.queryParam.certificateCode = "";
        this.queryParam.validFlag = "";
        this.queryParam.orgId = "";
        this.queryParam.roleId = "";
        this.queryParam.flowRoleId = "";
        this.queryParam.tel = "";
        this.queryParam.pageNum = 1;
        this.queryParam.pageSize = 10;
        this.queryParam.orders = null;
        (this.setPageSize = 10), (this.currentPage = 1);
        this.getUsers(this.queryParam);
      },

      // 查询按钮
      getUsersByKey() {
        this.queryParam.userName_la = this.userName_la;
        this.queryParam.userCode = this.userCode;
        this.queryParam.certificateCode = this.certificateCode;
        this.queryParam.validFlag = this.validFlag;
        this.queryParam.roleId = this.roleId;
        this.queryParam.flowRoleId = this.flowRoleId;
        this.queryParam.tel = this.tel;
        this.currentRow = null;
        this.getUsers(this.queryParam);
      },
      // 重置按钮
      reset() {
        this.subOrg = '';
        this.userName_la = "";
        this.userCode = "";
        this.certificateCode = "";
        this.validFlag = "";
        this.orgId = "";
        this.roleId = "";
        this.flowRoleId = "";
        this.tel = "";
        this.queryParam = {};
        this.currentRow = null;
        this.getUsersAll();
      },
      // 每页条数变化时，重新请求
      changePageSize(val) {
        this.queryParam.pageSize = val;
        this.queryParam.pageNum = 1;
        if (this.currentPage !== 1 || this.setPageSize !== 10) {
          this.currentPage = 1;
          this.setPageSize = 10;
        } else {
          this.getUsers(this.queryParam);
        }
      },
      // 改变页码时，重新请求
      changeCurrentPage(val) {
        this.queryParam.pageNum = val;
        this.getUsers(this.queryParam);
      },



      // 弹框里的树形结构选取某一级数据，所属机构
      getItemSelectD1(row, node, arr) {
        this.dropdownFlagD1 = false;
        this.isActives = false;
        // this.subOrgD1 = row.orgName;
        this.itemOfLists.orgId = row.id;
        this.itemOfLists.orgCode = row.orgCode;
        this.itemOfLists.orgName = row.orgName;
        this.itemOfLists.subOrgId = "";
        this.itemOfLists.subOrgCode = "";
        this.itemOfLists.subOrgName = "";
        if (row.orgLevel !== "06") { // 只有营业部才可以选择经营产品
          this.proIdList = [];
          this.products = [];
        } else {
          this.getProductForUser(row.id);
        }
      },
      // 弹框里的树形结构选取某一级数据，所属科室机构
      getItemSelectD2(row, node, arr) {
        this.dropdownFlagD2 = false;
        this.isActivest = false;
        // this.subOrgD2 = row.orgName;
        this.itemOfLists.subOrgId = row.id;
        this.itemOfLists.subOrgCode = row.orgCode;
        this.itemOfLists.subOrgName = row.orgName;
      },
      // 弹框里的树形结构选取某一级数据，映射机构
      getItemSelectD3(row, node, arr) {
        this.dropdownFlagD3 = false;
        this.isActivess = false;
        // this.subOrgD3 = row.orgName;
        this.itemOfLists.orgMappingId = row.id;
        this.itemOfLists.mappingOrgCode = row.orgCode;
        this.itemOfLists.mappingOrgName = row.orgName;
      },

      // 查询的树形结构选取某一级数据，所属机构
      getItemSelect(row, node, arr) {
        this.dropdownFlag = false;
        this.subOrg = row.orgName;
        if (this.subOrg) {
          this.isActive = false;
        };
        this.queryParam.orgId = row.id;
      },

      multipleSelect(list) {},

      // 打开下拉菜单里的树形结构
      getDropDownSelect(event) {
        if (this.isActive == true) {
          this.isActive = false;
        };
        if (this.isActives == true) {
          this.isActives = false;
        };
        if (this.isActivest == true) {
          this.isActivest = false;
        };
        if (this.isActivess == true) {
          this.isActivess = false;
        };
        // 查询的所属机构
        if ((!this.dropdownFlag && event.target.className === 'dropdownInput') || (!this.dropdownFlag && event.target.id ===
            'dropdownInput-arrow')) {
          this.dropdownFlag = true;
          this.isActive = true;
          systemManageHttp
            .getOrgTree({
              // pid: this.userInf.orgId,
              isCurrentOrgCode: "1",
              validFlag: "0",
            })
            .then(res => {
              this.orgDatasEdit = res.data.data;
              //this.isActive = false;
            });
        } else {
          this.dropdownFlag = false;
        }

        // 弹窗里的所属机构
        if (!this.dropdownFlagD1 && (event.target.name === 'dropdownInputD1' || event.target.id ===
            'dropdownInputD1-arrow')) {
          this.dropdownFlagD1 = true;
          this.isActives = true;
          systemManageHttp
            .getOrgTree({
              // pid: '',
              isCurrentOrgCode: "1",
              validFlag: "0",
            })
            .then(res => {
              this.orgDatasEditD1 = res.data.data;
            });
        } else {
          this.dropdownFlagD1 = false;
        }
        // 弹窗里的所属机构科室
        if (!this.dropdownFlagD2 && (event.target.name === 'dropdownInputD2' || event.target.id ===
            'dropdownInputD2-arrow')) {
          this.dropdownFlagD2 = true;
          this.isActivest = true;
          systemManageHttp
            .getTreeParentAndChildren({
              pid: this.itemOfLists.orgId,
              isCurrentOrgCode: "0",
              validFlag: "0",
            })
            .then(res => {
              this.orgDatasEditD2 = res.data.data;
            });
        } else {
          this.dropdownFlagD2 = false;
        }
        // 弹窗里的映射机构
        if (!this.dropdownFlagD3 && (event.target.name === 'dropdownInputD3' || event.target.id ===
            'dropdownInputD3-arrow')) {
          this.dropdownFlagD3 = true;
          this.isActivess = true;
          systemManageHttp
            .orgTranscriptMapping({
              // pid: ''
              // pid: this.userInf.orgId,
              // isCurrentOrgCode: "0",
              // validFlag: "0",
            })
            .then(res => {
              this.orgDatasEditD3 = res.data.data;
            });
        } else {
          this.dropdownFlagD3 = false;
        }
      },

      // 点击 映射机构 展开时加载
      loadNodeD3(node, resolve) {
        var data;
        if (node.data.hasChildren === '1') {
          systemManageHttp
            .orgTranscriptMapping({
              pid: node.data.id,
              validFlag: "0"
            })
            .then(res => {
              data = res.data.data;
              for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].hasChildren === '0') {
                  data[i].leaf = true;
                }
              }
              return resolve(data);
            });
        } else {
          return resolve([])
        }
      },

      // 点击展开时加载
      loadNode(node, resolve) {
        var data;
        if (node.data.hasChildren === '1') {
          systemManageHttp
            .getOrgTree({
              pid: node.data.id,
              validFlag: "0"
            })
            .then(res => {
              data = res.data.data;
              for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].hasChildren === '0') {
                  data[i].leaf = true;
                }
              }
              return resolve(data);
            });
        } else {
          return resolve([])
        }
      },

      // 获取经营产品
      getProductForUser(orgId) {
        systemManageHttp.getProductForUser({
          orgId: orgId,
          validFlag: '1'
        }).then(res => {
          this.products = res.data.data;
        })
      },

      // 查看或编辑条目
      handleClick(flag, item) {
        if (flag === "edit") {
          this.dialogEditVisible = true;
          this.addOrEdit = 'edit'
          this.titleTxt = "编辑用户";
          this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : '';
        } else {
          this.dialogCheckVisible = true;
        }
        this.getUserById(item.id);
        this.getProductForUser(item.orgId);
      },

      // 编辑用户
      sendEditUser() {
        this.loadingFlag = true;
        this.loadingTxt = "加载中";

        this.itemOfLists.proIds = this.proIdList.join(",");
        systemManageHttp
          .updateUser(this.itemOfLists)
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })

              this.dialogEditVisible = false;
              this.cacheUserCode = "";
              this.getUsers(this.queryParam);
              this.loadingFlag = false;
              this.loadingTxt = "确 定";
            } else {
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
      commitEditedItem(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sendEditUser();
          } else {}
        });
      },

      // 添加用户
      sendAddUser() {
        this.loadingFlag = true;
        this.loadingTxt = "加载中";

        this.itemOfLists.proIds = this.proIdList.join(",");
        systemManageHttp
          .addUser(this.itemOfLists)
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.newItem = {};
              this.dialogEditVisible = false;
              this.cacheUserCode = "";
              this.getUsers(this.queryParam);
              this.loadingFlag = false;
              this.loadingTxt = "确 定";
            } else {
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
      commitAddItem(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sendAddUser();
          } else {}
        });
      },

      // 选中某一行
      selectRow(row, event, column) {
        this.currentRow = row;
      },
      // 弹窗的表格里，选中某一行
      selectFuncRole(row, event, column) {
        this.currentFuncRow = row;
      },

      // 授权、启用、停用
      handleItem(flag) {
        if (flag === 'add') {
          this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : '';
          this.addOrEdit = 'add';
          this.titleTxt = '新增用户';
          this.dialogEditVisible = true;
          this.itemOfLists = {};
          this.proIdList = [];
          this.products = [];
          return
        }

        if (flag === "func") {
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要授权功能的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          this.currentRow.funcOrProc = flag;
          this.authTxt = "授权功能角色";
          this.dialogFuncVisible = true;
          this.getUserRoleList(flag);
        } else if (flag === "proc") {
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要授权流程的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          this.currentRow.funcOrProc = flag;
          this.authTxt = "授权流程角色";
          this.dialogFuncVisible = true;
          this.getUserRoleList(flag);
        } else if (flag === "reset") {
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要重置密码的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          // this.dialogResetVisible = true;
          this.$confirm('您确定要重置密码吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.resetPassword();
          }).catch(() => {

          });
        } else if (flag === "rest") {
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要休息的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }

          // this.dialogRestVisible = true;
          this.$confirm('确定操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updateValidFlag('1');
          }).catch(() => {

          });
        } else if (flag === "active") {
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要激活的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          // this.dialogActiveVisible = true;
          this.$confirm('确定操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updateValidFlag('0');
          }).catch(() => {

          });

        } else if (flag === "logout") {
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要注销的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          // this.dialoglogoutVisible = true;
          this.$confirm('确定操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updateValidFlag('2');
          }).catch(() => {

          });
        }
      },

      // 授权功能角色时，获取功能角色
      getUserRoleList(flag) {
        this.userRoleLists = [];
        this.roleInfoDtoList = [];
        var obj = {
          func: systemManageHttp.getUserRoleList,
          proc: systemManageHttp.getUserFlowRoleList,
        }
        obj[flag]({
            params: {
              userId: this.currentRow.id,
              timestamp: +new Date()
            }
          })
          .then(res => {
            this.userRoleLists = res.data.data;
            for (var i = 0, len = this.userRoleLists.length; i < len; i++) {
              this.userRoleLists[i].roleCode = this.userRoleLists[i].flowRoleCode ? this.userRoleLists[i].flowRoleCode :
                this.userRoleLists[i].roleCode;
              this.userRoleLists[i].roleName = this.userRoleLists[i].flowRoleName ? this.userRoleLists[i].flowRoleName :
                this.userRoleLists[i].roleName;
              if (this.userRoleLists[i].useFlag === '1' || this.userRoleLists[i].assignFlag === '1') {
                var obj = {};
                obj.id = this.userRoleLists[i].id;
                obj.useFlag = this.userRoleLists[i].useFlag;
                obj.assignFlag = this.userRoleLists[i].assignFlag;
                this.roleInfoDtoList.push(obj);
              }
            }
          })
      },

      // 授权功能角色时，弹窗的表格里勾选使用权限和可授权权限
      selectUseRoleFlag(row, uf, af) {
        var roleList = this.roleInfoDtoList;
        var fg = roleList.some(function (item) {
          return item.id === row.id
        });
        if (fg) {
          for (var i = 0, len = roleList.length; i < len; i++) {
            if (roleList[i] && roleList[i].id === row.id) {
              roleList[i].useFlag = uf ? uf + '' : '0';
              roleList[i].assignFlag = af ? af + '' : '0';
            }
          }
        } else {
          var obj = {};
          obj.id = row.id;
          obj.useFlag = uf ? uf + '' : '0';
          obj.assignFlag = af ? af + '' : '0';
          this.roleInfoDtoList.push(obj);
        }
      },

      // 授权功能角色
      grantUserRole() {
        if (this.currentRow.funcOrProc === 'func') {
          var fn = systemManageHttp.grantUserRole({
            id: this.currentRow.id,
            roleInfoDtoList: this.roleInfoDtoList
          })
        } else if (this.currentRow.funcOrProc === 'proc') {
          var fn = systemManageHttp.grantUserFlowRole({
            id: this.currentRow.id,
            flowRoleDtoList: this.roleInfoDtoList
          })
        }
        fn.then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.getUsers(this.queryParam);
              // this.getUserRoleList(this.currentRow.funcOrProc);
              this.userRoleLists = [];
              this.roleInfoDtoList = [];
              this.currentRow = null;
            } else {
              this.$message({
                message: '操作失败！',
                type: 'error'
              })
            }
          })
          .catch(err => {
            this.$message({
              message: '网络错误！',
              type: 'error'
            })
          });
        this.dialogFuncVisible = false;
      },


      // 重置密码
      resetPassword() {
        systemManageHttp
          .resetPwd({
            userIds: this.currentRow.id
          })
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.currentRow = null;
              this.getUsers(this.queryParam);
            } else {
              this.$message({
                message: '操作失败！',
                type: 'error'
              })
            }
          })
          .catch(err => {
            this.$message({
              message: '网络错误！',
              type: 'error'
            })
          });
        // this.dialogResetVisible = false;
      },

      // 启用停用休息角色
      updateValidFlag(flag) {
        systemManageHttp
          .updateUserValidFlag({
            params: {
              userId: this.currentRow.id,
              validFlag: flag,
              timestamp: +new Date()
            }
          })
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.currentRow = null;
              this.getUsers(this.queryParam);
            } else {
              this.$message({
                message: '操作失败！',
                type: 'error'
              })
            }
          })
          .catch(err => {
            this.$message({
              message: '网络错误！',
              type: 'error'
            })
          });
        // if (flag === "0") {
        //   this.dialogActiveVisible = false;
        // } else if (flag === "1") {
        //   this.dialogRestVisible = false;
        // } else if (flag === "2") {
        //   this.dialoglogoutVisible = false;
        // }
      },

      isIdNumber(value) {
        if (value === "01") {
          this.rules.certificateCode = [{
              required: true,
              message: '请输入证件号码',
              trigger: 'change'
            },
            {
              validator: this.checkIdNumber,
              trigger: 'change'
            }
          ];
        } else {
          this.rules.certificateCode = [{
            required: true,
            message: '请输入证件号码',
            trigger: 'change'
          }];
        }
      }

    },
    components: {
      //myHead
    }
  };

</script>

<style>
  .userManage .el-dialog .productName .el-select {
    width: 97%;
  }

  .userManage .el-dialog .productName .el-input__inner {
    width: 100%;
  }

  .userManage .el-dialog .productNameCheck .el-input__inner {
    width: 97% !important;
  }

  .userManage .el-dialog .orgStreet .el-input__inner {
    width: 97%;
    margin-top: 10px;
  }

  .userManage .el-dialog .el-form-item .dropdown {
    border: none;
    padding: 0px;
  }

  .userManage .el-dialog .el-form-item .dropdown .dropdownInputD1 .el-input__inner,
  .userManage .el-dialog .el-form-item .dropdown .dropdownInputD2 .el-input__inner,
  .userManage .el-dialog .el-form-item .dropdown .dropdownInputD3 .el-input__inner {
    cursor: pointer;
  }

  .userManage .functionalDialog .el-table {
    margin-left: 30px;
  }

  /* 必填项小星星上下居中对齐 */
  .userManage .el-form-item.is-required .el-form-item__label:before {
    /* display: inline-block;
  height: 20px;
  vertical-align: sub; */
  }

</style>
