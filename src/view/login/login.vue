<template>
  <!-- 大背景 -->
  <div class="bg">
    <div class="login">
      <div class="container">
        <div class="bg-left"></div>
        <div class="content">
          <div class="log">
            <div class="log-icon">
            </div>
            <div class="log-title">
              <div class="log-title-first">
                用户管理系统
              </div>
              <div class="log-title-second">
                HanFor Cooperative Working Platform
              </div>
            </div>
          </div>
          <div class="form-class">
            <div class="user-class login-font">用户名</div>
            <!-- <span class="user-icon" model="userCode"></span> -->
            <el-input prefix-icon="el-icon-user" class="user-input" v-model="userCode" placeholder="请输入用户名">
              <!-- <i slot="prefix" class="el-input__icon el-icon-date"></i> -->
            </el-input>
            <div class="password-class login-font">密码</div>
            <!-- <span class="password-icon"></span> -->
            <el-input type="password" prefix-icon="el-icon-password" class="password-input" v-model="password" placeholder="请输入密码">
            </el-input>

            <div class="verify-class login-font">验证码</div>
            <div>
              <el-input type="text" prefix-icon="el-icon-password" class="verify-input" @keyup.enter.native="loginFn" v-model="verifyCode" placeholder="请输入验证码"></el-input>
              <div class="codeImg" @click="getImgCheckCode"><img v-bind:src='strImg'></div>
            </div>

            <el-button class="submit-button" type="primary" @click="loginFn()">登 录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userCode: "",
      password: "",
      verifyCode: '',
      checkCodeId: '',
      strImg: ''
    };
  },
  mounted(){
    this.getImgCheckCode();
  },
  methods: {
    getImgCheckCode(){
      this.get("http://testplatform.nuoyuan.com.cn/remote/user/getImgCheckCode").then(res=>{
      // this.get("http://10.1.26.50:8080/remote/user/getImgCheckCode").then(res=>{
      // this.get("http://10.1.26.48:8080/remote/user/getImgCheckCode").then(res=>{
        this.strImg = res.data.strImg;
        this.checkCodeId = res.data.checkCodeId;
      })
    },
    loginFn() {
      this.post("http://testplatform.nuoyuan.com.cn/base/user/notSession_login",{
      // this.post("http://10.1.26.50:8080/base/user/notSession_login",{
      // this.post("http://10.1.26.48:8080/base/user/notSession_login",{
        userCode: this.userCode,
        password: this.password,
        verifyCode: this.verifyCode,
        checkCodeId: this.checkCodeId,
        isFirstLogin: ''
      })
      .then(res => {
        if (res.statusCode != '200') {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
          return;
        }
        if (res.statusCode == '200') {
          this.$router.push({ path: 'workbench'});
        }

      });
    }
  }
};

</script>
<style>
.bg {
  width: 100%;
  height: 100%;
  /*background: linear-gradient(to right, #00a1ff, #42b1f2);*/
  background-image: url("../images/bg.png");
  background-repeat: repeat-y;
  background-size: 100% 100%;
}


/* 1366 * 768 */

.login {
  min-width: 1080px;
  min-height: 530px;
  /*padding: 123px;*/
  /*background: linear-gradient(to right, #00a1ff, #42b1f2);*/
  margin: 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -540px;
  margin-top: -265px;
}

.login .container {
  width: 100%;
  height: 535px;
}


/* 左块 区域 */

.login .bg-left {
  width: 446px;
  height: 100%;
  background: url("../images/bg-2.png") no-repeat;
  float: left;
  margin-top: 50px;
}


/* 右块 区域 */


/* 右侧 包含 Log*/

.login .content {
  width: 530px;
  height: 530px;
  float: left;
  margin-left: 100px;
}


/* log */

.login .log {
  width: 100%;
  height: 82px;
  margin-bottom: 30px;
  /*background: url("../images/log-1.png") no-repeat 43px;*/
}


/* log-icon */


/* 自定义的 icon */

.login .log-icon {
  position: relative;
  top: -13px;
  z-index: 99;
  display: inline-block;
  width: 145px;
  height: 100%;
  /* background: url("../images/logo_hanfor.png") no-repeat 43px; */
}

.login .log-title {
  width: 385px;
  height: 54px;
  float: right;
  text-align: center;
  border-left: 1px solid #fff;
}

.login .log-title-first {
  font-size: 30px;
  vertical-align: middle;
  color: #fff;
  line-height: 30px;
  text-align: left;
  padding-left: 30px;
  letter-spacing: 4px;
  font: '微软雅黑', tahoma, arial, '\5b8b\4f53';
}

.login .log-title-second {
  font-size: 16px;
  color: #fff;
  text-align: left;
  padding-left: 30px;
  line-height: 30px;
  font: '宋体', tahoma, arial, '\5b8b\4f53';
  font-weight: lighter;
}


/* 表单 */

.login .form-class {
  padding: 40px;
  padding-top: 50px;
  border-radius: 20px;
  background: #fff;
  height: 443px;
  width: 530px;
  box-shadow: 0 0 10px 0 #d2d7e0;
}


/* 用户名 */

.login .user-class {
  width: 100%;
  height: 25px;
  line-height: 25px;
  font-size: 16px;
  margin-bottom: 10px;
  text-indent: 10px;
}


/* 用户名 输入框 */

.login .user-input {
  outline: 0px;
  border-radius: 10px;
  border: 0px;
  margin-bottom: 10px;
  width: 100%;
  height: 45px;
}

.login .password-class {
  width: 100%;
  height: 25px;
  line-height: 25px;
  font-size: 16px;
  margin-bottom: 10px;
  text-indent: 10px;
}

.login .password-input {
  width: 100%;
  height: 45px;
  margin-bottom: 10px;
}

.login .verify-class {
  width: 100%;
  height: 25px;
  line-height: 25px;
  font-size: 16px;
  margin-bottom: 10px;
  text-indent: 10px;
}
.login .verify-input {
  width: 290px;
  height: 45px;
  margin-bottom: 40px;
  float: left;
}

.login .codeImg {
  width: 138px;
  height: 43px;
  margin-bottom: 40px;
  float: right;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #d7e1ff;
  cursor: pointer;
}
.login .codeImg img{
  width: 100%;
  height: 100%;
}

.login .submit-button {
  width: 100%;
  height: 60px;
  font-size: 24px;
  border-radius: 4px;
}

.login .el-icon-user {
  /* position: relative;
  top: 5px;
  z-index: 99; */
  background: url("../images/icon-user.png") 5px no-repeat;
  /* width: 30px;
  height: 30px;
  display: inline-block; */
}

.login .el-icon-password {
  /* position: relative;
  top: 35px;
  z-index: 99; */
  background: url("../images/icon-password.png") 5px no-repeat;
  /* width: 20px;
  height: 20px;
  display: inline-block; */
}

.login .el-input__inner {
  text-indent: 10px;
  border-radius: 4px;
  /*border: 1px solid #bcbbbb;*/
  height: 43px;
  line-height: 43px;
  font-size: 16px; 
}

.login .el-input__icon {
  line-height: 45px;
}

.login .el-input__prefix {
  width: 40px;
  height: 30px;
  top: 7px;
  left: 2px;
  /* left: 0px !important; */
}


/* .el-icon-user{
  width: 30px;
  height: 30px;
  background:red;
} */

.login .el-button--primary{
  background-color: #409eff;
  border-color: #409eff;
}
/* 用户名 / 密码  */
.login .login-font{
  color: #666;
  font-size: 16px;
}

</style>
