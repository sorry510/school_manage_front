<template>
  <div class="social-signup-container">
    <div v-if="!callback" class="sign-btn" @click="lineHandleClick('Line')">
      <span class="wx-svg-container"><i class="el-icon-chat-dot-round" /></span>
      Line
    </div>
    <div v-else>
      <el-row>
        <el-col :span="24">
          <el-avatar
            size="middle"
            :src="line.avatar"
            style="margin-left: 15px"
          />
        </el-col>
        <el-col :span="24">
          <el-select
            v-model="value"
            placeholder="请选择账号"
            @change="handleLogin"
          >
            <el-option
              v-for="item in teachers"
              :key="`${item.line_user_id}-${item.relation_id}-${item.type}`"
              :label="`${item.name}(教师)`"
              :value="`${item.line_user_id}-${item.relation_id}-${item.type}`"
            />
            <el-option
              v-for="item in students"
              :key="`${item.line_user_id}-${item.relation_id}-${item.type}`"
              :label="`${item.name}(学生)`"
              :value="`${item.line_user_id}-${item.relation_id}-${item.type}`"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style>
</style>

<script>
import openWindow from '@/utils/open-window'

export default {
  name: 'SocialSignIn',
  data() {
    return {
      callback: false, // 是否已经回调
      line: {
        id: '',
        name: '',
        avatar: '',
        email: '',
      },
      value: '',
      teachers: [
        // {
        //   line_user_id: 'U34a89770e846f5205ce6e786b6bf3895',
        //   relation_id: 8,
        //   type: 1,
        //   name: '赵云',
        // },
      ],
      students: [
        // {
        //   line_user_id: 'U34a89770e846f5205ce6e786b6bf3895',
        //   relation_id: 1,
        //   type: 2,
        //   name: 's1',
        // },
      ],
    }
  },
  methods: {
    lineHandleClick(thirdPart) {
      openWindow(
        `${process.env.VUE_APP_BASE_API}/login/line`,
        thirdPart,
        540,
        540
      )
      // 通过监听，父页面可以拿到子页面传递的token，父(前端页面)，子(小窗)
      window.addEventListener('message', this.handleMessage.bind(this), false)
    },
    handleMessage(e) {
      if (typeof e.data === 'string' && !this.callback) {
        try {
          // 获取用户信息成功
          const result = JSON.parse(e.data)
          const {
            line,
            relations: { teachers, students },
          } = result
          this.line = line
          this.teachers = teachers
          this.students = students
          this.callback = true
          // window.removeEventListener(
          //   'message',
          //   this.handleMessage.bind(this),
          //   false
          // )
        } catch (e) {
          console.log('error data: ', e.data)
        }
      }
      console.log(e)
    },
    //
    handleLogin(value) {
      this.value = value
      const [line_id, relation_id, type] = value.split('-')
      console.log(value)
      this.$store
        .dispatch('user/lineLogin', {
          line_id,
          relation_id,
          type,
        })
        .then(() => {
          this.$message({ message: '登录成功', type: 'success' })
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery,
          })
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.social-signup-container {
  margin: 10px 0;
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
