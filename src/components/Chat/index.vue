<template>
  <div class="app-container">
    <el-dialog
      v-drag
      custom-class="my-dialog"
      top="5vh"
      :visible="dialogVisible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
    >
      <div id="panel-header" slot="title">
        <div class="module left-module">
          <span class="nickname">{{ params.nickname }}</span>
        </div>

        <div class="module center-module">
          <p class="online">
            <span v-show="isOnline" class="online-status" />
            <span>{{ isOnline ? '在线' : '离线' }}</span>
          </p>
          <p v-show="isKeyboard" class="keyboard-status">对方正在输入 ...</p>
        </div>
        <div class="module right-module">
          <el-tooltip content="关闭" placement="top">
            <p>
              <i class="el-icon-close" @click="close()" />
            </p>
          </el-tooltip>
        </div>
      </div>
      <!-- 消息体 -->
      <TalkPanel class="full-height" :params="params" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TalkPanel from '@/components/Chat/TalkPanel'
import drag from '@/directive/el-drag-dialog'
export default {
  name: 'Chat',
  components: {
    TalkPanel,
  },
  directives: {
    drag,
  },
  props: {
    // 对话相关参数
    params: {
      type: Object,
      default() {
        return {
          receiver_id: 0, // 消息接收者ID
          type: 'teacher', // 接收者类型
          nickname: '未知', // 接收者名称
        }
      },
    },
    isKeyboard: {
      type: Boolean,
      default: false, // TODO 输入中
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOnline: false,
    }
  },
  sockets: {
    // 心跳
    online(users) {
      const find = users.find(
        (item) =>
          item.type === this.params.type && item.receiver_id === this.params.id
      )
      this.isOnline = !!find
    },
  },
  methods: {
    close() {
      const actionType =
        this.params.type === 'teacher'
          ? 'chat/deleteTeacherId'
          : 'chat/deleteStudentId'
      this.$store.dispatch(actionType, this.params.receiver_id) // 去除
      this.$emit('closeDialog')
    },
  },
}
</script>
<style>
.my-dialog .el-dialog__body {
  padding-bottom: 5px !important;
}
</style>
<style lang="scss" scoped>
#panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-bottom: 1px solid #f5eeee;

  .module {
    width: 100%/3;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .left-module {
    padding-right: 5px;

    .icon-badge {
      background: rgb(81 139 254);
      height: 18px;
      line-height: 18px;
      padding: 1px 3px;
      font-size: 10px;
      color: white;
      border-radius: 3px;
      margin-right: 8px;
      flex-shrink: 0;

      &.red-color {
        background: #f97348;
      }
    }

    .nickname {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .center-module {
    flex-direction: column;
    justify-content: center;

    .online {
      color: #cccccc;
      font-weight: 300;
      font-size: 15px;

      &.color {
        color: #1890ff;
      }

      .online-status {
        position: relative;
        top: -1px;
        display: inline-block;
        width: 6px;
        height: 6px;
        vertical-align: middle;
        border-radius: 50%;
        position: relative;
        background-color: #1890ff;
        margin-right: 5px;

        &:after {
          position: absolute;
          top: -1px;
          left: -1px;
          width: 100%;
          height: 100%;
          border: 1px solid #1890ff;
          border-radius: 50%;
          -webkit-animation: antStatusProcessing 1.2s ease-in-out infinite;
          animation: antStatusProcessing 1.2s ease-in-out infinite;
          content: '';
        }
      }
    }

    .keyboard-status {
      height: 20px;
      line-height: 18px;
      font-size: 10px;
      animation: inputfade 600ms infinite;
      -webkit-animation: inputfade 600ms infinite;
    }
  }

  .right-module {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    p {
      cursor: pointer;
      margin: 0 8px;
      font-size: 20px;
      color: #828f95;
      &:active i {
        font-size: 26px;
        transform: scale(1.3);
        transition: ease 0.5s;
        color: red;
      }
    }
  }
}

/* css 动画 */
@keyframes inputfade {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes inputfade {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes antStatusProcessing {
  0% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    opacity: 0;
  }
}

@keyframes antStatusProcessing {
  0% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    opacity: 0;
  }
}
</style>

