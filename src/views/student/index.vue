<template>
  <div class="app-container">
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

export default {
  name: 'StudentSchool',
  data() {
    return {
      info: {
        account: '',
        name: '',
        created_at: '',
        school: '',
        school_remark: '无',
      },
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const { data } = await getStudentInfo(this.listQuery)
      this.info = data
    },
  },
}
</script>
