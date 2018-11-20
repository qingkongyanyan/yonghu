<!-- 系统管理-流程角色管理-->
<template>
  <div>
    <div class="processRoleManage main-div">
      <!-- 关键字查询 -->
      <div class="keywordContainer search-div">
        <el-row class="row row1" type="flex">
          <el-col class="search-item" :span="6" :offset="0">
            <span class="keywordText">角色名称：</span>
            <el-input class="" v-model="flowRoleName" placeholder="请输入角色名称"></el-input>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">角色编号：</span>
            <el-input class="" v-model="flowRoleCode" placeholder="请输入角色编号"></el-input>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">角色类别：</span>
            <el-select v-model="roleCate" placeholder="请选择">
              <el-option v-for="item in roleCates" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="search-item search-btn" :span="6" :offset="0">
            <el-button class="btn query" type="primary" @click="getRolesByKey">查询</el-button>
            <el-button class="btn reset" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 列表 -->
      <div class="title titleContainer edit-div">
        <span class="titleText">
          <i class="el-icon title-icon"></i>
          流程角色列表
        </span>
        <span class="iconContainer">
          <span class="icon-item" @click="handleItem('add')">
            <i class="el-icon addIcon"></i><span class="el-icon-text">新增</span>
          </span>
        </span>
      </div>
      <div class="listContainer">
        <el-table :data="roleDatas" height="510" border show-header highlight-current-row @row-click="selectRow">
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="flowRoleCode" label="流程角色编号" min-width="100">
          </el-table-column>
          <el-table-column prop="flowRoleName" label="流程角色名称" min-width="140">
          </el-table-column>
          <el-table-column prop="roleCateTxt" label="角色类别" min-width="140">
          </el-table-column>
          <el-table-column prop="minAuditAmt" label="最低审批金额[元]" :formatter="money" width="140">
          </el-table-column>
          <el-table-column prop="maxAuditAmt" label="最高审批金额[元]" :formatter="money" width="140">
          </el-table-column>
          <el-table-column prop="queueNum" label="队列数" width="100">
          </el-table-column>
          <el-table-column prop="suspendNum" label="挂起数" width="100">
          </el-table-column>
          <el-table-column prop="" label="操作" width="130" fixed="right">
            <template slot-scope="scope">
              <el-button class="btn-sm edit" size="small" type="text" @click="getItem('edit',scope.row)">编辑</el-button>
              <el-button class="btn-sm check" size="small" type="text" @click="getItem('check',scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page.sync="currentPage"
            :page-sizes='pageSizesArr' :page-size='setPageSize' layout="total, sizes, prev, pager, next, jumper" :total='responseDatas.totalRecord'>
          </el-pagination>
        </div>
      </div>
      <!-- 添加角色框 -->
      <el-dialog title="新增角色" :visible.sync="dialogAddVisible">
        <el-form :model="newItem" :rules="rulesAdd" ref="ruleFormAdd">
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="角色编号：" prop="flowRoleCode" :label-width="formLabelWidth">
              <el-input v-model="newItem.flowRoleCode" auto-complete="off" @blur="checkCodeUniq('add','flowRoleCode')"></el-input>
            </el-form-item>
            <el-form-item label="角色名称：" prop="flowRoleName" :label-width="formLabelWidth">
              <el-input v-model="newItem.flowRoleName" auto-complete="off" @blur="checkCodeUniq('add','flowRoleName')"></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="队列数：" :label-width="formLabelWidth">
              <el-input min="1" max="9999" type="number" v-model="newItem.queueNum" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="挂起数：" :label-width="formLabelWidth">
              <el-input min="1" max="999" type="number" v-model="newItem.suspendNum" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="最低审批金额[元]：" :label-width="formLabelWidth">
              <el-input v-model="newItem.minAuditAmt" auto-complete="off" @blur="moneyFormat" v-onlyNumber></el-input>
            </el-form-item>
            <el-form-item label="最高审批金额[元]：" :label-width="formLabelWidth">
              <el-input v-model="newItem.maxAuditAmt" auto-complete="off" @blur="moneyFormat" v-onlyNumber></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="角色类别：" :label-width="formLabelWidth">
              <el-select v-model="newItem.roleCate" placeholder="请选择">
                <el-option v-for="item in roleCates" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="角色描述：" prop="flowRoleRemark" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="3" v-model="newItem.flowRoleRemark"></el-input>
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
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="角色编号：" prop="flowRoleCode" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.flowRoleCode" auto-complete="off" @blur="checkCodeUniq('edit','flowRoleCode')"></el-input>
            </el-form-item>
            <el-form-item label="角色名称：" prop="flowRoleName" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.flowRoleName" auto-complete="off" @blur="checkCodeUniq('edit','flowRoleName')"></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="队列数：" :label-width="formLabelWidth">
              <el-input min="1" max="9999" type="number" v-model="itemOfLists.queueNum" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="挂起数：" :label-width="formLabelWidth">
              <el-input min="1" max="999" type="number" v-model="itemOfLists.suspendNum" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="最低审批金额[元]：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.minAuditAmt" auto-complete="off" @blur="moneyFormat" v-onlyNumber></el-input>
            </el-form-item>
            <el-form-item label="最高审批金额[元]：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.maxAuditAmt" auto-complete="off" @blur="moneyFormat" v-onlyNumber></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="角色类别：" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.roleCate" placeholder="请选择">
                <el-option v-for="item in roleCates" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="角色描述：" prop="flowRoleRemark" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="3" v-model="itemOfLists.flowRoleRemark"></el-input>
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
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="角色编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.flowRoleCode"></el-input>
            </el-form-item>
            <el-form-item label="角色名称：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.flowRoleName"></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="队列数：" :label-width="formLabelWidth">
              <el-input min="1" max="9999" readonly type="number" v-model="itemOfLists.queueNum"></el-input>
            </el-form-item>
            <el-form-item label="挂起数：" :label-width="formLabelWidth">
              <el-input min="1" max="999" readonly type="number" v-model="itemOfLists.suspendNum"></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="最低审批金额[元]：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.minAuditAmt"></el-input>
            </el-form-item>
            <el-form-item label="最高审批金额[元]：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.maxAuditAmt"></el-input>
            </el-form-item>
          </div>
          <div style="display:flex;justify-content: space-between;">
            <el-form-item label="角色类别：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.roleCateTxt"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="角色描述：" :label-width="formLabelWidth">
            <el-input readonly type="textarea" :rows="3" v-model="itemOfLists.flowRoleRemark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import systemManageHttp from "../systemManage_ser";
  export default {
    data() {
      return {
        userInf: {},
        flowRoleName: "",
        flowRoleCode: "",
        roleCate: "",

        roleCates: [{
          value: '01',
          label: '信销管理'
        }, {
          value: '02',
          label: '信用管理'
        }, {
          value: '03',
          label: '财富管理'
        }, {
          value: '04',
          label: '运营管理'
        }, {
          value: '05',
          label: '催收管理'
        }, {
          value: '06',
          label: '欺诈管理'
        }, {
          value: '07',
          label: '结算管理'
        }, {
          value: '08',
          label: '抵押管理'
        }],
        responseDatas: {}, // 角色列表请求的返回值
        roleDatas: [], // 角色列表数组
        currentRow: {}, // 当前选中的那一行数据
        newItem: {
          flowRoleCode: '',
          flowRoleName: '',
          minAuditAmt: '',
          maxAuditAmt: '',
          roleCate: '', //角色类别
          flowRoleRemark: '', //角色描述
          suspendNum: '',
          queueNum: ''
        }, // 添加一行数据
        rulesAdd: {
          flowRoleCode: [{
            required: true,
            message: '请输入角色编号',
            trigger: 'blur'
          }],
          flowRoleName: [{
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }],
          flowRoleRemark: [{
            max: 66,
            message: '输入长度不能超过 66',
            trigger: 'change'
          }],
          // minAuditAmt: [
          //   { validator: parseFloat(this.newItem.minAuditAmt.split(',').join("")) > parseFloat(this.newItem.maxAuditAmt.split(',').join("")), message: '应小于最高审批金额', trigger: 'blur' }
          // ],
        },
        itemOfLists: {
          flowRoleCode: '',
          flowRoleName: '',
        }, // 编辑、查看、授权某一条数据前，根据 id 查询其详细数据
        rulesEdit: {
          flowRoleCode: [{
            required: true,
            message: '请输入角色编号',
            trigger: 'blur'
          }],
          flowRoleName: [{
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }],
          flowRoleRemark: [{
            max: 66,
            message: '输入长度不能超过 66',
            trigger: 'change'
          }]
        },
        currentPage: 1, // 默认显示的当前页
        pageSizesArr: [10, 20, 30, 40, 50], // 每页显示的数据数
        setPageSize: 10,
        resDatas: [], // 资源数据列表
        defaultProps: {
          children: 'children',
          label: 'resName'
        },
        queryParam: {
          // 查询流程角色的入参
          flowRoleCode: "",
          flowRoleName_la: "",
          roleCate: "",
          pageNum: 1,
          pageSize: 10,
          orders: null
        },
        dialogAddVisible: false, //添加框
        dialogEditVisible: false, // 编辑框
        dialogCheckVisible: false, // 查看框
        formLabelWidth: "140px",
        // 加载中
        loadingFlag: false,
        loadingTxt: "确 定",
        // 角色编号/名称 校验
        checkObj: {}
      };
    },
    mounted() {
      this.getUserInf();
      this.getRolesAll();
    },

    methods: {
      // 流程角色更改 验证 角色编号 角色名称
      checkCodeUniq(type, val) {
        // 新增/编辑
        if (type == 'add' && val == 'flowRoleCode') { // 新增 用户编码
          // this.checkObj.flowRoleCode = this.newItem.flowRoleCode;
          if (this.newItem.flowRoleCode) {
            this.checkObj = {
              flowRoleCode: this.newItem.flowRoleCode
            };
            this.checkFlowCodeUniq();
          } else
            return;
        } else if (type == 'add' && val == 'flowRoleName') { // 新增 用户名称
          // this.checkObj.flowRoleName = this.newItem.flowRoleName;
          if (this.newItem.flowRoleName) {
            this.checkObj = {
              flowRoleName: this.newItem.flowRoleName
            };
            this.checkFlowCodeUniq();
          } else
            return;
        } else if (type == 'edit' && val == 'flowRoleCode') { // 编辑 用户编码
          // this.checkObj.id == this.itemOfLists.id;
          // this.checkObj.flowRoleCode = this.itemOfLists.flowRoleCode;
          if (this.itemOfLists.id && this.itemOfLists.flowRoleCode) {
            this.checkObj = {
              id: this.itemOfLists.id,
              flowRoleCode: this.itemOfLists.flowRoleCode
            };
            this.checkFlowCodeUniq();
          } else
            return;
        } else if (type == 'edit' && val == 'flowRoleName') { // 编辑 用户名称
          // this.checkObj.id = this.itemOfLists.id;
          // this.checkObj.flowRoleName = this.itemOfLists.flowRoleName;
          if (this.itemOfLists.id && this.itemOfLists.flowRoleName) {
            this.checkObj = {
              id: this.itemOfLists.id,
              flowRoleName: this.itemOfLists.flowRoleName
            };
            this.checkFlowCodeUniq();
          } else
            return;
        }
      },
      checkFlowCodeUniq() {
        systemManageHttp
          .checkFlowCodeUniq({
            params: this.checkObj
          })
          .then(res => {
            if (res.data.data) {

            } else {
              this.$message({
                message: res.data.msg + '！',
                type: 'warning'
              });
              this.newItem.flowRoleCode = '';
              this.this.newItem.flowRoleName = '';
              this.itemOfLists.flowRoleCode = '';
              this.itemOfLists.flowRoleName = '';
              return;
            }
          })
          .catch(err => {})
      },
      getUserInf() {
        this.userInf = JSON.parse(localStorage.getItem("userInf"));
      },
      //请求数据接口
      getRoles(param) {
        systemManageHttp
          .getFlowRoleByPage(this.queryParam)
          .then(res => {
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
          .getFlowRoleById({
            params: {
              id: id,
              timestamp: +new Date()
            }
          })
          .then(res => {
            this.itemOfLists = res.data.data;
            this.itemOfLists.maxAuditAmt = this.initMoneyFormat(this.itemOfLists.maxAuditAmt);
            this.itemOfLists.minAuditAmt = this.initMoneyFormat(this.itemOfLists.minAuditAmt);
          })
          .catch(err => {
            console.log(err);
          });
      },
      // 请求全部数据
      getRolesAll() {
        this.queryParam.flowRoleCode = "";
        this.queryParam.flowRoleName_la = "";
        this.queryParam.roleCate = "";
        this.queryParam.pageNum = 1;
        this.queryParam.pageSize = 10;
        this.queryParam.orders = null;
        (this.setPageSize = 10), (this.currentPage = 1);
        this.getRoles(this.queryParam);
      },
      // 查询按钮
      getRolesByKey() {
        this.queryParam.flowRoleCode = this.flowRoleCode;
        this.queryParam.flowRoleName_la = this.flowRoleName;
        this.queryParam.roleCate = this.roleCate;
        this.getRoles(this.queryParam);
      },
      // 重置按钮
      reset() {
        this.flowRoleCode = "";
        this.flowRoleName = "";
        this.roleCate = "";
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

      // 授权、启用、停用
      handleItem(flag) {
        if (flag === "add") {
          this.dialogAddVisible = true;
          this.$refs['ruleFormAdd'] ? this.$refs['ruleFormAdd'].resetFields() : '';
          return;
        }
      },

      // 查看或编辑条目
      getItem(flag, item) {
        if (flag === "edit") {
          this.dialogEditVisible = true;
          this.$refs['ruleFormEdit'] ? this.$refs['ruleFormEdit'].resetFields() : '';
        } else {
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
        var reg=/,/g;
        if (!checkFlag) {
          return
        }
        this.loadingFlag = true;
        this.loadingTxt = "加载中";
        this.itemOfLists.maxAuditAmt = this.itemOfLists.maxAuditAmt.toString().replace(/,/g, "");
        this.itemOfLists.minAuditAmt = this.itemOfLists.minAuditAmt.toString().replace(/,/g, "");
        if (this.itemOfLists.maxAuditAmt&&(this.itemOfLists.minAuditAmt*1 > this.itemOfLists.maxAuditAmt*1)) {
          this.$message.error('最低审批金额不能大于最高审批金额！')
          return
        }
        systemManageHttp
          .modifyFlowRole(this.itemOfLists)
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.dialogEditVisible = false;
              this.getRoles(this.queryParam);
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

      // 选中某一行
      selectRow(row, event, column) {
        this.currentRow = row;
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
        if (this.newItem.maxAuditAmt&&(this.newItem.minAuditAmt*1 > this.newItem.maxAuditAmt*1)) {
          this.$message.error('最低审批金额不能大于最高审批金额！')
          return
        }
        this.loadingFlag = true;
        this.loadingTxt = "加载中";
        systemManageHttp
          .addFlowRole({
            flowRoleCode: this.newItem.flowRoleCode,
            flowRoleName: this.newItem.flowRoleName,
            flowRoleRemark: this.newItem.flowRoleRemark,
            maxAuditAmt: this.newItem.maxAuditAmt,
            minAuditAmt: this.newItem.minAuditAmt,
            queueNum: this.newItem.queueNum,
            suspendNum: this.newItem.suspendNum,
            roleCate: this.newItem.roleCate
          })
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.newItem = {};
              this.dialogAddVisible = false;
              this.getRoles(this.queryParam);
              this.loadingFlag = false;
              this.loadingTxt = "确 定";
            } else {
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

      // 金额格式化，添加千分位
      moneyFormat(event) {
        event.target.value = this.initMoneyFormat(event.target.value);
      },

      // 列表数据金额的格式化
      money(row, column, cellValue) {
        return this.initMoneyFormat(cellValue)
      }

    },
  };

</script>
<style>
  /* 样式冲突的解决 */

  .processRoleManage .listContainer .el-button {
    padding: 0;
  }

</style>
