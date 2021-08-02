<template>
  <div>
    <div>
      <el-radio-group v-model="customerType" fill="#67c23a">
        <el-radio-button label="1">银企通客户</el-radio-button>
        <el-radio-button label="2">微众银行客户</el-radio-button>
      </el-radio-group>
    </div>
    <div class="notice">
      1.贷款人需为企业法人且最大股东&nbsp;&nbsp; 2.企业成立满24个月
      <br />
      3.企业近三个月无工商信息变更记录&nbsp;&nbsp; 4.法人60周岁以下
      <br />
      5.营业执照为三证合一新证&nbsp;&nbsp; 6.在公司开户满两年
      <br />
      7.公司开户名称需要营业执照名称一致
    </div>
    <div class="res-item">
      <icon name="user"></icon>
      <el-input
        placeholder="客户名称"
        v-model="params.name"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="laptop-code"></icon>
      <el-input
        placeholder="客户编码"
        v-model="params.code"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="user"></icon>
      <el-input
        placeholder="法人姓名"
        v-model="params.legalPerson"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="id-card"></icon>
      <el-input
        placeholder="法人身份证"
        v-model="params.idNumber"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <input
        type="hidden"
        placeholder="营业执照名称"
        v-model="params.customerName"
        class="input-item"
      />
    </div>
    <div class="res-item">
      <icon name="newspaper"></icon>
      <el-input
        placeholder="营业执照信用编号"
        v-model="params.licenseNo"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="phone-square"></icon>
      <el-input
        type="tel"
        placeholder="联系方式"
        v-model="params.mobile"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="barcode"></icon>
      <el-input
        type="tel"
        placeholder="邮编"
        v-model="params.postalCode"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="home"></icon>
      <el-input
        placeholder="地址"
        v-model="params.street"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="map-marked"></icon>
      <el-select
        v-model="params.salesArea"
        placeholder="客户所属大区"
        class="input-item"
      >
        <el-option
          v-for="item in areaOptions"
          :key="item.title"
          :label="item.title"
          :value="item.title"
        >
        </el-option>
      </el-select>
    </div>
    <div class="res-item">
      <icon name="handshake"></icon>
      <el-select
        v-model="params.branchOffice"
        placeholder="客户所属分公司"
        class="input-item"
      >
        <el-option
          v-for="item in officeOptions"
          :key="item.title"
          :label="item.title"
          :value="item.title"
        >
        </el-option>
      </el-select>
    </div>
    <div class="res-item">
      <icon name="user"></icon>
      <el-input
        placeholder="客户所属业务员"
        v-model="params.userName"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-btn">
      <el-button type="success" round icon="el-icon-plus" @click="search"
        >提交</el-button
      >
    </div>
    <el-alert
      style="top: -400px"
      v-if="showMsg"
      :title="msg"
      type="warning"
      center
      show-icon
      @close="onclose"
    >
    </el-alert>
  </div>
</template>

<script>
import { weixinAddYQT } from "@/apis/customer.api";
import { getOpenid } from "@/apis/wxOauth.api.js";

