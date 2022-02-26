<template>
  <div class="container">
    <el-container>
      <el-form
        ref="dataForm"
        :model="user"
        :rules="registerRules"
        label-position="left"
        label-width="130px"
        style="width: 450px"
      >
        <el-header
          style="text-align: center; font-size: 40px; margin-top: 30px"
        >教师注册</el-header>
        <el-main>
          <el-form-item label="用户名" prop="name">
            <el-input v-model="user.name" type="text" />
          </el-form-item>
          <el-form-item label="邮箱(登录使用)" prop="email">
            <el-input v-model="user.email" type="text" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="user.password" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input v-model="user.password2" type="password" /> </el-form-item></el-main>
        <el-footer style="text-align: center">
          <el-button :loading="loading" type="primary" @click="submit()">
            确定
          </el-button>
        </el-footer>
      </el-form>
    </el-container>
  </div>
</template>

<style scoped>
.container {
  min-height: 100%;
  margin-top: 30px;
  width: 600px;
  margin: 0 auto;
}
</style>
<script>
import { register } from '@/api/user'
import { validEmail } from '@/utils/validate'

export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的email'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码长度不能小于3'))
      } else {
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value !== this.user.password) {
        callback(new Error('2次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      user: {
        name: '',
        email: '',
        password: '',
        password2: '',
      },
      loading: false,
      registerRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateUsername },
        ],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
        password2: [
          { required: true, trigger: 'blur', validator: validatePassword2 },
        ],
      },
    }
  },
  methods: {
    reset() {
      this.user = {
        name: '',
        email: '',
        password: '',
        password2: '',
      }
    },
    submit() {
      this.$refs.dataForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          try {
            await register(this.user)
            this.$message({ message: '注册成功', type: 'success' })
            this.loading = false
            setTimeout(() => this.$router.push('/login'), 1000)
          } catch (e) {
            this.loading = false
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>
