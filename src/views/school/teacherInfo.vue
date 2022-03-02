<template>
  <div class="app-container">
    <span v-if="info.hasBindLine">line：已绑定</span>
    <el-button v-else type="text" @click="bindLine()">绑定line</el-button>
    <el-divider />
    <span>邮箱：{{ info.email }}</span>
    <el-divider />
    <span>姓名：{{ info.name }}</span>
    <el-divider />
    <span>创建时间：{{ info.created_at }}</span>
  </div>
</template>

<script>
import { getInfo } from '@/api/user'
import { bingLine } from '@/api/user'
import openWindow from '@/utils/open-window'

export default {
  name: 'TeacherInfo',
  data() {
    return {
      info: {
        hasBindLine: false,
        email: '',
        name: '',
        created_at: '',
      },
      callback: false,
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    bindLine() {
      openWindow(`${process.env.VUE_APP_BASE_API}/login/line`, 'line', 540, 540)
      // 通过监听，父页面可以拿到子页面传递的token，父(前端页面)，子(小窗)
      window.addEventListener('message', this.handleBind.bind(this), false)
    },
    async handleBind(e) {
      if (typeof e.data === 'string' && !this.callback) {
        try {
          // 获取用户信息成功
          console.log('result', e.data)
          const result = JSON.parse(e.data)
          const { line } = result
          this.line = line
          this.callback = true
          try {
            await bingLine('teacher', { line_id: line.id })
            this.info.hasBindLine = true
            this.$message({ message: '绑定成功', type: 'success' })
          } catch (e) {
            // this.$message({ message: '绑定失败', type: 'error' })
          }
          window.removeEventListener(
            'message',
            this.handleBind.bind(this),
            false
          )
        } catch (e) {
          console.log('error data: ', e.data)
        }
      }
      console.log(e)
    },
    async getInfo() {
      const { data } = await getInfo('teacher')
      this.info = data
    },
  },
}
</script>
