<template>
  <div>
    <el-container class="ov-hidden full-height">
      <!-- 主体信息 -->
      <el-main class="main-box no-padding" style="height: 310px">
        <div
          id="chatPanel"
          class="talks-container scrollbar"
          @scroll="talkPanelScroll($event)"
        >
          <!-- 数据加载状态栏 -->
          <div class="loading-toolbar">
            <span v-if="loadRecord.status == 0" class="color-blue">
              <i class="el-icon-loading" /> 正在加载数据中...
            </span>
            <span
              v-else-if="loadRecord.status == 1"
              class="pointer color-blue"
              @click="loadChatRecords"
            >
              <i class="el-icon-bottom" /> 查看更多消息...
            </span>
            <span v-else> 没有更多消息了... </span>
          </div>

          <!-- 消息主体 -->
          <div v-for="item in records" :key="item.id">
            <!-- 对话消息 -->
            <div
              class="message-box record-box"
              :class="{
                'direction-rt': item.float === 'right',
              }"
            >
              <main class="main-column">
                <div class="talk-content">
                  <span class="nickname">
                    {{ item.float === 'left' ? params.nickname : name }} |
                    {{ item.created_at }}
                  </span>

                  <!-- 文本消息 -->
                  <TextMessage
                    :content="item.content"
                    :float="item.float"
                    :full-width="false"
                    :arrow="true"
                  />
                </div>
              </main>
            </div>
          </div>
        </div>

        <!-- 置底按钮 -->
        <transition name="el-fade-in-linear">
          <div
            v-show="tipsBoard"
            class="tips-board pointer"
            @click="talkPanelScrollBottom"
          >
            <span><i class="el-icon-bottom" />回到底部</span>
          </div>
        </transition>
      </el-main>

      <!-- 输入部分 -->
      <el-footer class="footer-box" height="160">
        <MeEditor @send="submitSendMessage" @keyboard-event="onKeyboardEvent" />
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TextMessage from '@/components/Chat/TextMessage'
import MeEditor from '@/components/Chat/MeEditor'
import { getChatHistory } from '@/api/user'

