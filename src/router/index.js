import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/view/HelloWorld'

// 登录页
import login from '@/view/login/login'
// 工作台
import workbench from '@/view/workbench/workbench'

// 机构管理
import organManage from '@/view/systemManage/organManage/organManage'
// 资源管理
import resourceManage from '@/view/systemManage/resourceManage/resourceManage'
// 用户管理
import userManage from '@/view/systemManage/userManage/userManage'
// 流程角色管理
import processRoleManage from '@/view/systemManage/processRoleManage/processRoleManage'
// 功能角色管理
import functionalRoleManage from '@/view/systemManage/functionalRoleManage/functionalRoleManage'
// 分单配置
import appConfig from '@/view/systemManage/appConfig/appConfig'
// 节假日设置
import HolidaySetting from '@/view/systemManage/parameterManagement/HolidaySetting'
// 工作时段设置
import workingTimeSetting from '@/view/systemManage/parameterManagement/workingTimeSetting'

Vue.use(Router)

const routes = [
{
  path: '/',
  component: login
},
{
  // 工作台  误改, 误删
  path: '/workbench',
  component: workbench
},
{
  path: '/HelloWorld',
  component: HelloWorld
},

//-------------------系统管理------------
{
  path: '/organManage',
  component: organManage
},
{
  path: '/resourceManage',
  component: resourceManage
},
{
  path: '/userManage',
  component: userManage
},
{
  path: '/processRoleManage',
  component: processRoleManage
},
{
  path: '/functionalRoleManage',
  component: functionalRoleManage
},
{
  path: '/appConfig',
  component: appConfig
},
{
  path: '/HolidaySetting',
  component: HolidaySetting
},
{
  path: '/workingTimeSetting',
  component: workingTimeSetting
},

];

const router = new Router({
  routes
});

export default router;
