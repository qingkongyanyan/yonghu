import apiService from '../../util/apiServer'
import appConstant from '../../util/constant'

var URL = {
  // 登录后获取用户菜单资源-------------------------------------------
  getNavTree: "user/getResTree",
  // 功能角色-------------------------------------------
  // 请求数据接口
  getRoles: "roleMgr/getRolesByPage",
  // 根据 id 查询角色
  getRoleById: "get::roleMgr/getRoleById",
  // 编辑角色
  updateRole: "roleMgr/updateRole",
  // 启用停用角色
  updateValidFlag: "get::roleMgr/updateValidFlag",
  // 新增角色
  addRole: "roleMgr/addRole",
  // 授权角色
  grantRes: "roleMgr/grantRes",

  // 流程角色-------------------------------------------
  // 新增流程角色
  addFlowRole: "flowRole/addFlowRole",
  // 修改流程角色
  modifyFlowRole: "flowRole/modifyFlowRole",
  // 查询流程角色列表
  getFlowRoleByPage: "flowRole/getFlowRoleByPage",
  // 查询流程角色列表
  getFlowRoleById: "get::flowRole/getFlowRoleById",
  

  // 资源管理-------------------------------------------
  // 查询资源列表
  getResTree: "res/getResTree",
  // 查看某一条资源
  getResItem: "get::res/get",
  // 添加一条资源
  add: "res/add",
  // 修改一条资源
  update: "res/update",

  // 机构管理-------------------------------------------
  // 根据条件查询机构树
  getOrgTreeForAdvanced: "org/getOrgTreeForAdvanced",
  // 机构树
  getOrgTree: "org/getOrgTree",
  // 获取自身与子机构的数
  getTreeParentAndChildren: "org/getTreeParentAndChildren",
  // 查询映射机构树
  orgTranscriptMapping: "orgTranscriptMapping/tree",

  // 激活/注销
  updateValidFlagOrg: "org/updateValidFlag",
  // 查看

  // 编辑
  updateOrg: "org/update",
  // 新增
  addOrg: "org/add",

  // 获取省份
  queryProvince: "get::area/areas",

  // 用户管理-------------------------------------------
  // 添加用户
  addUser: "user/addUser",
  // 编辑用户
  updateUser: "user/updateUser",
  // 注销激活休息用户
  updateUserValidFlag: "get::user/updateUserValidFlag",
  // 分页查询用户
  getUsersByPage: "user/getUsersByPage",
  // 根据 id 查询用户
  getUserById: "get::user/getUserById",

  // 授权功能角色时，获取功能角色列表
  getUserRoleList: "get::user/getUserRoleList",
  // 授权流程角色时，获取流程角色列表
  getUserFlowRoleList: "get::user/getUserFlowRoleList",
  // 下拉框获取功能角色
  getCurrentUserRole: "get::roleMgr/getCurrentUserRole",
  // 下拉框获取流程角色
  getCurrentUserFlowRole: "get::flowRole/getCurrentUserFlowRole",

  // 获取经营产品
  getProductForUser: "product/getProductForUser",
  getProduct4Org: "get::product/getProduct4Org",

  // 授权功能角色
  grantUserRole: "user/grantUserRole",
  // 授权流程角色
  grantUserFlowRole: "user/grantUserFlowRole",
  // 批量重置密码
  resetPwd: "user/resetPwd",

  // 查询有效的营业部
  getAllNormalSalesDepartment: "get::org/getAllNormalSalesDepartment",
  // 根据结构类别查询有效的营业部
  getNormalSalesDepartmentByOrgCate: "org/getNormalSalesDepartmentByOrgCate",

  // 机构编码唯一性校验
  checkOrgCodeUnique: "org/checkOrgCodeUnique",
  // 用户编码唯一性校验
  checkUserCodeUnique: "get::user/checkUserCodeUnique",
  // 角色编码唯一性校验
  checkRoleCodeUnique: "get::roleMgr/checkRoleCodeUnique",
  // 校验流程编号,流程名称  流程角色 新增/编辑
  checkFlowCodeUniq:"get::flowRole/checkCodeUniq",
  // 校验角色编号,角色名称 功能角色 新增/编辑
  checkRoleCodeUniq:"get::roleMgr/checkCodeUniq",
  
  // 参数管理
  //节假日设置 列表查询
  getHolidaysByPage:"holiday/getHolidaysByPage",
  //节假日设置 删除
  deleteHoliday:'get::holiday/deleteHoliday',
  //节假日设置 新增
  addHoliday:"holiday/addHoliday",
  //节假日设置 编辑
  updateHoliday:"holiday/updateHoliday",
  //工作时间列表接口
  getWorkTimesByPage:"workTime/getWorkTimesByPage",
  //修改 工作时间 接口
  updateWorkTime:"workTime/updateWorkTime",
  //节假日期唯一性校验
  checkUniq:"get::holiday/checkUniq",
};

var systemManageHttp = apiService(appConstant.baseUrl_user).build(URL);

export default systemManageHttp