import apiService from '../../util/apiServer'
import appConstant from '../../util/constant'

var URL = {
  // 分单配置 -------------------------------------------
  // 分单配置查询
  getList: "bpmService/appConfig/getList",
  // 分单配置新增、编辑
  save: "bpmService/appConfig/save",
  // 分单配置查看
  getById: "bpmService/appConfig/getById",
  // 分单配置删除
  delete: "bpmService/appConfig/delete",
  

};

var bpmServerHttp = apiService(appConstant.baseUrl_bpm).build(URL);

export default bpmServerHttp