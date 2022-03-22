<template>
  <div class="app-container">
    <el-tabs v-model="tabName">
      <el-tab-pane label="管理员通知" name="admin">
        <AdminTable />
      </el-tab-pane>
      <el-tab-pane
        v-if="tokenType === 'student'"
        label="教师通知"
        name="teacher"
        ><TeacherTable
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AdminTable from './AdminTable'
import TeacherTable from './TeacherTable'
import { mapGetters } from 'vuex'

export default {
  name: 'MessageDashboard',
  components: { AdminTable, TeacherTable },
  data() {
    return {
      tabName: 'admin',
    }
  },
  computed: {
    ...mapGetters(['tokenType']),
  },
}
</script>