export default {
  name: "AddCustomer",
  data() {
    return {
      customerType: "1",
      showMsg: false,
      msg: "",
      params: {},
      areaOptions: [],
      officeOptions: [],
    };
  },
  created() {
    let code = this.getUrlKey("code");
    if (code) {
      getOpenid({ code: code })
        .then((res) => {
          this.params.openid = res.obj.openid;
          this.areaOptions = res.obj.salesAreaCombobox;
          this.officeOptions = res.obj.branchOfficeCombobox;
        })
        .catch((error) => {
          console.log("error: " + error);
        });
    } else {
      this.getCodeApi();
    }
  },
  methods: {
    getCodeApi() {
      //获取code
      let urlNow = encodeURIComponent(window.location.href);
      // let scope='snsapi_userinfo';    //snsapi_userinfo snsapi_base   //静默授权 用户无感知
      let appid = process.env.APPID;
      let url =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        appid +
        "&redirect_uri=" +
        urlNow +
        "&response_type=code&scope=snsapi_base#wechat_redirect";
      window.location.href = url;
    },
    getUrlKey: function (name) {
      //获取url 参数
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.href
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    onclose() {
      this.showMsg = false;
      this.msg = "";
    },
    checkLicense(code) {
      var reg = /^[0-9A-Z]+$/; //正则表达式
      if (!reg.test(code) || code.length != 18) {
        return true;
      } else {
        return false;
      }
    },
    //验证身份证
    checkIdCard(idcard) {
      const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!regIdCard.test(idcard)) {
        return false;
      } else {
        return true;
      }
    },
    checkPhone(phone) {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
        //alert("手机号码有误，请重填");
        return false;
      } else {
        return true;
      }
    },
    isEmpty(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      } else {
        return false;
      }
    },
    showErrMsg(msg) {
      this.showMsg = true;
      this.msg = msg;
    },
    search() {
      this.showMsg = false;
      if (this.isEmpty(this.params.name)) {
        this.showErrMsg("客户名称不能为空!");
        return;
      }
      if (this.checkLicense(this.params.licenseNo)) {
        this.showErrMsg("营业执照格式错误!");
        return;
      }
      if (this.isEmpty(this.params.idNumber)) {
        this.showErrMsg("请先填身份证");
        return;
      } else {
        if (!this.checkIdCard(this.params.idNumber)) {
          this.showErrMsg("身份证填写有误!");
          return;
        }
      }
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let UUserCard = this.params.idNumber;
      let age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
      if (
        UUserCard.substring(10, 12) < month ||
        (UUserCard.substring(10, 12) == month &&
          UUserCard.substring(12, 14) <= day)
      ) {
        age++;
      }
      if (age >= 60) {
        this.showErrMsg("法人年龄必须为60周岁以下!");
        return;
      }
      if (this.isEmpty(this.params.mobile)) {
        this.showErrMsg("请先填手机号!");
        return;
      } else {
        if (!this.checkPhone(this.params.mobile)) {
          this.showErrMsg("手机号错误!");
          return;
        }
      }
      if (this.isEmpty(this.params.legalPerson)) {
        this.showErrMsg("法人姓名不能为空!");
        return;
      }
      if (this.isEmpty(this.params.licenseNo)) {
        this.showErrMsg("营业执照不能为空!");
        return;
      }
      if (this.isEmpty(this.params.postalCode)) {
        this.showErrMsg("邮编不能为空!");
        return;
      }
      if (this.isEmpty(this.params.street)) {
        this.showErrMsg("地址不能为空!");
        return;
      }
      if (this.isEmpty(this.params.salesArea)) {
        this.showErrMsg("客户大区不能为空!");
        return;
      }
      if (this.isEmpty(this.params.branchOffice)) {
        this.showErrMsg("客户分公司不能为空!");
        return;
      }
      if (this.isEmpty(this.params.userName)) {
        this.showErrMsg("客户所属业务员!");
        return;
      }
      if (this.isEmpty(this.params.openid)) {
        this.showErrMsg("非微信访问!");
        return;
      }
      this.params.customerName = this.params.name;
      weixinAddYQT(this.params)
        .then((res) => {
          if (res.success) {
            this.$message({
              showClose: true,
              message: "提交成功",
              type: "success",
            });
            // 提交成功之后清空页面，但openid保留
            this.params = {};
            this.params.openid = res.obj[1];
          } else {
            this.showErrMsg(res.msg);
          }
        })
        .catch((error) => {
          console.log("error: " + error);
        });
    },
  },
};
</script>

<style scoped>
.notice {
  color: red;
  font-size: 13px;
  text-align: left;
  width: 330px;
  margin: 8px auto;
}
.res-item {
  margin-bottom: 6px;
}
.input-item {
  width: 300px;
}
</style>
