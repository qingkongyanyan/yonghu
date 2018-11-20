<!-- 系统管理-机构管理-->
<template>
  <div>
    <!-- <my-head></my-head> -->
    <div class="appConfig main-div">
      <div class="keywordContainer search-div">
        <el-row class="row row1" type="flex">
          <el-col class="search-item" :span="6" :offset="0">
            <span class="keywordText">营业部编号：</span>
            <el-input v-model="queryParam.orgBusiCode" placeholder="请输入营业部编号"></el-input>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">管理机构编号：</span>
            <el-input v-model="queryParam.orgManageCode" placeholder="请输入管理机构编号"></el-input>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">管理机构类型：</span>
            <el-select v-model="queryParam.orgType" class="orgCate" placeholder="请输入管理机构类型">
              <el-option v-for="item in orgCates" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="search-item search-btn" :span="6">
            <el-button class="btn query" type="primary" @click="getOrgsByKey">查询</el-button>
            <el-button class="btn reset" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="title titleContainer edit-div">
        <span class="titleText">
          <i class="el-icon title-icon"></i>
          分单配置列表
        </span>
        <span class="iconContainer">
          <span class="icon-item" @click="changeState('add')">
            <i class="el-icon addIcon"></i><span class="el-icon-text">新增</span>
          </span>
        </span>
      </div>

      <div class="listContainer">
        <el-table :data="appConfigList" border height="510" show-header highlight-current-row @row-click="selectRow">
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="orgBusiCode" label="营业部编码" width="110">
          </el-table-column>
          <el-table-column prop="orgBusiName" label="营业部名称" min-width="120">
          </el-table-column>
          <el-table-column prop="proName" label="产品名称" show-overflow-tooltip min-width="420">
          </el-table-column>
          <el-table-column prop="orgTypeTxt" label="管理机构类型" width="120">
          </el-table-column>
          <el-table-column prop="orgManageCode" label="管理机构编号" width="120">
          </el-table-column>
          <el-table-column prop="orgManageName" label="管理机构名称" min-width="120">
          </el-table-column>
          <el-table-column prop="" label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button class="btn-sm edit" size="small" type="text" @click="getItem('edit',scope.row)">编辑</el-button>
              <el-button class="btn-sm delete" size="small" type="text" @click="getItem('delete',scope.row)">删除</el-button>
              <el-button class="btn-sm check" size="small" type="text" @click="getItem('check',scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 页码 -->
        <div class="page">
          <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page.sync="currentPage"
            :page-sizes=pageSizesArr :page-size=setPageSize layout="total, sizes, prev, pager, next, jumper" :total=totalNum>
          </el-pagination>
        </div>
      </div>

      <!-- 编辑框 -->
      <el-dialog :title="titleTxt" :visible.sync="dialogEditVisible">
        <el-form :model="itemOfLists" :rules="rules" ref="ruleForm">
          <div class="bfc">
            <el-form-item class="fl" label="营业部名称：" prop="orgBusiName" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.orgBusiName" @change="setOrgBusi" clearable filterable>
                <p class="selectTop">
                  <span>机构编码</span>
                  <span>机构名称</span>
                </p>
                <el-option v-for="item in orgBusis" :key="item.orgCode" :label="item.orgName" :value="item.orgCode">
                  <span style="float: left;width:66px">{{ item.orgCode }}</span>
                  <span style="float: left; color: #8492a6; font-size: 13px;margin-left: 20px;">{{ item.orgName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr" label="营业部编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.orgBusiCode" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl productName newProName" label="产品名称：" prop="productArr" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.productArr" multiple @change="multipleSelect">
                <p class="selectTop">
                  <span>产品编号</span><span>产品名称</span>
                </p>
                <el-option v-for="item in products" :key="item.id" :label="item.proName" :value="item.id">
                  <span style="float: left;width:66px">{{ item.proCode }}</span>
                  <span style="float: left; color: #8492a6; font-size: 13px;margin-left: 20px;">{{ item.proName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="管理机构类型：" prop="orgType" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.orgType" clearable @change="setOrgType" class="orgCate">
                <el-option v-for="item in orgCates" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="管理机构名称：" prop="orgManageName" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.orgManageName" clearable filterable @change="setOrgManage">
                <p class="selectTop">
                  <span>机构编码</span>
                  <span>机构名称</span>
                </p>
                <el-option v-for="item in orgBusiByCates" :key="item.orgCode" :label="item.orgName" :value="item.orgCode">
                  <span style="float: left;width:66px">{{ item.orgCode }}</span>
                  <span style="float: left; color: #8492a6; font-size: 13px;margin-left: 20px;">{{ item.orgName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr" label="管理机构编号：" :label-width="formLabelWidth">
              <el-input readonly v-model="itemOfLists.orgManageCode" auto-complete="off"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-if="addOrEdit==='add'" :loading="loadingFlag" @click="addOrg('ruleForm')">{{loadingTxt}}</el-button>
          <el-button type="primary" v-if="addOrEdit==='edit'" :loading="loadingFlag" @click="editOrg('ruleForm')">{{loadingTxt}}</el-button>
        </div>
      </el-dialog>

      <!-- 查看 -->
      <el-dialog title="分单配置详情" :visible.sync="dialogCheckVisible">
        <el-form :model="itemOfLists">
          <div>
            <el-form-item class="fl" label="营业部编号：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgBusiCode"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="营业部名称：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgBusiName"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl productName productNameCheck newProName" label="经营产品：" :label-width="formLabelWidth">
              <el-input readonly type="textarea" :rows="1" resize=none :value="itemOfLists.proName"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="管理机构类型：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgTypeTxt"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="管理机构编号：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgManageCode"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="管理机构名称：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgManageName"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 删除 -->
      <!-- <el-dialog title="分单配置删除" :visible.sync="dialogDeleteVisible" width="30%">
      <span>您确定要删除选中的行？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteItem">确定</el-button>
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
      </span>
    </el-dialog> -->
    </div>
  </div>
</template>

<script>
  //import myHead from "@/view/header/header.vue";
  import bpmServerHttp from "../bpmServer_ser.js";
  import systemManageHttp from "../systemManage_ser";
  import appConstant from "../../../util/constant";
  export default {
    data() {
      return {
        orgName: '',
        orgCode: '',
        orgDatas: [],
        currentItem: {}, // 当前选中的分单

        itemOfLists: {
          orgBusiCode: '',
          orgType: '',
          productArr: []
        },


        dialogEditVisible: false,
        dialogCheckVisible: false,
        dialogDeleteVisible: false,

        formLabelWidth: "130px",

        parentOrgName: '',

        addOrEdit: '', // 添加还是编辑机构
        titleTxt: '', // 添加还是编辑框的标题

        defaultProps: {
          children: "children",
          label: "orgName",
        },

        defaultProps2: {
          children: "children",
          label: "orgName",
          isLeaf: 'leaf',
        },

        orgTypes: [{
            label: '管理机构',
            value: '0'
          },
          {
            label: '营业机构',
            value: '1'
          }
        ],

        // 机构级别
        orgLevels: [{
            label: '总部',
            value: '01'
          },
          {
            label: '子公司',
            value: '02'
          },
          {
            label: '大区',
            value: '03'
          },
          {
            label: '事业部',
            value: '04'
          },
          {
            label: '城市',
            value: '05'
          },
          {
            label: '营业部',
            value: '06'
          },
          {
            label: '科室',
            value: '07'
          }
        ],

        // 机构类别
        orgCates: [{
            label: '信销管理',
            value: '01'
          },
          {
            label: '信用管理',
            value: '02'
          },
          {
            label: '财富管理',
            value: '03'
          },
          {
            label: '运营管理',
            value: '04'
          },
          {
            label: '催收管理',
            value: '05'
          },
          {
            label: '欺诈管理',
            value: '06'
          },
          {
            label: '结算管理',
            value: '07'
          },
          {
            label: '抵押管理',
            value: '08'
          }
        ],

        products: [],
        proIds: [],


        // 表单校验
        rules: {
          orgBusiName: [{
            required: true,
            message: '请输入营业部名称',
            trigger: 'change'
          }],
          orgType: [{
            required: true,
            message: '请输入管理机构类型',
            trigger: 'change'
          }],
          productArr: [{
            required: true,
            message: '请输入产品名称',
            trigger: 'change'
          }],
          orgManageName: [{
            required: true,
            message: '请输入管理机构名称',
            trigger: 'change'
          }]
        },

        currentPage: 1, // 默认显示的当前页
        pageSizesArr: [10, 20, 30, 40, 50], // 每页显示的数据数
        setPageSize: 10,
        totalNum: 0,

        resDatas: [], // 资源数据列表
        defaultCheckedArr: [], // 角色已拥有的资源数组
        defaultProps: {
          children: 'children',
          label: 'resName'
        },

        queryParam: {
          orgBusiCode: "",
          orgManageCode: "",
          orgType: "",
          pageNum: 1,
          pageSize: 10,
        },

        appConfigList: [], // 分单配置查询结果列表

        orgBusis: [],
        orgBusiByCates: [],

        // 加载中
        loadingFlag: false,
        loadingTxt: "确 定",

      };
    },
    /*watch: {
      '$route' (to, from) {
        if (to.path == '/appConfig') {
          this.getList();
          this.getAllNormalSalesDepartment();
        }
      }
    },*/
    mounted() {
      this.getList();
      this.getAllNormalSalesDepartment();
    },
    methods: {
      //请求数据接口
      getList(param) {
        bpmServerHttp
          .getList(this.queryParam)
          .then(res => {
            this.totalNum = res.data.totalNum;
            this.appConfigList = res.data.appConfigList;
          })
          .catch(err => {
            console.log(err);
          });
      },

      // 添加或编辑时，查询有效营业部
      getAllNormalSalesDepartment() {
        systemManageHttp.getAllNormalSalesDepartment({
            params: {
              timestamp: +new Date()
            }
          })
          .then(res => {
            this.orgBusis = res.data.data;
          })
      },

      // 根据管理机构类型，查询管理机构(营业部)名称
      setOrgType(value) {
        this.orgBusiByCates = [];
        this.itemOfLists.orgManageName = '';
        this.itemOfLists.orgManageCode = '';
        this.itemOfLists.orgManageId = '';

        systemManageHttp.getNormalSalesDepartmentByOrgCate({
          orgCate: value
        }).then(res => {
          this.orgBusiByCates = res.data.data;
        })
      },

      // 设置管理机构
      setOrgManage(value) {
        for (var i = 0, len = this.orgBusiByCates.length; i < len; i++) {
          if (this.orgBusiByCates[i].orgCode === value) {
            this.itemOfLists.orgManageId = this.orgBusiByCates[i].id;
            this.itemOfLists.orgManageCode = this.orgBusiByCates[i].orgCode;
            this.$forceUpdate(function () {
              this.itemOfLists.orgManageName = this.orgBusiByCates[i].orgName;
            })
          }
        }
      },

      // 根据 id 查看一条机构
      getById(orgBusiCode, orgManageCode, orgType) {
        bpmServerHttp
          .getById({
            orgBusiCode: orgBusiCode,
            orgManageCode: orgManageCode,
            orgType: orgType
          })
          .then(res => {
            this.itemOfLists = res.data;
            this.itemOfLists.productArr = res.data.proId.split(",");
          })
          .catch(err => {
            console.log(err);
          });
      },

      // 获取经营产品
      getProductForUser(orgId) {
        systemManageHttp.getProductForUser({
          orgId: orgId,
          validFlag: '1'
        }).then(res => {
          if (res.data.data.length == 0) {
            this.products = [];
          } else {
            this.products = res.data.data;
          }
        })
      },

      // 设置营业部
      setOrgBusi(value) {
        for (var i = 0, len = this.orgBusis.length; i < len; i++) {
          if (this.orgBusis[i].orgCode === value) {
            this.itemOfLists.orgBusiId = this.orgBusis[i].id;
            this.itemOfLists.orgBusiCode = this.orgBusis[i].orgCode;
          }
        }
        this.getProductForUser(this.itemOfLists.orgBusiId);
        this.itemOfLists.productArr = [];
      },

      // 重置
      reset() {
        this.queryParam = {};
        this.queryParam.orgBusiCode = '';
        this.queryParam.orgManageCode = '';
        this.queryParam.orgType = '';
        this.queryParam.pageNum = 1;
        this.queryParam.pageSize = 10;
        this.appConfigList=[];
        this.getList();
      },
      // 每页条数变化时，重新请求
      changePageSize(val) {
        this.queryParam.pageSize = val;
        this.queryParam.pageNum = 1;
        if (this.currentPage !== 1 || this.setPageSize !== 20) {
          this.currentPage = 1;
          this.setPageSize = 20;
        } else {
          this.getList(this.queryParam);
        }
      },
      // 改变页码时，重新请求
      changeCurrentPage(val) {
        this.queryParam.pageNum = val;
        this.getList(this.queryParam);
      },

      // 通过关键字查询
      getOrgsByKey() {
        this.getList(this.queryParam);
      },


      // 点击某一行
      selectRow(row) {
        this.currentItem = row;
      },

      // 产品列表多选时
      multipleSelect(list) {
        this.$forceUpdate(function () {
          this.itemOfLists.productArr = list;
        })
      },

      // 编辑、查看、删除操作
      getItem(flag, item) {
        if (flag === "edit") {
          this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : '';
          this.getById(item.orgBusiCode, item.orgManageCode, item.orgType);
          // 先按当前管理机构类型,查询一次管理机构
          systemManageHttp.getNormalSalesDepartmentByOrgCate({
            orgCate: item.orgType
          }).then(res => {
            this.orgBusiByCates = res.data.data;
          })
          // 先按当前营业部，查询一次产品
          this.getProductForUser(item.orgBusiId);

          this.dialogEditVisible = true;
          this.addOrEdit = 'edit'
          this.titleTxt = "编辑分单配置";
        } else if (flag === "check") {
          this.getById(item.orgBusiCode, item.orgManageCode, item.orgType);
          this.dialogCheckVisible = true;
        } else if (flag === "delete") {
          //this.dialogDeleteVisible = true;
          this.$confirm('您确定要删除选中的行？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteItem();
          }).catch(() => {

          });
          return;
        }
      },

      // 删除分单
      deleteItem() {
        bpmServerHttp
          .delete({
            id: this.currentItem.id
          })
          .then(res => {
            if (res.data.statusCode === "200") {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              //this.dialogDeleteVisible = false;
              this.getList();
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
      },

      // 编辑分单
      editOrg(formName) {
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

        var arr = [],
          proIds = this.itemOfLists.productArr,
          products = this.products;
        for (var i = 0, len = proIds.length; i < len; i++) {
          for (var j = 0, le = products.length; j < le; j++) {
            if (proIds[i] === products[j].id) {
              arr.push(products[j].proCode);
            }
          }
        }
        this.itemOfLists.proId = this.itemOfLists.productArr.join(",");
        this.itemOfLists.proCode = arr.join(",");

        bpmServerHttp
          .save(this.itemOfLists)
          .then(res => {
            if (res.data.statusCode === "200") {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.dialogEditVisible = false;
              this.getList();
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

      // 添加分单
      addOrg(formName) {
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

        var arr = [],
          proIds = this.itemOfLists.productArr,
          products = this.products;
        for (var i = 0, len = proIds.length; i < len; i++) {
          for (var j = 0, le = products.length; j < le; j++) {
            if (proIds[i] === products[j].id) {
              arr.push(products[j].proCode);
            }
          }
        }
        this.itemOfLists.proId = this.itemOfLists.productArr.join(",");
        this.itemOfLists.proCode = arr.join(",");


        bpmServerHttp
          .save(this.itemOfLists)
          .then(res => {
            if (res.data.statusCode === "200") {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.dialogEditVisible = false;
              this.getList();
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

      // 添加分单
      changeState(flag) {
        if (flag === 'add') {
          this.addOrEdit = 'add';
          this.titleTxt = '新增分单配置';
          this.dialogEditVisible = true;
          this.itemOfLists = {};
          this.proIds = [];
          this.products = [];
          this.itemOfLists.orgBusiName = "";
          this.itemOfLists.productArr = [];
          this.itemOfLists.orgType = "";
          this.orgBusiByCates = [];
          this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : '';
        }
      },

    },
    /*components: {
      myHead,
    }*/
  };

</script>

<style>
  .appConfig {}

  /* .appConfig .el-icon.restIcon {
  background-image: url("../../images/rest.png");
}
.appConfig .el-icon.enableIcon {
  background-image: url("../../images/enable.png");
} */

  .appConfig .keywordContainer .el-input {
    /* width: 258px; */
  }

  .appConfig .el-table__body-wrapper {}


  .appConfig .el-dialog {
    /* width: 750px; */
  }

  .appConfig .el-dialog .el-dialog__body {
    /* padding: 10px; */
  }

  .appConfig .el-dialog .el-form {
    height: 250px;
    /* overflow-y: auto; */
  }

  .appConfig .el-dialog .productNameCheck .el-textarea__inner {
    width: 100%;
  }

  .appConfig .el-dialog .productName .el-select {
    width: 97%;
  }

  .appConfig .el-dialog .orgStreet .el-input__inner {
    width: 97%;
    margin-top: 10px;
  }

  .appConfig .el-dialog .fl {
    /* float: left; */
  }

  .appConfig .el-dialog .fr {
    /* float: right;
  margin-right: 18px; */
  }

  .appConfig .el-dialog .el-form-item .dropdown {
    /* width: 185px;
  height: 35px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #d8dce5;
  padding: 0 15px;
  position: relative; */
  }

  .appConfig .el-dialog .el-form-item .dropdown .dropdownInput {
    width: 155px;
    height: 35px;
    /* display:inline-block; */
    float: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .appConfig .el-dialog .el-tree-node>.el-tree-node__children {
    /* overflow:visible; */
  }

  .appConfig .readonly {
    /* background-color: #f5f7fa;
  border-color: #dfe4ed;
  color: #b4bccc;
  cursor: not-allowed !important; */
  }

  /* 必填项小星星上下居中对齐 */
  .appConfig .el-form-item.is-required .el-form-item__label:before {
    /* display: inline-block;
  height: 20px;
  vertical-align: sub; */
  }

</style>
