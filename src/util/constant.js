// 一些全局公用变量

var appConstant = {};

// url 配置
var host = location.hostname,
  port = 80,
  // developmentEnv = "10.1.26.203", // 开发环境
  // testEnv = "10.1.26.200", // 测试环境
  // developmentEnv = "codeuseros.nuoyuan.com.cn", // 开发环境
  // developmentEnv = "codeuseros.nuoyuan.com.cn", // 开发环境
  developmentEnv ='testuseros.nuoyuan.com.cn',
  testEnv = "testuseros.nuoyuan.com.cn", // 测试环境
  releaseEnv = "preuseros.nuoyuan.com.cn", // 准生产环境
  productionEnv = "useros.nuoyuan.com.cn"; // 生产环境

if (host === productionEnv) {
  host = productionEnv;
  appConstant.platform = "http://platform.nuoyuan.com.cn"
} else if (host === releaseEnv) {
  host = releaseEnv;
  appConstant.platform = "http://preplatform.nuoyuan.com.cn"
} else if (host === testEnv) {
  host = testEnv;
  appConstant.platform = "http://testplatform.nuoyuan.com.cn"
} else {
  host = testEnv;
  // host = 'test-gateway.nuoyuan.com.cn/users'
  appConstant.platform = "http://testplatform.nuoyuan.com.cn"
}

appConstant.baseUrl_user = "http://" + host +"/base/";
// appConstant.baseUrl_user = "http://" + host + (80 === port ? '' : (':' + port)) + "/base/";
// appConstant.baseUrl_user = "http://10.1.26.50:8080/base/"; // 礼飞本地环境
// appConstant.baseUrl_user = "http://10.1.26.53:20717/base/"; // 小晶本地环境
// appConstant.baseUrl_user = "http://10.1.26.48:8080/base/"; // 瑞华本地环境
// appConstant.baseUrl_user = "http://10.1.23.24:20717/base/"; // 曹朦本地环境

// 工作流接口
appConstant.baseUrl_bpm = "http://" + host + "/bpm-service/";
// appConstant.baseUrl_bpm = "http://10.1.26.200:9480/bpm-service/";

export default appConstant