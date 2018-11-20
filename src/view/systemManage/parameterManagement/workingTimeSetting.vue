<!-- 工作时段设置 -->
<template>
  <div class="main-div workingTimeSetting">
    <div class="title titleContainer edit-div">
      <span class="titleText">
        <i class="el-icon title-icon"></i>
        工作时段设置列表
      </span>
    </div>
    <div class="listContainer">
      <el-table :data="workingTimeSetting" border height="510" highlight-current-row style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="beginHour" label="工作开始时间（时）" min-width="110">
        </el-table-column>
        <el-table-column prop="beginMin" label="工作开始时间（分）" min-width="110">
        </el-table-column>
        <el-table-column prop="beginSecond" label="工作开始时间（秒）" min-width="110">
        </el-table-column>
        <el-table-column prop="endHour" label="工作结束时间（时）" min-width="110">
        </el-table-column>
        <el-table-column prop="endMin" label="工作结束时间（分）" min-width="110">
        </el-table-column>
        <el-table-column prop="endSecond" label="工作结束时间（秒）" min-width="110">
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <el-button class="btn-sm edit" size="small" type="text" @click="handleClick(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <div class="page">
        <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page.sync="currentPage" :page-sizes=pageSizesArr :page-size=pageSizesArr[0] layout="total, sizes, prev, pager, next, jumper" :total=responseDatas.totalRecord>
        </el-pagination>
      </div>
    </div>
    <!-- 编辑框 -->
    <el-dialog :title="titleTxt" :visible.sync="dialogEditVisible">
      <el-form :model="itemOfLists" :rules="rules" ref="ruleForm">
      	<div class="bfc">
            <el-form-item class="fl" label="工作开始时间（时）：" :label-width="formLabelWidth" prop="beginHour">
            	<el-input v-model="itemOfLists.beginHour" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fl" label="工作开始时间（分）：" :label-width="formLabelWidth" prop="beginMin">
            	<el-input v-model="itemOfLists.beginMin" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fl" label="工作开始时间（秒）：" :label-width="formLabelWidth" prop="beginSecond">
            	<el-input v-model="itemOfLists.beginSecond" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fl" label="工作结束时间（时）：" :label-width="formLabelWidth" prop="endHour">
            	<el-input v-model="itemOfLists.endHour" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fl" label="工作结束时间（分）：" :label-width="formLabelWidth" prop="endMin">
            	<el-input v-model="itemOfLists.endMin" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fl" label="工作结束时间（秒）：" :label-width="formLabelWidth" prop="endSecond">
            	<el-input v-model="itemOfLists.endSecond" auto-complete="off"></el-input>
            </el-form-item>
          </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loadingFlag" @click="commitEditedItem('ruleForm')">{{loadingTxt}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import systemManageHttp from "../systemManage_ser";
