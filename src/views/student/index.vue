<template>
  <div class="app-container">
    <span v-if="info.hasBindLine">line：已绑定</span>
    <el-button v-else type="text" @click="bindLine()">绑定line</el-button>
    <el-divider />
    <span>用户名：{{ info.account }}</span>
    <el-divider />
    <span>姓名：{{ info.name }}</span>
    <el-divider />
    <span>创建时间：{{ info.created_at }}</span>
    <el-divider />
    <span>学校：{{ info.school }}</span>
    <el-divider />
    <span>描述：{{ info.school_remark }}</span>
  </div>
</template>

<script>
import { getStudentInfo } from '@/api/student'
import { bingLine } from '@/api/user'
import openWindow from '@/utils/open-window'

export default {
  name: 'StudentSchool',
  data() {
    return {
      info: {
        hasBindLine: true,
        account: '',
        name: '',
        created_at: '',
        school: '',
        school_remark: '无',
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
            await bingLine('student', { line_id: line.id })
            this.info.hasBindLine = true
            this.$message({ message: '绑定成功', type: 'success' })
          } catch (e) {
            this.$message({ message: '绑定失败', type: 'error' })
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
      const { data } = await getStudentInfo()
      this.info = data
    },
  },
}
</script>
