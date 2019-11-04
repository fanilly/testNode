<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import { Buffer } from 'buffer'
import Vue from 'vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import { ACCESS_TOKEN, LB_LOGIN_USERINFO } from '@/store/mutation-types'
export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {
    if(Vue.ls.get(LB_LOGIN_USERINFO)){
      let lbLoginUserInfo = Vue.ls.get(LB_LOGIN_USERINFO)
      // 网页访问_WinHttp (“https://api.liaobe.cn/srv/ngsi”, 1, “data=%7B%22tp%22%3A2%2C%22tk%22%3A%22” ＋ URL编码_UTF8 (账号信息.tk) ＋ “%22%7D&ver=” ＋ #常量_版本号 ＋ “&uuid=” ＋ 账号信息.uuid ＋ “&uid=” ＋ 账号信息.uid, , , )
      this.$api.getWebsocketLink({
        data: JSON.stringify({ tp: 2, tk: lbLoginUserInfo.data.tk }),
        ver: this.$store.state.app.version,
        uid: lbLoginUserInfo.data.uid,
        uuid: this.$store.state.user.uuid
      }).then(res=> {
        console.log(res)
        if(res.r == 0){
          let host = res.data.skt[0].h
          let port = res.data.skt[0].p
          this.initSocket(host, port)
        }else{
          Vue.ls.remove(ACCESS_TOKEN)
          Vue.ls.remove(LB_LOGIN_USERINFO)
          location.reload()
        }
      })
      console.log(lbLoginUserInfo)
    }
  },
  methods: {
    initSocket(host, port){
      let ws = new WebSocket(`wss://${host}:${port}`);

      ws.onopen = (e) => {
        console.log(e)
        console.log('socket connection successful')
        let handshakePackage = JSON.stringify({HSKN:{ver: this.$store.state.app.version ,pbk: 'gnWE/H/kczHZIx+2nHgmrLnmtVVDAunW5pUUP+qi7PGz0fO18ODkHR0v1tpa0uxTEfdbLgDOfCQxDYeG0KAyv+bJgR2YFtJl9Qp+xejr46DQvhWDQyQoPPBFKhKRASzjvmU4J9IsvD7tGKIVcAWPWsxyx0QFZl0fVJdEcrSR2RZ+amZAfL7BJoCHSnoq4i14O/Vr9DxlqOQG9MPf7S/C+rm3HYjfFKoW5HpCzVEf+3C5JqrmSlW2W6c898y3PULoNzAKlPaU7zTAazMexR2y3vEJOP/nt6s+p1NU4XCZl5QDQ084TfurcD3Mpc0/BzEo/cPGfgSgw7AUxdiEareIjA=='}})
        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.send(handshakePackage);
      }

      ws.onmessage = (evt) => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        //ws.send("发送数据");
        console.log(evt)
      }

      ws.onclose = () => {
        console.log('socket closed')
      }
    }
  }
}
</script>
<style>
  #app {
    height: 100%;
  }
</style>