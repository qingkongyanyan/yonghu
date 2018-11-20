exports.install = function (Vue, options) {
  // 金额格式化，添加千分位
  function toDecimal2(x) {
    var f = parseFloat(x); 
    if (isNaN(f)) { 
      return false; 
    } 
    var f = Math.round(x*100)/100; 
    var s = f.toString(); 
    var rs = s.indexOf('.'); 
    if (rs < 0) { 
      rs = s.length; 
      s += '.'; 
    } 
    while (s.length <= rs + 2) { 
      s += '0'; 
    } 
    return s; 
  }

  Vue.prototype.initMoneyFormat = function (value){
    if (value === null || value === "" || value == ".") {
      return "";
    }

    value = value.toString();
    var val = value.replace(/,/g, "");

    val = toDecimal2(val);
    var indexOfPoint = val.indexOf(".");

    if (indexOfPoint >= 0) {
      var integerPart = val.slice(0, indexOfPoint);
      var decimalPart = val.slice(indexOfPoint);
    } else {
      var integerPart = val;
    }

    if (integerPart) {
      var pattern = /(?=((?!\b)\d{3})+$)/g;
      integerPart = integerPart.replace(pattern, ",");
    }

    return integerPart + decimalPart;
  }

  // 电话号码校验
  Vue.prototype.checkTelephone = function(rule, value, callback) {
    if (!value) {
      callback(); return;
    }
    if (value.indexOf("-") < 0) {
      var reg1 = /^1[34578]\d{9}$/;
    } else {
      var reg1 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    }
    if (!reg1.test(value)) {
      callback(new Error("区号-电话号码或者11位手机号！"));
    }else{
      callback();
    }
  };

  // 邮编校验
  Vue.prototype.checkPostCode = function(rule, value, callback){
    if(!value){
      callback(); return;
    }
    var reg = /^[1-9]\d{5}(?!\d)$/;
    if(!reg.test(value)){
      callback(new Error("邮编格式不正确！"))
    }else{
      callback();
    }
  }

  // 邮箱校验
  Vue.prototype.checkEmail = function(rule, value, callback) {
    if (!value) {
      callback(); return;
    }
    var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (!reg.test(value)) {
      callback(new Error("有效格式(例:abc@126.com)"));
    }else{
      callback();
    }
  }
  
  // 身份证号校验
  Vue.prototype.checkIdNumber = function(rule, value, callback) {
    if (!value) {
      callback(); return;
    }
    var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$)$/;
    if (!reg.test(value)) {
      // callback(new Error("不是有效身份证号(最后一位如果是X，请使用大写X)"));
      callback(new Error("不是有效身份证号"));
    }else{
      callback();
    }
  }
}