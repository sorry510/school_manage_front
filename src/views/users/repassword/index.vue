<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="user"
      label-position="left"
      label-width="70px"
      style="width: 400px"
    >
      <el-form-item label="旧密码" prop="name">
        <el-input v-model="user.old_password" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="remarks">
        <el-input v-model="user.new_password" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="remarks">
        <el-input v-model="user.new_password2" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="reset()"> 取消 </el-button>
      <el-button :loading="loading" type="primary" @click="submit()">
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
// import { repassword } from '@/api/admin'

export default {
  name: 'Repassword',
  data() {
    return {
      user: {},
      loading: false,
    }
  },
  methods: {
    reset() {
      this.user = {}
    },
    async submit() {
      this.loading = true
      try {
        // await repassword(this.user)
        this.$message({ message: '成功', type: 'success' })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
  },
}
</script>