export default {
  data() {
  	var checkAgebh = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('工作开始时间（时）不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value*1)) {
          	//alert('0000333');
            callback(new Error('请输入数字值'));
          } else {
            if (value*1 < 0 || value*1  > 24) {
            	//alert('0000');
              callback(new Error('必须在0-24'));
            } else {
              callback();
            }
          }
        }, 300);
      };
      var checkAgebm = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('工作开始时间（分）不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value*1)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value*1 < 0 || value*1 > 59) {
              callback(new Error('必须在0-59'));
            } else {
              callback();
            }
          }
        }, 300);
      };
      var checkAgebs = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('工作开始时间（秒）不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value*1)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value*1 < 0 || value*1 > 59) {
              callback(new Error('必须在0-59'));
            } else {
              callback();
            }
          }
        }, 300);
      };
      var checkAgeeh = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('工作结束时间（时）不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value*1)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value*1 < 0 || value*1 > 24) {
              callback(new Error('必须在0-24'));
            } else {
              callback();
            }
          }
        }, 300);
      };
      var checkAgeem = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('工作结束时间（分）不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value*1)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value*1 < 0 || value*1 > 59) {
              callback(new Error('必须在0-59'));
            } else {
              callback();
            }
          }
        }, 300);
      };
      var checkAgees = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('工作结束时间（秒）不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value*1)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value*1 < 0 || value*1 > 59) {
              callback(new Error('必须在0-59'));
            } else {
              callback();
            }
          }
        }, 300);
      };
    return {
      dialogEditVisible:false,//编辑弹框
      responseDatas:{},
      workingTimeSetting:[],
      currentPage: 1, // 默认显示的当前页
      pageSizesArr: [10, 20, 30, 40, 50], // 每页显示的数据数
      // 加载中
      loadingFlag: false,
      loadingTxt: "确 定",
      queryParam:{
      	pageNum: '',
        pageSize: '',
      },
      // 表单校验
        rules: {
          beginHour: [
            { validator:checkAgebh, trigger: 'blur' },
          ],
          beginMin: [
            { validator:checkAgebm,trigger: 'blur' }
          ],
          beginSecond: [
            { validator:checkAgebs,trigger: 'blur' },
          ],
          endHour: [
            { validator:checkAgeeh,trigger: 'blur' }
          ],
          endMin: [
            { validator:checkAgeem,trigger: 'blur' },
          ],
          endSecond: [
            { validator:checkAgees,trigger: 'blur' }
          ],
        },
       formLabelWidth:"150px",
       titleTxt: '工作时段编辑',
       itemOfLists:{
      	beginHour:'',
      	beginMin:'',
      	beginSecond:'',
      	endHour:'',
      	endMin:'',
      	endSecond:'',
      	id:'',
      },
      currentItem: {}, // 当前选中的行
     }
  },
  mounted() {
    this.getWorkTimesByPageAll();
  },
  methods: {

    //请求数据接口
    getWorkTimesByPage(param) {
      systemManageHttp
        .getWorkTimesByPage(this.queryParam)
        .then(res => {
          if (res.data.statusCode === 200) {
            this.responseDatas = res.data.data;
            this.workingTimeSetting = this.responseDatas.recordList;
          } else {
            this.responseDatas = {};
            this.workingTimeSetting = [];
            this.responseDatas.totalRecord = 0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 请求全部数据
    getWorkTimesByPageAll() {
      this.queryParam.pageNum = 1;
      this.queryParam.pageSize = 10;
      (this.setPageSize = 10), (this.currentPage = 1);
      this.getWorkTimesByPage(this.queryParam);
    },
    // 每页条数变化时，重新请求
    changePageSize(val) {
      this.queryParam.pageSize = val;
      this.queryParam.pageNum = 1;
      if (this.currentPage !== 1 || this.setPageSize !== 10) {
        this.currentPage = 1;
        this.setPageSize = 10;
      } else {
        this.getWorkTimesByPage(this.queryParam);
      }
    },
    // 改变页码时，重新请求
    changeCurrentPage(val) {
      this.queryParam.pageNum = val;
      this.getWorkTimesByPage(this.queryParam);
    },
    //点击编辑按钮
    handleClick(rows){
    	this.dialogEditVisible = true;	
      this.currentItem.id=rows.id;
      this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : '';
    	for (var i of Object.keys(rows)) {
          this.itemOfLists[i] = rows[i];
        }
    },
    //编辑弹框 确定按钮
	commitEditedItem(formName){
		this.$refs[formName].validate((valid) => {
	        if (valid) {
	          this.sendEditWorking();
	        } else {
	        }
      });
	},
	sendEditWorking(){
		this.loadingFlag = true;
      this.loadingTxt = "加载中";
      this.itemOfLists.id = this.currentItem.id;
      this.itemOfLists.beginHour=this.itemOfLists.beginHour*1;
      this.itemOfLists.beginMin=this.itemOfLists.beginMin*1;
      this.itemOfLists.beginSecond=this.itemOfLists.beginSecond*1;
      this.itemOfLists.endHour=this.itemOfLists.endHour*1;
      this.itemOfLists.endMin=this.itemOfLists.endMin*1;
      this.itemOfLists.endSecond=this.itemOfLists.endSecond*1;

      systemManageHttp
        .updateWorkTime(this.itemOfLists)
        .then(res => {
          if(res.data.statusCode === 200){
            this.$message({
              message: res.data.msg?res.data.msg:"操作成功！",
              type: 'success'
            })

            this.dialogEditVisible = false;
            this.cacheUserCode = "";
            this.getWorkTimesByPage(this.queryParam);
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

  },
};

</script>
<style>
</style>
