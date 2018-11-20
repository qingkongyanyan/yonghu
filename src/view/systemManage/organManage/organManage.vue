<!-- 系统管理-机构管理-->
<template>
  <div>
    <!-- <my-head></my-head> -->
    <div class="main-div organManage " @click="getDropDownSelect">
      <div class="keywordContainer search-div">
        <el-row class="row row1" type="flex">
          <el-col class="search-item" :span="6" :offset="0">
            <span class="keywordText">机构名称：</span>
            <el-input v-model.trim="orgName" @keyup.enter.native="getOrgsByKey" placeholder="请输入机构名称"></el-input>
          </el-col>
          <el-col class="search-item" :span="6">
            <span class="keywordText">机构编号：</span>
            <el-input v-model.trim="orgCode" @keyup.enter.native="getOrgsByKey" placeholder="请输入机构编号"></el-input>
          </el-col>
          <el-col class="search-item" :span="6"></el-col>
          <el-col class="search-item search-btn" :span="6">
            <el-button class="btn query" type="primary" @click="getOrgsByKey">查询</el-button>
            <el-button class="btn reset" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="title titleContainer edit-div">
        <span class="titleText">
          <i class="el-icon title-icon"></i>
          机构列表
        </span>
        <span class="iconContainer">
          <span class="icon-item" @click="changeState('add')">
            <i class="el-icon addIcon"></i><span class="el-icon-text">新增</span>
          </span>
          <span class="icon-item" @click="changeState('stop')">
            <i class="el-icon restIcon"></i><span class="el-icon-text">停用</span>
          </span>
          <span class="icon-item" @click="changeState('enable')">
            <i class="el-icon enableIcon"></i><span class="el-icon-text">启用</span>
          </span>
        </span>
      </div>
      <div class="listContainer">
        <div class="tree-grid">
          <tree-grid :columns="columns" :tree-structure="true" :data-source="orgDatas" v-on:selectRow="selectItem"
            v-on:handleItem="handleOrg"></tree-grid>
        </div>
      </div>
      <!-- 编辑框 -->
      <el-dialog :title="titleTxt" :visible.sync="dialogEditVisible">
        <el-form :model="itemOfLists" :rules="rules" ref="ruleForm">
          <div>
            <el-form-item class="fl" label="上级机构：" :label-width="formLabelWidth">
              <div class="dropdown">
                <span class="dropdownInput">{{parentOrgName}}</span>
                <div class="dropList" v-show="dropdownFlag">
                  <el-tree :data="orgDatasEdit" node-key="id" :load="loadNode" lazy :props="defaultProps2"
                    :expand-on-click-node=false @node-click="getItemSelect">
                  </el-tree>
                </div>
              </div>
            </el-form-item>
            <el-form-item class="fr" label="机构编号：" clearValidate prop="orgCode" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgCode" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构性质：" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.orgType" placeholder="">
                <el-option v-for="item in orgTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr" label="机构名称：" prop="orgName" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgName" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构级别：" prop="orgLevel" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.orgLevel" @change="isBusi" placeholder="">
                <el-option v-for="item in orgLevels" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="fr" label="机构类别：" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.orgCate" @change="isXinxiao" class="orgCate" placeholder="">
                <el-option v-for="item in orgCates" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构简称：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.simpleOrgName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="省份简称：" prop="shortProvince" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.shortProvince" placeholder="">
                <el-option v-for="item in shortProvinces" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="加急比例：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgUrgentRate" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="加急件数：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgUrgentNum" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl productName newProName" label="经营产品：" :label-width="formLabelWidth">
              <el-select v-model="itemOfLists.proIds" multiple placeholder="" @change="multipleSelect">
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
            <el-form-item class="fl" label="机构负责人：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgPrin" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构邮编：" prop="orgZip" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgZip" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构电话：" prop="orgFax" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgFax" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构联系人：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgLink" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构联系人电话：" prop="orgLinkTel" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.orgLinkTel" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构email：" prop="email" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.email" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fr recordComName " label="备案公司名称：" :label-width="formLabelWidth">
              <el-input v-model="itemOfLists.recordComName" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item label="机构地址：" class="address" :label-width="formLabelWidth">
              <el-form-item class="prov-city-count" label=" " :label-width="'0px'" prop="orgProvinceName">
                <el-select ref="province" @change="setProvince" v-model="itemOfLists.orgProvinceName" placeholder="请选择">
                  <el-option v-for="item in provinces" :key="item.id" :label="item.areaName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="prov-city-count" label=" " :label-width="'0px'" prop="orgCityName">
                <el-select ref="city" @visible-change="getCity" @change="setCity" v-model="itemOfLists.orgCityName"
                  placeholder="请选择">
                  <el-option v-for="item in citys" :key="item.id" :label="item.areaName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="prov-city-count" label=" " :label-width="'0px'" prop="orgCountyName">
                <el-select ref="county" @visible-change="getCounty" @change="setCounty" v-model="itemOfLists.orgCountyName"
                  placeholder="请选择">
                  <el-option v-for="item in countys" :key="item.id" :label="item.areaName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label=" " :label-width="'0px'" prop="orgStreet">
                <el-input class="orgStreet" v-model="itemOfLists.orgStreet" auto-complete="off"></el-input>
              </el-form-item>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogEditVisible = false">取 消</el-button> -->
          <el-button type="primary" v-if="addOrEdit==='add'" :loading="loadingFlag" @click="addOrg('ruleForm')">{{loadingTxt}}</el-button>
          <el-button type="primary" v-if="addOrEdit==='edit'" :loading="loadingFlag" @click="editOrg('ruleForm')">{{loadingTxt}}</el-button>
        </div>
      </el-dialog>
      <!-- 查看 -->
      <el-dialog title="机构详情" :visible.sync="dialogCheckVisible" custom-class="el-dialog-check">
        <el-form :model="itemOfLists">
          <div>
            <el-form-item class="fl" label="上级机构：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.parentOrgName"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构编号：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgCode"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构性质：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgTypeTxt"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构名称：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgName"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构级别：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgLevelTxt"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构类别：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgCateTxt"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构简称：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.simpleOrgName"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="省份简称：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.shortProvinceTxt"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="加急比例：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgUrgentRate"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="加急件数：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgUrgentNum"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl productName productNameCheck newProName" label="经营产品：" :label-width="formLabelWidth">
              <el-input readonly type="textarea" :rows="1" resize=none :value="itemOfLists.productNameStr"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构负责人：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgPrin"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构邮编：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgZip"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构电话：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgFax"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构联系人：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgLink"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="机构联系人电话：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgLinkTel"></el-input>
            </el-form-item>
          </div>
          <div class="bfc">
            <el-form-item class="fl" label="机构email：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.email"></el-input>
            </el-form-item>
            <el-form-item class="fr" label="备案公司名称：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.recordComName"></el-input>
            </el-form-item>
          </div>
          <div class="bfc bfcArr">
            <el-form-item class="fl" label="机构地址：" :label-width="formLabelWidth">
              <el-input readonly :value="itemOfLists.orgProvinceName"></el-input>
              <el-input readonly :value="itemOfLists.orgCityName"></el-input>
              <el-input readonly :value="itemOfLists.orgCountyName"></el-input>
              <el-input class="orgStreeCheck" readonly :value="itemOfLists.orgStreet"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogCheckVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 停用 -->
      <!-- <el-dialog title="询问" :visible.sync="dialogStopVisible" width="30%">
      <span>确定操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStopVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateValidFlag('1')">确 定</el-button>
      </span>
    </el-dialog> -->
      <!-- 启用 -->
      <!-- <el-dialog title="询问" :visible.sync="dialogEnableVisible" width="30%">
      <span>确定操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEnableVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateValidFlag('0')">确 定</el-button>
      </span>
    </el-dialog> -->
      <!-- 未选中提示 -->
      <!--     <el-dialog title="提示" :visible.sync="dialogAlertVisible" width="30%">
      <span>请选择要新增子机构的目标机构！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAlertVisible = false">确定</el-button>
      </span>
    </el-dialog> -->
    </div>
  </div>
