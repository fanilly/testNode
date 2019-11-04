<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-row align="middle" justify="center" type="flex">
        <!-- <a-col :md="12" :span="0" class="lside">
          <img src="~@/assets/login/illustration.png">
        </a-col> -->
        <a-col :sm="24" :xs="24" :md="24" class="rside">
          <h1>账号登录</h1>
          <img v-if="!showPasswordLogin" class="qrcode" :src="$store.state.app.imgBaseUrl + loginQRcode">
          <div v-if="showPasswordLogin">
            <a-form-item class="form-item">
              <a-input
                size="large"
                type="text"
                placeholder="请输入用户名"
                v-decorator="[
                  'username',
                  {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'change'}
                ]"
              >
              </a-input>
            </a-form-item>

            <a-form-item class="form-item">
              <a-input
                size="large"
                type="password"
                autocomplete="false"
                placeholder="请输入密码"
                v-decorator="[
                  'password',
                  {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
                ]"
              >
              </a-input>
            </a-form-item>

            <a-form-item style="margin-top:24px">
              <a-button
                size="large"
                type="primary"
                htmlType="submit"
                class="login-button"
                :loading="state.loginBtn"
                :disabled="state.loginBtn"
              >确定</a-button>
            </a-form-item>
          </div>
        </a-col>
      </a-row>
    </a-form>

  </div>
</template>

<script>
import Vue from 'vue'
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { ACCESS_TOKEN, LB_LOGIN_USERINFO, LB_UUID } from '@/store/mutation-types'

export default {
  data () {
    return {
      uuid: '',
      showPasswordLogin: false,
      loginBtn: false,
      loginQRcode: '',
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false
      }
    }
  },
  mounted(){
    this.getQRCode()
  },
  methods: {
    ...mapActions(['Login']),
    getQRCode(){
      // let url = 'https://api.liaobe.cn/authlg/gqrc', 1, “data=%7B%7D&ver=” ＋ #常量_版本号 ＋ “&uuid=” ＋ 账号信息.uuid ＋ “&uid=-1”, , , , )
      /*var formData = new FormData();
      formData.append("uid", -1);
      formData.append("data", {dv:3});
      formData.append("ver", '1.5.0.0');
      formData.append("uuid", uuid());
      formData.append("dv", 3);
      formData.append("pkgn", 'liaobei');
      formData.append("cpt", 0);
      formData.append("cid", '');
      formData.append("evs", '');*/
      this.uuid = this.$utils.uuid();
      Vue.ls.set(LB_UUID, this.uuid)
      var formData = new FormData();
      formData.append("uid", -1);
      formData.append("data", JSON.stringify({}));
      formData.append("ver", this.$store.state.app.version);
      formData.append("uuid", this.uuid);

      this.$api.login(formData).then(res => {
        console.log(res)
        this.loginQRcode = res.data.img;
        this.getQRCodeCallback();
      }).catch(err => {
        console.log(err)
      })
    },
    getQRCodeCallback(){
      // “https://api.liaobe.cn/authlg/lwqrc”, 1, “data=%7B%22os%22%3A%22Windows%207%20(x64)%22%2C%22di%22%3A%22Chrome%E6%B5%8F%E8%A7%88%E5%99%A8%22%2C%22dv%22%3A3%2C%22tp%22%3A” ＋ tp ＋ “%7D&ver=” ＋ #常量_版本号 ＋ “&uuid=” ＋ 账号信息.uuid ＋ “&uid=-1”, ,
      // {"os":"Windows 10","di":"Chromium浏览器","dv":3,"tp":2}
      //formData.append("data", '%7B%22os%22%3A%22Windows%207%20(x64)%22%2C%22di%22%3A%22Chrome%E6%B5%8F%E8%A7%88%E5%99%A8%22%2C%22dv%22%3A3%2C%22tp%22%3A' + 1 + '%7D');
      let timer = setInterval( async ()=> {
        var formData = new FormData();
        formData.append('uid', -1);
        formData.append('data', JSON.stringify({ os: "Windows 10", di: "Chromium浏览器", dv: 3, tp: 2 }));
        formData.append('ver', this.$store.state.app.version);
        formData.append('uuid', this.uuid);

        let res = await this.$api.loginCallback(formData)

        switch (res.r) {
          case 2101:
            // 登录失败 此时等待用户继续登录
            break;
          case 2102:
            // 二维码过期 此时应判断是否是登录成功 如果不是需点击刷新二维码重新登录
            break;
          case 0:
            // 登录成功 清除定时器跳转到登录成功页面
            Vue.ls.set(LB_LOGIN_USERINFO, res, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(ACCESS_TOKEN, this.$utils.uuid(), 7 * 24 * 60 * 60 * 1000)
            clearInterval(timer)
            this.loginSuccess({code: 200, data: {}})
            break;
          default:
            // statements_def
            break;
        }
      }, 5000)

    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password'];

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = { ...values }
          loginParams.password = values.password
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      console.log(res)
      if(res.code == '200' && res.data){
        // if(!res.data.permission){
        //   this.$notification.warning({
        //     message: '警告',
        //     description: `当前登录用户无权限访问当前系统，请联系管理员`
        //   })
        //   return false;
        // }
        console.log(6666666)
        this.$router.push({ name: 'dashboard' })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
      }else{
        this.$notification.error({
          message: res.code,
          description: res.msg
        })
      }
    },
    requestFailed (err) {
      console.log(err)
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.form-item /deep/ .ant-input {
    border: 0;
    border-bottom: 1px solid #ccc;
}
.main /deep/ .ant-btn-primary {
    border-radius: 20px;
}
.main {
  padding-top: 120px;
  user-select: none;
  h1 {
    color: #419DFF;
    font-size: 26px;
    text-align: center;
    padding: 20px;
  }
  .lside {
    max-width: 100%;
  }
  .rside {
    padding: 0 50px;
  }
}
.user-layout-login {
  padding: 10px 70px;
  height: 358px;
  label {
    font-size: 14px;
  }

  .qrcode {
    max-width: 260px;
    display: block;
    margin: auto;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>