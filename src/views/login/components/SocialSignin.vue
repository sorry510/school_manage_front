<template>
  <div class="social-signup-container">
    <div class="sign-btn" @click="lineHandleClick('Line')">
      <span class="wx-svg-container"><i class="el-icon-chat-dot-round" /></span>
      Line
    </div>
  </div>
</template>

<script>
import openWindow from '@/utils/open-window'

export default {
  name: 'SocialSignIn',
  methods: {
    lineHandleClick(thirdPart) {
      openWindow(
        `${process.env.VUE_APP_BASE_API}/login/line`,
        thirdPart,
        540,
        540
      )
      // 通过监听，父页面可以拿到子页面传递的token，父(前端页面)，子(小窗)
      let getMessage = false
      window.addEventListener(
        'message',
        (e) => {
          if (typeof e.data === 'string' && !getMessage) {
            try {
              // 获取用户信息成功
              const result = JSON.parse(e.data)
              console.log(result)
              getMessage = true
            } catch (e) {
              console.log('error data: ', e.data)
            }
          }
          console.log(e)
        },
        false
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.social-signup-container {
  margin: 20px 0;
  .sign-btn {
    display: inline-block;
    cursor: pointer;
  }
  .icon {
    color: #fff;
    font-size: 24px;
    margin-top: 8px;
  }
  .wx-svg-container,
  .qq-svg-container {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding-top: 1px;
    border-radius: 4px;
    margin-bottom: 20px;
    margin-right: 5px;
  }
  .wx-svg-container {
    background-color: #24da70;
  }
  .qq-svg-container {
    background-color: #6ba2d6;
    margin-left: 50px;
  }
}
</style>
