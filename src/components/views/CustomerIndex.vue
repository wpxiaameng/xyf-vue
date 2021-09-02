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
    <YQTCustomer
      v-if="customerType === '1'"
      :openid="openid"
      :areaOptions="areaOptions"
      :officeOptions="officeOptions"
    ></YQTCustomer>
    <WebankCustomer
      v-if="customerType === '2'"
      :openid="openid"
    ></WebankCustomer>
  </div>
</template>
<script>
import { getOpenid } from "@/apis/wxOauth.api.js";
import YQTCustomer from "@/components/views/YQTCustomer";
import WebankCustomer from "@/components/views/WebankCustomer";

export default {
  name: "CustomerIndex",
  components: { YQTCustomer, WebankCustomer },
  data() {
    return {
      customerType: "1",
      openid: "",
      areaOptions: [],
      officeOptions: [],
    };
  },
  created() {
    let code = this.getUrlKey("code");
    if (code) {
      getOpenid({ code: code })
        .then((res) => {
          this.openid = res.obj.openid;
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
</style>