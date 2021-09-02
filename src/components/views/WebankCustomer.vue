<template>
  <div>
    <div class="res-item">
      <icon name="user"></icon>
      <el-input
        placeholder="客户名称"
        v-model="webankParam.customerName"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="laptop-code"></icon>
      <el-input
        placeholder="客户编码"
        v-model="webankParam.customerCode"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="user"></icon>
      <el-input
        placeholder="法人姓名"
        v-model="webankParam.legalPerson"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="id-card"></icon>
      <el-input
        placeholder="法人身份证"
        v-model="webankParam.idNumber"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <input
        type="hidden"
        placeholder="营业执照名称"
        v-model="webankParam.customerName"
        class="input-item"
      />
    </div>
    <div class="res-item">
      <icon name="newspaper"></icon>
      <el-input
        placeholder="营业执照信用编号"
        v-model="webankParam.licenseNo"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="business-time"></icon>
      <el-input
        type="number"
        placeholder="合作时长(月)"
        v-model.number="webankParam.cooperationDuration"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="phone-square"></icon>
      <el-input
        type="tel"
        placeholder="联系方式"
        v-model="webankParam.mobile"
        class="input-item"
      ></el-input>
    </div>
    <div class="res-item">
      <icon name="sticky-note"></icon>
      <el-input
        placeholder="备注"
        v-model="webankParam.remark"
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
import { addWebankCustom } from "@/apis/customer.api";

export default {
  name: "WebankCustomer",
  data() {
    return {
      showMsg: false,
      msg: "",
      webankParam: {},
    };
  },
  props: ["openid"],
  methods: {
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
      if (this.isEmpty(this.webankParam.customerName)) {
        this.showErrMsg("客户名称不能为空!");
        return;
      }
      if (this.isEmpty(this.webankParam.customerCode)) {
        this.showErrMsg("客户编码不能为空!");
        return;
      }
      if (this.isEmpty(this.webankParam.cooperationDuration)) {
        this.showErrMsg("请填写合作时长!");
        return;
      }
      if (this.checkLicense(this.webankParam.licenseNo)) {
        this.showErrMsg("营业执照格式错误!");
        return;
      }
      if (this.isEmpty(this.webankParam.idNumber)) {
        this.showErrMsg("请填写身份证");
        return;
      } else {
        if (!this.checkIdCard(this.webankParam.idNumber)) {
          this.showErrMsg("身份证填写有误!");
          return;
        }
      }
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let UUserCard = this.webankParam.idNumber;
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
      if (this.isEmpty(this.webankParam.mobile)) {
        this.showErrMsg("请先填手机号!");
        return;
      } else {
        if (!this.checkPhone(this.webankParam.mobile)) {
          this.showErrMsg("手机号错误!");
          return;
        }
      }
      if (this.isEmpty(this.webankParam.legalPerson)) {
        this.showErrMsg("法人姓名不能为空!");
        return;
      }
      if (this.isEmpty(this.webankParam.licenseNo)) {
        this.showErrMsg("营业执照不能为空!");
        return;
      }
      if (this.isEmpty(this.openid)) {
        this.showErrMsg("非微信访问!");
        return;
      }
      this.webankParam.createUserId = this.openid;
      addWebankCustom(this.webankParam)
        .then((res) => {
          if (res.success) {
            this.$message({
              showClose: true,
              message: "提交成功",
              type: "success",
            });
            // 提交成功之后清空页面，但openid保留
            this.webankParam = {};
            this.webankParam.createUserId = res.obj[1];
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
.res-item {
  margin-bottom: 6px;
}
.input-item {
  width: 300px;
}
</style>