export default {
  name: 'TalkEditorPanel',
  components: {
    MeEditor,
    TextMessage,
  },
  props: {
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
  },
  data() {
    return {
      // 记录加载相关参数
      loadRecord: {
        status: 0,
      },
      recordQuery: {
        last_id: 0,
        limit: 20,
      },
      records: [], // 聊天记录

      // 键盘输入事件
      keyboardEvent: {
        time: 0,
      },

      // 置底按钮是否显示
      tipsBoard: false,
    }
  },
  computed: {
    ...mapGetters(['name']), // 发起人名称
  },
  watch: {
    // 监听面板传递参数
    params() {
      this.init()
      this.chatStore()
      this.loadChatRecords()
    },
  },
  mounted() {
    this.chatStore() // 添加当前聊天人
    this.init()
    this.loadChatRecords()
  },
  sockets: {
    // 接收聊天
    chat(result) {
      if (result) {
        const { code, data, message = '' } = result
        if (code === 200) {
          if (this.params.type === 'teacher') {
            // 发起人是学生
            data.float = data.direction === 1 ? 'left' : 'right'
          } else if (this.params.type === 'student') {
            // 发起人是教师
            data.float = data.direction === 1 ? 'right' : 'left'
          }
          this.records.push(data)
          this.talkPanelScrollBottom()
        } else {
          this.$message({ message, type: 'error' })
        }
      }
    },
  },
  methods: {
    chatStore() {
      const actionType =
        this.params.type === 'teacher'
          ? 'chat/addTeacherId'
          : 'chat/addStudentId'
      this.$store.dispatch(actionType, this.params.receiver_id) // 添加
    },
    init() {
      this.records = []
      this.loadRecord = {
        status: 0,
      }
      this.recordQuery = {
        last_id: 0,
        limit: 20,
      }
    },
    // 回车键发送消息回调事件
    submitSendMessage(content) {
      if (content && content.length > 0) {
        this.$socket.emit('chat', {
          id: this.params.receiver_id,
          type: this.params.type,
          content,
        })
      }
    },

    // input 触发事件
    onKeyboardEvent(text) {
      const time = new Date().getTime()
      this.keyboardEvent.time = time
    },

    // 加载用户聊天详情信息
    async loadChatRecords() {
      this.loadRecord.status = 0

      const el = document.getElementById('chatPanel')
      const scrollHeight = el.scrollHeight

      try {
        const type = this.params.type === 'teacher' ? 'student' : 'teacher' // 发起者
        const { data } = await getChatHistory(type, {
          receiver_id: this.params.receiver_id,
          ...this.recordQuery,
        })
        const records = data
          .map((item) => {
            // 发起人永远在右侧
            item.float = 'center'
            // direction [1:教师to学生,2:学生to教师]
            if (this.params.type === 'teacher') {
              // 发起人是学生
              item.float = item.direction === 1 ? 'left' : 'right'
            } else if (this.params.type === 'student') {
              // 发起人是教师
              item.float = item.direction === 1 ? 'right' : 'left'
            }
            return item
          })
          .reverse() // 倒序排列，翻转一下

        this.loadRecord.status =
          records.length >= this.recordQuery.limit ? 1 : 2
        this.recordQuery.last_id = records.length > 0 ? records[0].id : 0
        this.records = [...records, ...this.records]
        this.$nextTick(() => {
          if (this.recordQuery.last_id === 0) {
            el.scrollTop = el.scrollHeight
          } else {
            el.scrollTop = el.scrollHeight - scrollHeight
          }
        })
      } catch (e) {
        this.loadRecord.status = 1
      }
    },

    // 对话面板滚动事件
    talkPanelScroll(e) {
      if (e.target.scrollTop == 0 && this.loadRecord.status == 1) {
        this.loadChatRecords()
        return
      }

      const height = e.target.scrollTop + e.target.clientHeight + 5
      this.tipsBoard = height < e.target.scrollHeight
    },

    // 聊天版本滚动到底部
    talkPanelScrollBottom() {
      this.$nextTick(() => {
        const el = document.getElementById('chatPanel')
        el.scrollTop = el.scrollHeight
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.main-box {
  position: relative;
}

.scrollbar::-webkit-scrollbar {
  width: 3px;
  background-color: #e4e4e5;
}

/* 面板页脚 */
.footer-box {
  height: 160px !important;
  padding: 0;
  border-top: 1px solid #f5f5f5;
}

/* 侧边栏css */
.sidebar-box {
  position: absolute;
  width: 350px;
  height: 100%;
  top: 0px;
  right: -350px;
  z-index: 1;
  background: white;
  transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -webkit-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;

  &.show {
    right: 0;
    box-shadow: 0 0 14px #e2e1e1;
  }
}

.tips-board {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 20px;
  height: 30px;
  width: 100px;
  border-radius: 20px;
  font-size: 12px;
  background-color: #fff;
  box-shadow: 0 2.5px 10px 0 rgba(31, 35, 41, 0.1);
  color: #1f2329;

  span {
    margin-left: 5px;
    margin-top: -2px;
  }

  .svg {
    width: 10px;
    height: 10px;
    color: black;
  }
}

.talk-bubble {
  position: absolute;
  left: 0px;
  bottom: 20px;
  max-width: 300px;
  height: 40px;
  line-height: 40px;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
  padding: 0 15px 0 30px;
  font-size: 13px;
  background: #409eff;

  i {
    font-size: 22px;
    position: absolute;
    left: 5px;
    top: 9px;
  }
}

.talks-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px 30px;
  overflow-y: auto;

  .message-box {
    width: 100%;
    min-height: 30px;
    margin-bottom: 5px;
  }

  .loading-toolbar {
    height: 30px;
    line-height: 30px;
    margin: 5px 0;
    text-align: center;
    user-select: none;
    font-size: 13px;
    color: #cec4c4;

    .color-blue {
      color: #409eff;
    }
  }

  .datetime {
    height: 30px;
    line-height: 30px;
    color: #ccc9c9;
    font-size: 12px;
    text-align: center;
    margin: 5px 0;
  }

  .record-box {
    display: flex;
    flex-direction: row;
    transition: 0.5s ease;

    .checkbox-column {
      display: flex;
      justify-content: center;
      flex-basis: 40px;
      flex-shrink: 0;
      order: 1;
      user-select: none;
      padding-top: 25px;

      i {
        color: #ccc;
        cursor: pointer;
        font-size: 22px;
        &.selected {
          color: #409eff !important;
        }
      }
    }

    .avatar-column {
      width: 40px;
      flex-basis: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      order: 2;
      user-select: none;
      padding-top: 22px;
      flex-direction: column;
    }

    .main-column {
      flex: 1 auto;
      order: 3;
      position: relative;
      box-sizing: border-box;
      padding: 5px;
      overflow: hidden;

      .talk-title {
        display: flex;
        align-items: center;
        height: 15px;
        margin-bottom: 2px;
        font-size: 10px;
        user-select: none;
        color: #a7a0a0;
        opacity: 0;
        transition: 0.5s ease;

        &.show {
          opacity: 1 !important;
        }

        span {
          transform: scale(0.9);
        }
      }

      .talk-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        box-sizing: border-box;
        width: 100%;

        .nickname {
          font-size: 12px;
          color: #a7a0a0;
          margin: -4px 0 4px -8px;
          transform: scale(0.9);
        }
      }

      &:hover {
        .talk-title {
          opacity: 1;
        }
      }
    }

    &.direction-rt {
      .avatar-column {
        order: 3;
      }

      .main-column {
        order: 2;

        .talk-title {
          justify-content: flex-end;
        }

        .talk-content {
          align-items: flex-end;
        }
      }
    }

    &.checkbox-border {
      border: 1px dashed #c4c4ec;
      &:hover {
        border-color: #409eff;
      }
    }
  }
}
</style>
