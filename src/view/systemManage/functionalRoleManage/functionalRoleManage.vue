<!-- 系统管理-功能角色管理-->
<template>
  <div>
    <div class="main-div functionalRoleManage">
      <div class="keywordContainer search-div">
        <el-row class="row row1" type="flex">
          <el-col class="search-item" :span="6" :offset="0">
            <span class="keywordText">角色名称：</span>
            <el-input class="" v-model="roleName" placeholder="请输入角色名称"></el-input>
          </el-col>
          <el-col class="search-item" :span="6" :offset="0">
            <span class="keywordText">角色编号：</span>
            <el-input class="" v-model="roleCode" placeholder="请输入角色编号"></el-input>
          </el-col>
          <el-col class="search-item" :span="6" :offset="0"></el-col>
          <el-col class="search-item search-btn" :span="6">
            <el-button class="btn query" type="primary" @click="getRolesByKey">查询</el-button>
            <el-button class="btn reset" @click="reset">重置</el-button>
          </el-col>
          <!-- <el-col :span="8">
          <span class="keywordText">资源名称</span><el-input class="" v-model="resourceName" placeholder="请输入资源名称"></el-input>
        </el-col> -->
        </el-row>
      </div>

      <!-- 列表 -->
      <div class="title titleContainer edit-div">
        <span class="titleText">
          <i class="el-icon title-icon"></i>
          功能角色列表
        </span>
        <span class="iconContainer">
          <span class="icon-item" @click="handleItem('add')">
            <i class="el-icon addIcon"></i><span class="el-icon-text">新增</span>
          </span>
          <span class="icon-item" @click="handleItem('auth')">
            <i class="el-icon authIcon"></i><span class="el-icon-text">授权</span>
          </span>
          <span class="icon-item" @click="handleItem('stop')">
            <i class="el-icon restIcon"></i><span class="el-icon-text">停用</span>
          </span>
          <span class="icon-item" @click="handleItem('enable')">
            <i class="el-icon enableIcon"></i><span class="el-icon-text">启用</span>
          </span>
        </span>
      </div>

      <div class="listContainer">
        <el-table :data="roleDatas" border height="510" show-header highlight-current-row @row-click="selectRow">
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="roleCode" label="角色编号" width="120">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="120">
          </el-table-column>
          <el-table-column prop="resNameList" label="拥有资源" show-overflow-tooltip min-width="450">
          </el-table-column>
          <el-table-column prop="roleRemark" label="备注" width="275">
          </el-table-column>
          <el-table-column prop="validFlagTxt" label="状态" width="80">
          </el-table-column>
          <el-table-column prop="" label="操作" width="130" fixed="right">
            <template slot-scope="scope">
              <el-button class="btn-sm edit" size="small" type="text" @click="getItem('edit',scope.row)">编辑</el-button>
              <el-button class="btn-sm check" size="small" type="text" @click="getItem('check',scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 页码 -->
        <div class="page">
          <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page.sync="currentPage"
            :page-sizes=pageSizesArr :page-size=setPageSize layout="total, sizes, prev, pager, next, jumper" :total=responseDatas.totalRecord>
          </el-pagination>
        </div>
      </div>



      <!-- 添加角色框 -->
      <el-dialog title="新增角色" :visible.sync="dialogAddVisible">
        <el-form :model="newItem" :rules="rulesAdd" ref="ruleFormAdd">
          <el-form-item label="角色名称：" prop="roleName" :label-width="formLabelWidth">
            <el-input v-model="newItem.roleName" auto-complete="off" @blur="checkCodeUniq('add','roleName')"></el-input>
          </el-form-item>
          <el-form-item label="角色编号：" prop="roleCode" :label-width="formLabelWidth">
            <el-input v-model="newItem.roleCode" auto-complete="off" @blur="checkCodeUniq('add','roleCode')"></el-input>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth">
            <el-input type="number" v-model="newItem.roleSeq" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="roleRemark" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="3" v-model="newItem.roleRemark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loadingFlag" @click="addRole('ruleFormAdd')">{{loadingTxt}}</el-button>
        </div>
      </el-dialog>

      <!-- 编辑框 -->
      <el-dialog title="编辑角色" :visible.sync="dialogEditVisible">
        <el-form :model="itemOfLists" :rules="rulesEdit" ref="ruleFormEdit">
          <el-form-item label="角色名称：" prop="roleName" :label-width="formLabelWidth">
            <el-input v-model="itemOfLists.roleName" auto-complete="off" @blur="checkCodeUniq('edit','roleName')"></el-input>
          </el-form-item>
          <el-form-item label="角色编号：" prop="roleCode" :label-width="formLabelWidth">
            <el-input v-model="itemOfLists.roleCode" auto-complete="off" @blur="checkCodeUniq('edit','roleCode')"></el-input>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth">
            <el-input type="number" v-model="itemOfLists.roleSeq" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="roleRemark" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="3" v-model="itemOfLists.roleRemark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loadingFlag" @click="commitEditedItem('ruleFormEdit')">{{loadingTxt}}</el-button>
        </div>
      </el-dialog>

      <!-- 查看框 -->
      <el-dialog title="角色详情" :visible.sync="dialogCheckVisible">
        <el-form :model="itemOfLists">
          <el-form-item label="角色名称：" :label-width="formLabelWidth">
            <el-input v-model="itemOfLists.roleName" auto-complete="off" :readonly="read"></el-input>
          </el-form-item>
          <el-form-item label="角色编号：" :label-width="formLabelWidth">
            <el-input v-model="itemOfLists.roleCode" auto-complete="off" :readonly="read"></el-input>
          </el-form-item>
          <el-form-item label="排序：" :label-width="formLabelWidth">
            <el-input type="number" v-model="itemOfLists.roleSeq" auto-complete="off" :readonly="read"></el-input>
          </el-form-item>
          <el-form-item label="备注：" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="3" v-model="itemOfLists.roleRemark" :readonly="read"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 授权框 -->
      <el-dialog title="授权角色" custom-class="authDialog" :visible.sync="dialogAuthVisible">
        <el-tabs v-model="activeName" @tab-click="tabChange">
          <el-tab-pane label="用户资源" name="yonghu">用户资源</el-tab-pane>
          <el-tab-pane label="风控资源" name="fengkong">风控资源</el-tab-pane>
          <el-tab-pane label="信贷资源" name="xindai">信贷资源</el-tab-pane>
          <el-tab-pane label="系统报表" name="baobiao">系统报表</el-tab-pane>
          <el-tab-pane label="信贷APP后台" name="creditApp">信贷APP后台</el-tab-pane>
          <el-tab-pane label="普惠金融" name="prattFin">普惠金融</el-tab-pane>
        </el-tabs>
        <el-tree v-show="tabFlag === 'yh'" ref="tree_yh" :data="resDatasObj.yh" show-checkbox node-key="id" :props="defaultProps">
        </el-tree>
        <el-tree v-show="tabFlag === 'fk'" ref="tree_fk" :data="resDatasObj.fk" show-checkbox node-key="id" :props="defaultProps">
        </el-tree>
        <el-tree v-show="tabFlag === 'xd'" ref="tree_xd" :data="resDatasObj.xd" show-checkbox node-key="id" :props="defaultProps">
        </el-tree>
        <el-tree v-show="tabFlag === 'bb'" ref="tree_bb" :data="resDatasObj.bb" show-checkbox node-key="id" :props="defaultProps">
        </el-tree>
        <!-- 信贷app后台 -->
        <el-tree v-show="tabFlag === 'creditApp'" ref="tree_creditApp" :data="resDatasObj.creditApp" show-checkbox
          node-key="id" :props="defaultProps">
        </el-tree>
        <!-- 普惠金融 prattFin-->
        <el-tree v-show="tabFlag === 'prattFin'" ref="tree_prattFin" :data="resDatasObj.prattFin" show-checkbox
          node-key="id" :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAuthVisible = false">取 消</el-button>
          <el-button type="primary" @click="grantRes">授 权</el-button>
        </div>
      </el-dialog>

      <!-- 停用 -->
      <!-- <el-dialog title="询问" :visible.sync="dialogStopVisible" width="30%">
      <span>确定操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStopVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateValidFlag('0')">确 定</el-button>
      </span>
    </el-dialog> -->

      <!-- 启用 -->
      <!-- <el-dialog title="询问" :visible.sync="dialogEnableVisible" width="30%">
      <span>确定操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEnableVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateValidFlag('1')">确 定</el-button>
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
      return {
        roleName: "",
        roleCode: "",
        resourceName: "",
        read: false,
        responseDatas: {}, // 角色列表请求的返回值
        roleDatas: [], // 角色列表数组

        currentRow: {}, // 当前选中的那一行数据
        newItem: {
          roleName: '',
          roleCode: '',
        }, // 添加一行数据
        rulesAdd: {
          roleName: [{
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }],
          roleCode: [{
            required: true,
            message: '请输入角色编号',
            trigger: 'blur'
          }],
          roleRemark: [{
            max: 66,
            message: '输入长度不能超过 66',
            trigger: 'change'
          }]
        },

        itemOfLists: {
          roleName: '',
          roleCode: '',
        }, // 编辑、查看、授权某一条数据前，根据 id 查询其详细数据
        rulesEdit: {
          roleName: [{
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }],
          roleCode: [{
            required: true,
            message: '请输入角色编号',
            trigger: 'blur'
          }],
          roleRemark: [{
            max: 66,
            message: '输入长度不能超过 66',
            trigger: 'change'
          }]
        },

        currentPage: 1, // 默认显示的当前页
        pageSizesArr: [10, 20, 30, 40, 50], // 每页显示的数据数
        setPageSize: 10,

        resDatasObj: {
          yh: [],
          fk: [],
          xd: [],
          bb: [],
          creditApp: [],
        }, // 资源数据列表对象
        defaultProps: {
          children: 'children',
          label: 'resName'
        },

        queryParam: {
          // 查询角色的入参
          roleCode: "",
          roleName: "",
          roleName_la: "",
          pageNum: 1,
          pageSize: 10,
          orders: null
        },
        dialogAddVisible: false,
        dialogAuthVisible: false,
        dialogEditVisible: false,
        dialogCheckVisible: false,
        formLabelWidth: "120px",
        activeName: 'yonghu',

        param: {
          reqFlag: "04",
          resType: "",
          validFlag: "",
          recursiveFlag: 1,
          pid: "",
        }, //tab 切换时的入参

        tabFlag: 'yh',

        // 加载中
        loadingFlag: false,
        loadingTxt: "确 定",

      };
    },
    /*watch: {
      '$route' (to, from) {
        if (to.path == '/functionalRoleManage') {
          this.getAllResTree();
          this.getRolesAll();
        }
      }
    },*/
    mounted() {
      this.getAllResTree();
      this.getRolesAll();
    },

    methods: {
      // 流程角色更改 验证 角色编号 角色名称
      checkCodeUniq(type, val) {
        // 新增/编辑
        if (type == 'add' && val == 'roleCode') { // 新增 用户编码
          // this.checkObj.roleCode = this.newItem.roleCode;
          if (!this.newItem.roleCode) return;
          this.checkObj = {
            roleCode: this.newItem.roleCode
          };

        } else if (type == 'add' && val == 'roleName') { // 新增 用户名称
          // this.checkObj.roleName = this.newItem.roleName;
          if (!this.newItem.roleName) return;
          this.checkObj = {
            roleName: this.newItem.roleName
          };
        } else if (type == 'edit' && val == 'roleCode') { // 编辑 用户编码
          // this.checkObj.id == this.itemOfLists.id;
          // this.checkObj.roleCode = this.itemOfLists.roleCode;
          if (!this.itemOfLists.roleCode) return;
          this.checkObj = {
            id: this.itemOfLists.id,
            roleCode: this.itemOfLists.roleCode
          }
        } else if (type == 'edit' && val == 'roleName') { // 编辑 用户名称
          // this.checkObj.id = this.itemOfLists.id;
          // this.checkObj.roleName = this.itemOfLists.roleName;
          if (!this.itemOfLists.roleName) return;
          this.checkObj = {
            id: this.itemOfLists.id,
            roleName: this.itemOfLists.roleName
          };
        }
        systemManageHttp
          .checkRoleCodeUniq({
            params: this.checkObj
          })
          .then(res => {
            if (res.data.data) {

            } else {
              this.$message({
                message: res.data.msg + '！',
                type: 'warning'
              });
              this.newItem.roleCode = '';
              this.newItem.roleName = '';
              this.itemOfLists.roleCode = '';
              this.itemOfLists.roleName = '';
              return;
            }
          })
          .catch(err => {})
      },
      //请求数据接口
      getRoles(param) {
        systemManageHttp
          .getRoles(this.queryParam)
          .then(res => {
            this.currentRow = {};
            this.responseDatas = res.data.data;
            this.roleDatas = this.responseDatas.recordList;
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 根据 id 查询角色
      getRoleById(id) {
        systemManageHttp
          .getRoleById({
            params: {
              roleId: id,
              timestamp: +new Date()
            }
          })
          .then(res => {
            this.itemOfLists = res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      },

      // 请求全部数据
      getRolesAll() {
        this.queryParam.roleCode = "";
        this.queryParam.roleName_la = "";
        this.queryParam.pageNum = 1;
        this.queryParam.pageSize = 10;
        this.queryParam.orders = null;
        (this.setPageSize = 10), (this.currentPage = 1);
        this.getRoles(this.queryParam);
      },
      // 查询按钮
      getRolesByKey() {
        this.queryParam.roleCode = this.roleCode;
        this.queryParam.roleName_la = this.roleName;
        this.getRoles(this.queryParam);
      },
      // 重置按钮
      reset() {
        this.roleCode = "";
        this.roleName = "";
        this.getRolesAll();
      },
      // 每页条数变化时，重新请求
      changePageSize(val) {
        this.queryParam.pageSize = val;
        this.queryParam.pageNum = 1;
        if (this.currentPage !== 1 || this.setPageSize !== 10) {
          this.currentPage = 1;
          this.setPageSize = 10;
        } else {
          this.getRoles(this.queryParam);
        }
      },
      // 改变页码时，重新请求
      changeCurrentPage(val) {
        this.queryParam.pageNum = val;
        this.getRoles(this.queryParam);
      },

      // 查看或编辑条目
      getItem(flag, item) {
        if (flag === "edit") {
          this.dialogEditVisible = true;
          this.$refs['ruleFormEdit'] ? this.$refs['ruleFormEdit'].resetFields() : '';
          this.loadingFlag = false;
          this.loadingTxt = "确 定";
        } else {
          this.read = true;
          this.dialogCheckVisible = true;
        }
        this.getRoleById(item.id);
      },
      // 提交编辑过的条目
      commitEditedItem(formName) {
        var checkFlag = '';
        this.$refs[formName].validate((valid) => {
          if (valid) {
            checkFlag = true;
          } else {
            checkFlag = false;
          }
        });
        if (!checkFlag) {
          return
        }

        this.loadingFlag = true;
        this.loadingTxt = "加载中";

        systemManageHttp
          .updateRole(this.itemOfLists)
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.getRoles(this.queryParam);
              this.dialogEditVisible = false;
            } else {
              this.$message({
                message: '操作失败！',
                type: 'error'
              })
              this.dialogEditVisible = false;
            }
          })
          .catch(err => {
            this.$message({
              message: '网络错误！',
              type: 'error'
            })
            this.dialogEditVisible = false;
          });
      },

      // 授权、启用、停用
      handleItem(flag) {
        if (flag === "add") {
          this.dialogAddVisible = true;
          this.$refs['ruleFormAdd'] ? this.$refs['ruleFormAdd'].resetFields() : '';
          this.loadingFlag = false;
          this.loadingTxt = "确 定";
          return;
        }
        // 授权
        if (flag === "auth") {
          // 未选中提示
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要授权功能角色的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          this.dialogAuthVisible = true;
          setTimeout(() => {
            this.$refs.tree_yh.setCheckedKeys(this.setCheckBoxById(this.resDatasObj.yh))
            this.$refs.tree_fk.setCheckedKeys(this.setCheckBoxById(this.resDatasObj.fk))
            this.$refs.tree_xd.setCheckedKeys(this.setCheckBoxById(this.resDatasObj.xd))
            this.$refs.tree_bb.setCheckedKeys(this.setCheckBoxById(this.resDatasObj.bb))
            // 信贷app后台
            this.$refs.tree_creditApp.setCheckedKeys(this.setCheckBoxById(this.resDatasObj.creditApp))
            // 普惠金融
            this.$refs.tree_prattFin.setCheckedKeys(this.setCheckBoxById(this.resDatasObj.prattFin))
          }, 500);
        } else if (flag === "stop") {
          // 未选中提示
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要停用功能角色的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          // 无效 -> 无效
          if (this.currentRow.validFlagTxt == '无效' && flag === "stop") {
            this.$confirm('不允许停用“无效”状态的角色！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          // this.dialogStopVisible = true;
          this.$confirm('您确定要停用该功能角色吗？', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            this.updateValidFlag('0');
          }).catch(() => {

          });
        } else if (flag === "enable") {
          // 未选中提示
          if (!this.currentRow || !this.currentRow.id) {
            // this.dialogAlertVisible = true;
            this.$confirm('请选择要启用功能角色的用户！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          // 有效 -> 有效
          if (this.currentRow.validFlagTxt == '有效' && flag === "enable") {
            this.$confirm('不允许启用“有效”状态的角色！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          // this.dialogEnableVisible = true;
          this.$confirm('您确定要启用该功能角色吗？', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
            this.updateValidFlag('1');
          }).catch(() => {

          });
        }
      },

      // 选中某一行
      selectRow(row, event, column) {
        this.currentRow = row;
      },

      // 启用停用角色
      updateValidFlag(flag) {
        systemManageHttp
          .updateValidFlag({
            params: {
              roleId: this.currentRow.id,
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
              this.getRoles(this.queryParam);
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
        if (flag === "0") {
          this.dialogStopVisible = false;
        } else {
          this.dialogEnableVisible = false;
        }
      },

      // 新增角色
      addRole(formName) {
        var checkFlag = '';
        this.$refs[formName].validate((valid) => {
          if (valid) {
            checkFlag = true;
          } else {
            checkFlag = false;
          }
        });
        if (!checkFlag) {
          return
        }
        this.loadingFlag = true;
        this.loadingTxt = "加载中";

        systemManageHttp
          .addRole({
            roleCode: this.newItem.roleCode,
            roleName: this.newItem.roleName,
            roleRemark: this.newItem.roleRemark,
            // pid: "",
            roleSeq: this.newItem.roleSeq
            // validFlag: "",
            // modelFlag: ""
          })
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.newItem = {};
              this.getRoles(this.queryParam);
              this.dialogAddVisible = false;
            } else {
              this.$message({
                message: '操作失败！',
                type: 'error'
              })
              this.dialogAddVisible = false;
            }
          }).catch(err => {
            this.$message({
              message: '网络错误！',
              type: 'error'
            })
            this.dialogAddVisible = false;
          });

      },

      // 根据资源 id 匹配树形控件的复选框
      setCheckBoxById(allTreeArr) {
        var selectIdsArr = this.currentRow.resIdList.split(",");
        var showIdsArr = [];

        for (var i = 0, len = selectIdsArr.length; i < len; i++) {
          allTreeArr.forEach(function (item) {
            if (selectIdsArr[i] === item.id) {
              if (item.hasChildren === "0") {
                showIdsArr.push(selectIdsArr[i]);
              } else {
                item.children.forEach(function (ite) {
                  selectIdsArr.forEach(function (it) {
                    if (it === ite.id) {
                      if (ite.hasChildren === "0") {
                        showIdsArr.push(it);
                      } else {
                        ite.children.forEach(function (i) {
                          selectIdsArr.forEach(function (ii) {
                            if (ii === i.id) {
                              if (i.hasChildren === "0") {
                                showIdsArr.push(ii);
                              }
                            }
                          })
                        })
                      }
                    }
                  })
                })
              }
            }
          })
        }
        return showIdsArr
      },
      // 获取全部系统资源
      getAllResTree() {
        systemManageHttp.getResTree({
          reqFlag: "04",
          validFlag: "",
          recursiveFlag: 1,
        }).then(res => {
          this.resDatasObj.yh = res.data.data
        });
        systemManageHttp.getResTree({
          reqFlag: "02",
          validFlag: "",
          recursiveFlag: 1,
        }).then(res => {
          this.resDatasObj.fk = res.data.data
        });
        systemManageHttp.getResTree({
          reqFlag: "01",
          validFlag: "",
          recursiveFlag: 1,
        }).then(res => {
          this.resDatasObj.xd = res.data.data
        });
        systemManageHttp.getResTree({
          reqFlag: "05",
          validFlag: "",
          recursiveFlag: 1,
        }).then(res => {
          this.resDatasObj.bb = res.data.data
        });
        // 信贷app后台
        systemManageHttp.getResTree({
          reqFlag: "07",
          validFlag: "",
          recursiveFlag: 1,
        }).then(res => {
          this.resDatasObj.creditApp = res.data.data
        });
        // 普惠金融
        systemManageHttp.getResTree({
          reqFlag: "08",
          validFlag: "",
          recursiveFlag: 1,
        }).then(res => {
          this.resDatasObj.prattFin = res.data.data
        });
      },

      // 切换 tab
      tabChange(tab) {
        if (tab.name === 'yonghu') {
          this.tabFlag = "yh";
        } else if (tab.name === 'fengkong') {
          this.tabFlag = "fk";
        } else if (tab.name === 'xindai') {
          this.tabFlag = "xd";
        } else if (tab.name === 'baobiao') {
          this.tabFlag = "bb";
        } else if (tab.name === 'creditApp') {
          this.tabFlag = 'creditApp'
        } else if (tab.name === 'prattFin') {
          this.tabFlag = 'prattFin'
        }
      },

      // 角色授权
      grantRes() {
        var resIdList_yh = this.$refs.tree_yh.getCheckedKeys().concat(this.$refs.tree_yh.getHalfCheckedKeys());
        var resIdList_fk = this.$refs.tree_fk.getCheckedKeys().concat(this.$refs.tree_fk.getHalfCheckedKeys());
        var resIdList_xd = this.$refs.tree_xd.getCheckedKeys().concat(this.$refs.tree_xd.getHalfCheckedKeys());
        var resIdList_bb = this.$refs.tree_bb.getCheckedKeys().concat(this.$refs.tree_bb.getHalfCheckedKeys());
        // 信贷app后台
        var resIdList_creditApp = this.$refs.tree_creditApp.getCheckedKeys().concat(this.$refs.tree_creditApp.getHalfCheckedKeys());
        // 普惠金融 prattFin
        var resIdList_prattFin = this.$refs.tree_prattFin.getCheckedKeys().concat(this.$refs.tree_prattFin.getHalfCheckedKeys());

        systemManageHttp.grantRes({
            id: this.currentRow.id,
            resIdList: resIdList_yh.concat(resIdList_fk).concat(resIdList_xd).concat(resIdList_bb).concat(
              resIdList_creditApp).concat(resIdList_prattFin).join(',')
          }).then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.getRoles(this.queryParam);
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
        this.dialogAuthVisible = false;
      },

    },
  };

</script>

<style>
  .functionalRoleManage .el-tree {
    height: 500px;
    overflow-y: auto;
  }

  /* 授权时，不同资源的 Tab 切换，去掉内容显示 */
  .functionalRoleManage .el-dialog .el-tabs__content {
    height: 0;
  }

  .functionalRoleManage .el-dialog.authDialog .el-dialog__body {
    padding: 0 20px;
  }

</style>
