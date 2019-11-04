<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <!-- <div class="top">
        <div class="header">
          <a href="/">
            <span class="title">鸿蒙</span>
          </a>
        </div>
        <div class="desc">

        </div>
      </div> -->

      <route-view></route-view>

      <div class="footer">
        <div class="copyright">
          Copyright &copy; 2019 All Rights Reserved
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {}
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 768px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background: #3886F0 url(~@/assets/background.svg) no-repeat 50%;
      background-size: 100%;
      padding: 110px 0 144px;
      position: relative;

      .logo {
        vertical-align: top;
        margin-right: 16px;
        border-style: none;
        position: absolute;
        left: 100px;
        top: 30px;
        width: 200px;
      }

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .title {
            font-size: 33px;
            color: #fff;
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-height: 600px;
        max-width: 760px;
        margin: 0 auto;
        border-radius: 12px;
        background: #fff url(~@/assets/login/bg01.png) no-repeat right top;
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>