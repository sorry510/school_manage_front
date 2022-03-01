<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="字体大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <span class="right-menu-item hover-effect" style="font-size: 14px">{{
          name
        }}</span>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/repassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </router-link> -->
          <!-- <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <Chat
      :params="chatParams"
      :dialog-visible="chatVisible"
      @closeDialog="chatVisible = false"
    />

    <!-- 管理员推送的消息 -->
    <el-dialog title="消息" :visible.sync="dialogVisible" width="40%">
      <span>{{ adminMessage.content }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Chat from '@/components/Chat'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    Chat,
  },
  data() {
    return {
      chatVisible: false,
      chatParams: {
        nickname: '', // 接收者名称
        type: '', // 接收类型
        receiver_id: 0, // 接收人id
      },
      dialogVisible: false,
      adminMessage: {
        id: 0,
        content: '',
      },
    }
  },
  sockets: {
    // 连接时登录
    connect() {
      const data = { type: this.tokenType, id: this.id }
      this.$socket.emit('login', data) // 登录
      console.log('socket connected', data)
    },
    // 心跳
    heart(data) {
      // 接受到ping时
      this.$socket.emit('heart', {
        pong: new Date().getTime(),
      })
      // console.log(data)
    },
    // 接收聊天
    chat(result) {
      if (result) {
        const { code, data } = result
        if (code === 200) {
          if (this.tokenType === 'teacher' && data.direction === 2) {
            // 当前用户教师,发起人是学生
            if (!this.chatStudentIds.has(data.student_id)) {
              const notify = this.$notify({
                title: '新消息',
                message: `${data.student_name}的消息`,
                position: 'bottom-right',
                duration: 1000 * 30,
                onClick: () => {
                  this.openChat({
                    nickname: data.student_name, // 接收者名称
                    type: 'student', // 接收类型
                    receiver_id: data.student_id, // 接收人id
                  })
                  notify.close()
                },
              })
            }
          } else if (this.tokenType === 'student' && data.direction === 1) {
            // 当前用户学生,发起人是教师
            if (!this.chatTeacherIds.has(data.teacher_id)) {
              const notify = this.$notify({
                title: '聊天消息',
                message: `${data.teacher_name}的消息`,
                position: 'bottom-right',
                duration: 1000 * 60 * 5,
                onClick: () => {
                  this.openChat({
                    nickname: data.teacher_name, // 接收者名称
                    type: 'teacher', // 接收类型
                    receiver_id: data.teacher_id, // 接收人id
                  })
                  notify.close()
                },
              })
            }
          }
        }
      }
    },
    message(result) {
      if (result && result.content) {
        const notify = this.$notify({
          title: '通知',
          message:
            result.content.substr(0, 15) +
            (result.content.length > 15 ? '...' : ''),
          position: 'bottom-right',
          duration: 1000 * 60 * 5,
          onClick: () => {
            this.dialogVisible = true
            this.adminMessage = result
            notify.close()
          },
        })
      }
    },
  },
  computed: {
    ...mapGetters([
      'id',
      'tokenType',
      'name',
      'sidebar',
      'avatar',
      'device',
      'chatStudentIds',
      'chatTeacherIds',
    ]),
  },
  created() {
    // this.$notify({
    //   title: '新消息',
    //   message: '赵云的消息',
    //   position: 'bottom-right',
    //   onClick: () => {
    //     this.openChat({
    //       nickname: '赵云', // 接收者名称
    //       type: 'teacher', // 接收类型
    //       receiver_id: 8, // 接收人id
    //     })
    //   },
    // })
    this.$socket.connect() // 开启socket
  },
  methods: {
    openChat(params) {
      this.chatVisible = true
      this.chatParams = params
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
