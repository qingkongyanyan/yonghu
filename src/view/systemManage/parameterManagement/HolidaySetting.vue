<!-- 节假日设置 -->
<template>
  <div class="main-div holidaySetting">
    <div class="keywordContainer search-div">
      <el-row class="row row3" type="flex">
        <el-col class="search-item" :span="6" :offset="0">
          <span class="keywordText">节假日期：</span>
          <el-date-picker class="holidayDiv" v-model="holidays" :default-value="values" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col class="search-item" :span="6">
          <span class="keywordText">是否节假日：</span>
          <el-select v-model="validFlag_top" placeholder="请选择是否节假日">
            <el-option v-for="item in validFlags" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col class="search-item" :span="6"></el-col>
        <el-col class="search-item search-btn" :span="6">
          <el-button class="btn query" @click="getUsersByKey" type="primary">查询</el-button>
          <el-button class="btn reset" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="title titleContainer edit-div">
      <span class="titleText">
        <i class="el-icon title-icon"></i>
        节假日设置列表
      </span>
      <span class="iconContainer">
	        <span class="icon-item" @click="handleClick('add')">
	          <i class="el-icon addIcon"></i><span class="el-icon-text">新增</span>
      </span>
      </span>
    </div>
    <div class="listContainer">
      <el-table :data="holidaySetting" border height="510" highlight-current-row show-header>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="holiday" label="节假日期" min-width="160">
        </el-table-column>
        <el-table-column prop="validFlag" label="是否节假日" min-width="110">
        </el-table-column>
        <el-table-column prop="" label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <el-button class="btn-sm edit" size="small" type="text" @click="handleClick('edit',scope.row)">编辑</el-button>
            <el-button class="btn-sm delete" size="small" type="text" @click="deleteClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <div class="page">
        <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page.sync="currentPage" :page-sizes=pageSizesArr :page-size=pageSizesArr[0] layout="total, sizes, prev, pager, next, jumper" :total=responseDatas.totalRecord>
        </el-pagination>
      </div>
    </div>
    <!-- 添加 -->
    <el-dialog :title="titleTxt" :visible.sync="dialogEditVisible">
      <el-form :model="itemOfLists" :rules="rules" ref="ruleForm">
        <div class="bfc">
          <el-form-item class="fl" label="节假日期：" :label-width="formLabelWidth" prop="holiday">
            <el-date-picker v-model="itemOfLists.holiday" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="fr" label="是否节假日：" :label-width="formLabelWidth" prop="validFlag">
            <el-select v-model="itemOfLists.validFlag" placeholder="请选择是否节假日">
              <el-option v-for="item in validFlags" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button v-if="addOrEdit==='edit'" @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" v-if="addOrEdit==='edit'" :loading="loadingFlag" @click="commitEditedItem('ruleForm')">{{loadingTxt}}</el-button> -->
        <el-button type="primary" :loading="loadingFlag" @click="commitAddItem('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑框 -->
    <el-dialog :title="titleTxt" :visible.sync="EdialogEditVisible" @close="closeDia">
      <el-form :model="itemOfListsE" :rules="rulese" ref="ruleFormE">
        <div class="bfc">
          <el-form-item class="fl" label="节假日期：" :label-width="formLabelWidth" prop="holiday">
            <el-date-picker v-model="itemOfListsE.holiday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="fr" label="是否节假日：" :label-width="formLabelWidth" prop="validFlag">
            <el-select v-model="itemOfListsE.validFlag" placeholder="请选择是否节假日">
              <el-option v-for="item in validFlags" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EdialogEditVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loadingFlag" @click="commitEditedItem('ruleFormE')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹框 -->
    <!-- <el-dialog title="节假日删除" :visible.sync="dialogDeleteVisible" width="30%">
      <span>您确定要删除选中的行？</span>
      <span slot="footer" class="dialog-footer">
              <el-button @click="deleteItem">确定</el-button>
              <el-button @click="dialogDeleteVisible = false">取消</el-button>
            </span>
    </el-dialog> -->
  </div>