</template>
<script>
  //import myHead from "@/view/header/header.vue";
  import systemManageHttp from "../systemManage_ser.js";
  import TreeGrid from "../treeGrid";
  import appConstant from "../../../util/constant";
  export default {
    data() {
      var isOnly = (rule, value, callback) => {
        var oldValue_parentOrgCode = this.cacheParentOrgCode ? this.cacheParentOrgCode.split("") : '';
        var oldValue_orgCode = this.cacheOrgCode.split("");
        var newValue = value.split("");
        if (oldValue_parentOrgCode) {
          var flag = oldValue_parentOrgCode.every(function (item, index) {
            return item == newValue[index]
          })
        }

        // 编辑时，机构编号可以是带出值（原值）
        if (this.addOrEdit == 'edit' && oldValue_orgCode.join("") == newValue.join("")) {
          return callback()
        }

        if (oldValue_parentOrgCode.length >= newValue.length) {
          return callback(new Error('以上级机构编号为起始编号!'));
        }
        if (oldValue_parentOrgCode.length < newValue.length) {
          if (!flag) {
            return callback(new Error('以上级机构编号为起始编号!'));
          }
        }

        systemManageHttp.checkOrgCodeUnique({
          orgCode: value
        }).then(res => {
          if (res.data.data == 0) {
            return callback(new Error('机构编号已存在!'));
          } else {
            return callback()
          }
        })
      }
      return {
        orgName: '',
        orgCode: '',
        orgDatas: [],
        orgDatasEdit: [],
        currentOrg: {}, // 当前选中的机构
        itemOfLists: {
          orgCode: '',
          orgName: '',
          orgLevel: ''
        },
        provinces: [],
        citys: [],
        countys: [],
        dropdownFlag: false,
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogCheckVisible: false,
        dialogStopVisible: false,
        dialogEnableVisible: false,
        dialogAlertVisible: false,

        formLabelWidth: "140px",

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
        orgCates: [],

        // 省份简称
        shortProvinces: [{
            label: '京',
            value: '01'
          },
          {
            label: '津',
            value: '02'
          },
          {
            label: '渝',
            value: '03'
          },
          {
            label: '沪',
            value: '04'
          },
          {
            label: '冀',
            value: '05'
          },
          {
            label: '晋',
            value: '06'
          },
          {
            label: '辽',
            value: '07'
          },
          {
            label: '吉',
            value: '08'
          },
          {
            label: '黑',
            value: '09'
          },
          {
            label: '苏',
            value: '10'
          },
          {
            label: '浙',
            value: '11'
          },
          {
            label: '皖',
            value: '12'
          },
          {
            label: '闵',
            value: '13'
          },
          {
            label: '赣',
            value: '14'
          },
          {
            label: '鲁',
            value: '15'
          },
          {
            label: '豫',
            value: '16'
          },
          {
            label: '鄂',
            value: '17'
          },
          {
            label: '湘',
            value: '18'
          },
          {
            label: '粤',
            value: '19'
          },
          {
            label: '琼',
            value: '20'
          },
          {
            label: '川/蜀',
            value: '21'
          },
          {
            label: '贵/黔',
            value: '22'
          },
          {
            label: '云/滇',
            value: '23'
          },
          {
            label: '陕/秦',
            value: '24'
          },
          {
            label: '甘/陇',
            value: '25'
          },
          {
            label: '青',
            value: '26'
          },
          {
            label: '台',
            value: '27'
          },
          {
            label: '内蒙古',
            value: '28'
          },
          {
            label: '桂',
            value: '29'
          },
          {
            label: '宁',
            value: '30'
          },
          {
            label: '新',
            value: '31'
          },
          {
            label: '藏',
            value: '32'
          },
          {
            label: '港',
            value: '33'
          },
          {
            label: '澳',
            value: '34'
          }
        ],

        products: [],

        columns: [{
            text: "机构名称",
            minWidth: "300",
            dataIndex: "orgName"
          },
          {
            text: "机构编号",
            minWidth: "122",
            dataIndex: "orgCode"
          },
          {
            text: "机构类别",
            minWidth: "122",
            dataIndex: "orgCateTxt"
          },
          {
            text: "机构级别",
            minWidth: "122",
            dataIndex: "orgLevelTxt"
          },
          {
            text: "机构状态",
            minWidth: "122",
            dataIndex: "validFlagTxt"
          },
          {
            text: "上级机构编号",
            minWidth: "122",
            dataIndex: "parentOrgCode"
          },
          {
            text: "上级机构名称",
            minWidth: "122",
            dataIndex: "parentOrgName"
          },
          {
            text: "省份简称",
            minWidth: "105",
            dataIndex: "shortProvinceTxt"
          }
        ],
        // 表单校验
        rules: {
          orgCode: [{
              required: true,
              message: '机构编号不能为空',
              trigger: 'blur'
            },
            {
              validator: isOnly,
              trigger: 'change'
            }
          ],
          orgName: [{
            required: true,
            message: '机构名称不能为空',
            trigger: 'blur'
          }],
          orgLevel: [{
            required: true,
            message: '机构级别不能为空',
            trigger: 'change'
          }],
          orgZip: [{
            validator: this.checkPostCode,
            trigger: 'blur'
          }],
          orgFax: [{
            validator: this.checkTelephone,
            trigger: 'blur'
          }],
          orgLinkTel: [{
            validator: this.checkTelephone,
            trigger: 'blur'
          }],
          email: [{
            validator: this.checkEmail,
            trigger: 'blur'
          }],
          shortProvince: [],
          orgProvinceName: [],
          orgCityName: [],
          orgCountyName: [],
          orgStreet: [],
        },

        // 暂存的机构编号，用来校验唯一性
        cacheOrgCode: "",
        cacheParentOrgCode: "",

        // 加载中
        loadingFlag: false,
        loadingTxt: "确 定",

      };
    },
    /*watch: {
      '$route' (to, from) {
        if (to.path == '/organManage') {
          this.getOrgTreeForAdvanced();
          this.getProvince();
        }
      }
    },*/
    mounted() {
      this.getOrgTreeForAdvanced();
      this.getProvince();
    },
    methods: {
      // 根据 id 查看一条机构
      getOrgById(id) {
        this.get(appConstant.baseUrl_user + "org/get/" + id + "?" + (+new Date())).then(res => {
          this.itemOfLists = res.data;
          this.itemOfLists.productNameStr = this.itemOfLists.productNames.join(",");
          this.parentOrgName = res.data.parentOrgName;
          this.cacheOrgCode = this.itemOfLists.orgCode;
          this.cacheParentOrgCode = this.itemOfLists.parentOrgCode;
        });
      },

      // 获取经营产品
      getProduct4Org() {
        systemManageHttp.getProduct4Org({
          params: {
            timestamp: +new Date()
          }
        }).then(res => {
          this.products = res.data.data;
        })
      },

      multipleSelect(list) {
        this.itemOfLists.proIds = list;
      },

      // 查询所有机构
      getOrgTreeForAdvanced() {
        systemManageHttp
          .getOrgTreeForAdvanced({
            pid: "",
            isCurrentOrgCode: 1,
            recursiveFlag: 1,
            validFlag: "",
            orgName: "",
            orgCode: ""
          })
          .then(res => {
            this.orgDatas = res.data.data;
          });
      },

      // 重置
      reset() {
        this.orgCode = "";
        this.orgName = "";
        this.getOrgTreeForAdvanced();
      },

      // 通过关键字查询
      getOrgsByKey() {
        // this.orgDatas = [];
        systemManageHttp
          .getOrgTreeForAdvanced({
            isCurrentOrgCode: 1,
            recursiveFlag: 1,
            validFlag: "",
            orgName: this.orgName,
            orgCode: this.orgCode
          })
          .then(res => {
            this.orgDatas = res.data.data;
          });
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

      // 打开下拉菜单里的树形结构
      getDropDownSelect(event) {
        if (!this.dropdownFlag && event.target.className === 'dropdownInput') {
          this.dropdownFlag = true;
          systemManageHttp
            .getOrgTreeForAdvanced({
              isCurrentOrgCode: 1,
              recursiveFlag: 1,
            })
            .then(res => {
              this.orgDatasEdit = res.data.data;
            });
        } else {
          this.dropdownFlag = false;
        }
      },
      // 下拉菜单里的树形结构选取某一级数据
      getItemSelect(row, node, arr) {
        this.dropdownFlag = false;
        // this.get(appConstant.baseUrl_user+"res/get/"+row.id).then(res => {
        //   this.newItem.pid = res.data.pid;
        //   this.itemOfLists.pid = res.data.pid;
        //   this.resName = res.data.resName;
        //   this.resNameEdit = res.data.resName;
        // });
        this.parentOrgName = row.orgName;
        this.itemOfLists.pid = row.id;
        this.itemOfLists.orgCode = row.orgCode;
        this.itemOfLists.parentOrgName = row.orgName;
        // this.newItem.pid = row.id;
      },

      // 机构级别为营业部时，才可启用机构类别和经营产品
      isBusi(value) {
        if (value !== '06') {
          this.itemOfLists.proIds = [];
          this.itemOfLists.orgCate = '';
          this.products = [];
          this.orgCates = [];
        } else {
          this.getProduct4Org();
          this.orgCates = [{
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
          ];
        }
      },

      // 机构类别为 信销管理时，才添加 省份简称、机构电话、机构 email、机构地址为必填项
      isXinxiao(value) {
        for (var i = 0, len = this.orgCates.length; i < len; i++) {
          if (this.orgCates[i].value === value) {
            this.$forceUpdate(function () {
              this.itemOfLists.orgCate = this.orgCates[i].label;
            })
          }
        }
        if (value == '01') {
          this.rules.orgFax.push({
            required: true,
            message: '该输入项为必输项',
            trigger: 'change'
          });
          this.rules.email.push({
            required: true,
            message: '该输入项为必输项',
            trigger: 'change'
          });
          this.rules.shortProvince = [{
            required: true,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
          this.rules.orgProvinceName = [{
            required: true,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
          this.rules.orgCityName = [{
            required: true,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
          this.rules.orgCountyName = [{
            required: true,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
          this.rules.orgStreet = [{
            required: true,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
        } else {
          this.rules.orgFax = [{
            validator: this.checkTelephone,
            trigger: 'blur'
          }];
          this.rules.email = [{
            validator: this.checkEmail,
            trigger: 'blur'
          }];
          this.rules.shortProvince = [{
            required: false,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
          this.rules.orgProvinceName = [{
            required: false,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
          this.rules.orgCityName = [{
            required: false,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
          this.rules.orgCountyName = [{
            required: false,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
          this.rules.orgStreet = [{
            required: false,
            message: '该输入项为必输项',
            trigger: 'change'
          }];
        }
      },

      // 点击某一行
      selectItem(row) {
        this.currentOrg = row;
      },

      // 编辑、查看操作
      handleOrg(flag, id, orgLevel) {
        if (flag === "edit") {
          this.getOrgById(id);
          this.orgCates = [];
          this.dialogEditVisible = true;
          this.addOrEdit = 'edit';
          this.titleTxt = "编辑机构";
          this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : '';
          if (orgLevel === "06") {
            this.getProduct4Org();
            this.orgCates = [{
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
            ];
          } else {
            this.products = [];
          }
        } else if (flag === "check") {
          this.getOrgById(id);
          this.dialogCheckVisible = true;
        }
      },

      // 获取省份信息
      getProvince() {
        systemManageHttp.queryProvince().then(res => {
          this.provinces = res.data.data.ereaInfos;
        });
      },

      getCity(flag) {
        if (flag && this.itemOfLists.orgCity) {
          systemManageHttp
            .queryProvince({
              params: {
                pid: this.itemOfLists.orgProvince
              }
            })
            .then(res => {
              this.citys = res.data.data.ereaInfos;
            });
        }
      },

      getCounty(flag) {
        if (this.itemOfLists.orgCity) {
          systemManageHttp
            .queryProvince({
              params: {
                pid: this.itemOfLists.orgCity
              }
            })
            .then(res => {
              this.countys = res.data.data.ereaInfos;
            });
        }
      },

      setProvince(id) {
        this.itemOfLists.orgCity = '';
        this.itemOfLists.orgCityName = '';
        this.citys = [];
        this.itemOfLists.orgCounty = '';
        this.itemOfLists.orgCountyName = '';
        this.countys = [];
        this.itemOfLists.orgProvince = id;
        systemManageHttp
          .queryProvince({
            params: {
              pid: id
            }
          })
          .then(res => {
            this.citys = res.data.data.ereaInfos;
          });
      },

      setCity(id) {
        this.itemOfLists.orgCounty = '';
        this.itemOfLists.orgCountyName = '';
        this.countys = [];
        this.itemOfLists.orgCity = id;
        systemManageHttp
          .queryProvince({
            params: {
              pid: id
            }
          })
          .then(res => {
            this.countys = res.data.data.ereaInfos;
          });
      },

      setCounty(id) {
        this.itemOfLists.orgCounty = id;
      },

      // 编辑机构
      setEditRequest() {
        this.loadingFlag = true;
        this.loadingTxt = "加载中";
        this.itemOfLists.orgProvinceName = this.$refs.province.selectedLabel;
        this.itemOfLists.orgCityName = this.$refs.city.selectedLabel;
        this.itemOfLists.orgCountyName = this.$refs.county.selectedLabel;
        this.itemOfLists.proIds = this.itemOfLists.proIds;
        this.itemOfLists.productNames = this.itemOfLists.productNames;
        systemManageHttp
          .updateOrg(this.itemOfLists)
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.dialogEditVisible = false;
              this.getOrgTreeForAdvanced();
              this.cacheOrgCode = "";
              this.cacheParentOrgCode = "";
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
      editOrg(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.setEditRequest();
          } else {}
        });
      },

      // 添加机构
      sendAddRequest() {
        this.loadingFlag = true;
        this.loadingTxt = "加载中";
        systemManageHttp
          .addOrg(this.itemOfLists)
          .then(res => {

            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.dialogEditVisible = false;
              this.getOrgTreeForAdvanced();
              this.cacheOrgCode = "";
              this.cacheParentOrgCode = "";
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
      addOrg(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sendAddRequest();
          } else {
          }
        });
      },

      // 启用、停用、添加机构
      changeState(flag) {

        if (flag === 'add') {
          if (!this.currentOrg || !this.currentOrg.id) {
            this.$confirm('请选择要新增子机构的目标机构！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          }
          this.$refs['ruleForm'] ? this.$refs['ruleForm'].resetFields() : '';
          this.addOrEdit = 'add';
          this.titleTxt = '新增机构';
          this.dialogEditVisible = true;
          this.itemOfLists = {
            proIds: []
          };
          this.itemOfLists.orgCate = '';
          this.products = [];
          this.orgCates = [];
          this.countys = [];
          this.citys = [];
          this.parentOrgName = this.currentOrg.orgName;
          this.itemOfLists.pid = this.currentOrg.id;
          this.itemOfLists.orgCode = this.currentOrg.orgCode;
          this.cacheOrgCode = this.currentOrg.orgCode;
          this.cacheParentOrgCode = this.currentOrg.orgCode;
          return
        }

        if (flag === "stop") {
          if (!this.currentOrg || !this.currentOrg.id) {
            this.$confirm('请选择要停用的机构！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch(() => {

            });
            return;
          } else {
            this.$confirm('请确认是否要停用选中目标机构？', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {
              this.updateValidFlag('1')
            }).catch(() => {

            });
            return;
          }
        } else if (flag === "enable") {
          if (!this.currentOrg || !this.currentOrg.id) {
            this.$confirm('请选择要启用的机构！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {}).catch(() => {

            });
            return;
          } else {
            this.$confirm('请确认是否要启用选中目标机构？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.updateValidFlag('0')
            }).catch(() => {

            });
            return;
          }
        }
      },

      // 启用停用角色
      updateValidFlag(flag) {
        systemManageHttp
          .updateValidFlagOrg({
            id: this.currentOrg.id,
            validFlag: flag
          })
          .then(res => {
            if (res.data.statusCode === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : "操作成功！",
                type: 'success'
              })
              this.currentOrg = null;
              this.getOrgTreeForAdvanced();
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
        if (flag === "1") {
          this.dialogStopVisible = false;
        } else {
          this.dialogEnableVisible = false;
        }
      },
    },
    components: {
      //myHead,
      TreeGrid
    }
  };

</script>
<style>
  .organManage {}

  .organManage .tree-grid .el-table {
    overflow: auto;
  }

  /*备案公司名*/

  .organManage .el-dialog .recordComName {
    width: 97%;
  }

  .organManage .el-dialog .recordComName .el-input__inner {
    width: 100%;
  }


  .organManage .el-dialog .productName .el-select {
    width: 97%;
  }

  .organManage .el-dialog .orgStreet .el-input__inner {
    width: 97%;
    /* margin-top: 10px; */
  }

  .organManage .el-dialog .el-form-item .dropList {
    background-color: #fff;
    border: 1px solid #dfe4ed;
    border-radius: 4px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    position: absolute;
    top: 50px;
    left: 0;
    z-index: 111;
    height: 235px;
    width: 184px;
    font-size: 12px;
    overflow-y: scroll;
    overflow-x: scroll;
  }

</style>