</template>
<script>
import systemManageHttp from "../systemManage_ser";
export default {
  data() {
    var isOnly = (rule, value, callback) => {
	if(this.addOrEdit == 'add'){
    var appge = new Date(this.itemOfLists.holiday),
          appgey = appge.getFullYear(),
          appgem = appge.getMonth() + 1;
          appgem = appgem < 10 ? ('0' + appgem) : appgem;
      var appged = appge.getDate();
          appged = appged < 10 ? ('0' + appged) : appged;
      var oldValue = appgey + '-' + appgem + '-' + appged;

      var Newappge = new Date(value),
          Newappgey = Newappge.getFullYear(),
          Newappgem = Newappge.getMonth() + 1;
          Newappgem = Newappgem < 10 ? ('0' + Newappgem) : Newappgem;
      var Newappged = Newappge.getDate();
          Newappged = Newappged < 10 ? ('0' + Newappged) : Newappged;
      var newValue = Newappgey + '-' + Newappgem + '-' + Newappged;
		systemManageHttp.checkUniq({
	        params: {
	          //id: this.itemOfLists.id,
	          holiday: newValue
	        }
	      }).then(res => {
	        if (res.data.data == false) {
	          return callback(new Error('节假日期已存在'));
	        } else {
	          return callback()
	        }
	      })
	};

      }

      var isOnlyE = (rule, value, callback) => {
      //if(this.addOrEdit == 'edit'){
        var appge = new Date(this.itemOfListsE.holiday),
          appgey = appge.getFullYear(),
          appgem = appge.getMonth() + 1;
          appgem = appgem < 10 ? ('0' + appgem) : appgem;
      var appged = appge.getDate();
          appged = appged < 10 ? ('0' + appged) : appged;
      var oldValue = appgey + '-' + appgem + '-' + appged;

      var Newappge = new Date(value),
          Newappgey = Newappge.getFullYear(),
          Newappgem = Newappge.getMonth() + 1;
          Newappgem = Newappgem < 10 ? ('0' + Newappgem) : Newappgem;
      var Newappged = Newappge.getDate();
          Newappged = Newappged < 10 ? ('0' + Newappged) : Newappged;
      var newValue = Newappgey + '-' + Newappgem + '-' + Newappged;
        systemManageHttp.checkUniq({
          params: {
            id: this.itemOfListsE.id,
            holiday: newValue
          }
        }).then(res => {
          if (res.data.data == false) {
            return callback(new Error('节假日期已存在'));
          } else {
            return callback()
          }
        })
  //}
  

      }
    return {
      holidayLe_la: '',
      holidayGe_la: '',
      validFlag_top: '',
      //是否节假日
      validFlags: [
        { label: "否", value: "0" },
        { label: "是", value: "1" }
      ],
      //节假日 时间 数组
      holidays: '',
      holidaySetting: [],
      currentPage: 1, // 默认显示的当前页
      pageSizesArr: [10, 20, 30, 40, 50], // 每页显示的数据数
      /*弹框*/
      dialogEditVisible: false, //添加/编辑弹框
      titleTxt: '',
      addOrEdit: '',
      addHolidays: '', //新增节假日 时间 数组
      addValidFlag: '', //新增节假日 是否
      // 加载中
      loadingFlag: false,
      loadingTxt: "确 定",
      responseDatas: {}, // 列表请求的返回值
      queryParam: {
        holidayLe: '', //节假日期上限（后）
        holidayGe: '', //节假日期下限（前）
        validFlag: '', //是否节假日
        pageNum: '',
        pageSize: '',
      },
      currentItem: {}, // 当前选中的行
      dialogDeleteVisible: false, //删除弹框
      EdialogEditVisible:false,//编辑弹框
      itemOfLists: {
        holiday: '',
        validFlag: '',
        id: '',
      },
      itemOfListsE: {
        holiday: '',
        validFlag: '',
        id: '',
      },
      newHoliday:'',
      newItemOfLists: {
        holiday: '',
        validFlag: '',
        id: '',
      },
      // 表单校验
      rules: {
        holiday: [
          { required: true, message: '节假日期不能为空', trigger: 'blur' },
          { validator: isOnly, trigger: 'blur' }
        ],
        validFlag: [
          { required: true, message: '是否节假日不能为空', trigger: 'blur' }
        ],
      },
      rulese: {
        holiday: [
          { required: true, message: '节假日期不能为空', trigger: 'blur' },
          { validator: isOnlyE, trigger: 'blur' }
        ],
        validFlag: [
          { required: true, message: '是否节假日不能为空', trigger: 'blur' }
        ],
      },
      formLabelWidth: "130px",
      values:'',
    }
  },
  mounted() {
    this.getHolidaysAll();
  },
  methods: {

    //请求数据接口
    getHolidays(param) {
      if(this.queryParam.validFlag){
        if(this.queryParam.validFlag == '是'){
          this.queryParam.validFlag = '1';
        }else if(this.queryParam.validFlag == '否'){
          this.queryParam.validFlag = '0';
        }
      };
      systemManageHttp
        .getHolidaysByPage(this.queryParam)
        .then(res => {
          if (res.data.statusCode === 200) {
            this.responseDatas = res.data.data;
            this.holidaySetting = this.responseDatas.recordList;
            if (this.holidaySetting) {
              for (var i = 0; i < this.holidaySetting.length; i++) {
                if (this.holidaySetting[i].validFlag == '0') {
                  this.holidaySetting[i].validFlag = '否';
                };
                if (this.holidaySetting[i].validFlag == '1') {
                  this.holidaySetting[i].validFlag = '是';
                };
              }
            }
          } else {
            this.responseDatas = {};
            this.holidaySetting = [];
            this.responseDatas.totalRecord = 0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 请求全部数据
    getHolidaysAll() {
      this.queryParam.holidayLe = "";
      this.queryParam.holidayGe = "";
      this.queryParam.validFlag = "";
      this.queryParam.pageNum = 1;
      this.queryParam.pageSize = 10;
      (this.setPageSize = 10), (this.currentPage = 1);
      this.getHolidays(this.queryParam);
    },

    // 查询按钮
    getUsersByKey() {
      //申请日期[大于等于]-查询
      if (this.holidays) {
        var appge = new Date(this.holidays[0]),
          appgey = appge.getFullYear(),
          appgem = appge.getMonth() + 1;
        appgem = appgem < 10 ? ('0' + appgem) : appgem;
        var appged = appge.getDate();
        appged = appged < 10 ? ('0' + appged) : appged;
        this.queryParam.holidayGe = appgey + '-' + appgem + '-' + appged;
        //申请日期[小于等于]-查询
        var apple = new Date(this.holidays[1]),
          appley = apple.getFullYear(),
          applem = apple.getMonth() + 1;
        applem = applem < 10 ? ('0' + applem) : applem;
        var appled = apple.getDate();
        appled = appled < 10 ? ('0' + appled) : appled;
        this.queryParam.holidayLe = appley + '-' + applem + '-' + appled;
      } else {
        this.queryParam.holidayLe = '';
        this.queryParam.holidayGe = '';
      };
      this.queryParam.validFlag = this.validFlag_top;
      this.getHolidays(this.queryParam);
    },
    // 重置按钮
    reset() {
      //节假日时间 时间 数组
      this.holidays = '';
      this.queryParam.holidayLe = '';
      this.queryParam.holidayGe = '';
      this.validFlag_top = "";
      this.queryParam = {};
      this.getHolidaysAll();
    },
    // 每页条数变化时，重新请求
    changePageSize(val) {
      this.queryParam.pageSize = val;
      this.queryParam.pageNum = 1;
      if (this.currentPage !== 1 || this.setPageSize !== 10) {
        this.currentPage = 1;
        this.setPageSize = 10;
      } else {
        this.getHolidays(this.queryParam);
      }
    },
    // 改变页码时，重新请求
    changeCurrentPage(val) {
      this.queryParam.pageNum = val;
      this.getHolidays(this.queryParam);
    },
    //关闭弹框
    closeDia(){
      this.$nextTick(function() {
        this.$refs['ruleFormE'].resetFields();
        this.itemOfListsE.holiday=null;
        this.itemOfListsE.holiday='';
        this.itemOfListsE.validFlag='';
        this.itemOfListsE.id='';
      });
    },
    // 查看或编辑条目
    handleClick(flag, item) {
      if (flag === "edit") {
        this.itemOfListsE.holiday=item.holiday;
        this.itemOfListsE.validFlag=item.validFlag;
        this.itemOfListsE.id=item.id;
        this.EdialogEditVisible = true;
        this.addOrEdit = 'edit'
        this.titleTxt = "编辑节假日";
      };
      if (flag === 'add') {
        this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : '';
        for (let i in (this.itemOfLists)) {
          this.itemOfLists[i] = '';
        }
        this.dialogEditVisible = true;
        this.addOrEdit = 'add'
        this.titleTxt = "新增节假日";
      }
    },

    // 编辑用户
    sendEditHoliday() {
      this.loadingFlag = true;
      this.loadingTxt = "加载中";
      //return;
      /*var appge = new Date(this.itemOfListsE.holiday),
          appgey = appge.getFullYear(),
          appgem = appge.getMonth() + 1;
          appgem = appgem < 10 ? ('0' + appgem) : appgem;
      var appged = appge.getDate();
          appged = appged < 10 ? ('0' + appged) : appged;
      this.itemOfListsE.holiday = appgey + '-' + appgem + '-' + appged;*/
      if(this.itemOfListsE.validFlag == '是'){
        this.itemOfListsE.validFlag = '1';
      }else if(this.itemOfListsE.validFlag == '否'){
        this.itemOfListsE.validFlag = '0';
      };
      systemManageHttp
        .updateHoliday(this.itemOfListsE)
        .then(res => {
          if (res.data.statusCode === 200) {
            this.$message({
              message: res.data.msg ? res.data.msg : "操作成功！",
              type: 'success'
            })

            this.EdialogEditVisible = false;

            for (let i of Object.keys(this.itemOfListsE)) {
              this.itemOfListsE[i] = '';
            }

            //this.cacheUserCode = "";
            this.getHolidays(this.queryParam);
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
          this.EdialogEditVisible = false;
          this.loadingFlag = false;
          this.loadingTxt = "确 定";
        });
    },
    commitEditedItem(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendEditHoliday();
        } else {
        }
      });
    },

    // 添加节假日
    sendAddHoliday() {
      this.loadingFlag = true;
      this.loadingTxt = "加载中";
      var appge = new Date(this.itemOfLists.holiday),
        appgey = appge.getFullYear(),
        appgem = appge.getMonth() + 1;
      appgem = appgem < 10 ? ('0' + appgem) : appgem;
      var appged = appge.getDate();
      appged = appged < 10 ? ('0' + appged) : appged;
      this.itemOfLists.holiday = appgey + '-' + appgem + '-' + appged;
      if(this.itemOfLists.validFlag == '是'){
        this.itemOfLists.validFlag = '1';
      }else if(this.itemOfLists.validFlag == '否'){
        this.itemOfLists.validFlag = '0';
      };
      systemManageHttp
        .addHoliday(this.itemOfLists)
        .then(res => {
          //.log(res.data);
          if (res.data.statusCode === 200) {
            this.$message({
              message: res.data.msg ? res.data.msg : "操作成功！",
              type: 'success'
            })
            //this.newItem = {};
            this.dialogEditVisible = false;
            this.getHolidays(this.queryParam);
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
    //添加节假日
    commitAddItem(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendAddHoliday();
        } else {
        }
      });
    },
    //点击删除按钮
    deleteClick(rows) {
      //this.dialogDeleteVisible = true;
      this.currentItem = rows;
      this.$confirm('您确定要删除选中的行？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.deleteItem();
            }).catch(() => {

            });
            return;
    },
    // 删除弹框中得确定按钮
    deleteItem() {
      systemManageHttp
        .deleteHoliday({ params: { id: this.currentItem.id } })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.$message({
              message: res.data.msg ? res.data.msg : "操作成功！",
              type: 'success'
            })
            this.dialogDeleteVisible = false;
            this.getHolidays();
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
  },
  watch:{
    itemOfListsE(newVal,oldVal){
    }
  },
};

</script>
<style scoped>
  
</style>
