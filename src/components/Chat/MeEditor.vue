<template>
  <div>
    <el-container class="editor-container">
      <el-main
        class="no-padding textarea"
        style="border: 1px solid #f5eeee; margin-top: 10px"
      >
        <textarea
          ref="textarea"
          v-model.trim="editorText"
          rows="3"
          placeholder="按Enter发送 / Shift+Enter 换行 ..."
          @keydown="keydownEvent($event)"
          @input="inputEvent($event)"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'MeEditor',
  components: {},
  data() {
    return {
      // 当前编辑的内容
      editorText: '',

      // 上次发送消息的时间
      sendtime: 0,

      // 发送间隔时间（默认200 ms）
      interval: 200,
    }
  },
  methods: {
    inputEvent(e) {
      this.$emit('keyboard-event', e.target.value)
    },

    // 键盘按下监听事件
    keydownEvent(e) {
      if (e.keyCode == 13 && this.editorText == '') {
        e.preventDefault()
      }

      // 回车事件触发发送消息
      if (e.keyCode == 13 && e.shiftKey == false && this.editorText != '') {
        const currentTime = new Date().getTime()

        if (this.sendtime > 0) {
          // 判断 200 ms内只能发送一条消息
          if (currentTime - this.sendtime < this.interval) {
            e.preventDefault()
            return false
          }
        }

        this.$emit('send', this.editorText)
        this.editorText = ''
        this.sendtime = currentTime
        e.preventDefault()
      }
    },
  },
}
</script>
<style scoped>
.editor-container {
  height: 160px;
  width: 100%;
  background-color: white;
}

.editor-container .toolbar {
  line-height: 35px;
  border-bottom: 1px solid #f5f0f0;
  border-top: 1px solid #f5f0f0;
}

.editor-container .toolbar li {
  list-style: none;
  float: left;
  width: 35px;
  margin-left: 3px;
  cursor: pointer;
  text-align: center;
  line-height: 35px;
  position: relative;
  color: #8d8d8d;
}

.editor-container .toolbar li .tip-title {
  display: none;
  position: absolute;
  top: 38px;
  left: 0px;
  height: 26px;
  line-height: 26px;
  background-color: rgba(31, 35, 41, 0.9);
  color: white;
  min-width: 30px;
  font-size: 10px;
  padding: 0 5px;
  border-radius: 2px;
  white-space: pre;
  text-align: center;
  user-select: none;
  z-index: 1;
}

.editor-container .toolbar li:hover .tip-title {
  display: block;
}

.editor-container .toolbar li:hover {
  background-color: #f7f5f5;
}

.editor-container .toolbar .text-tips {
  float: right;
  margin-right: 15px;
  font-size: 12px;
  color: #ccc;
}

.editor-container .toolbar .text-tips i {
  font-size: 14px;
  cursor: pointer;
  margin-left: 5px;
  color: rgb(255, 181, 111);
}

.editor-container .textarea {
  overflow: hidden;
  position: relative;
}

textarea {
  width: calc(100% - 10px);
  width: -moz-calc(100% - 10px);
  width: -webkit-calc(100% - 10px);
  height: calc(100% - 10px);
  height: -moz-calc(100% - 10px);
  height: -webkit-calc(100% - 10px);
  border: 0 none;
  outline: none;
  resize: none;
  font-size: 15px;
  overflow-y: auto;
  color: #464545;
  padding: 5px;
  position: relative;
}

textarea::-webkit-scrollbar {
  width: 4px;
  height: 1px;
}

textarea::-webkit-scrollbar-thumb {
  background: #d5cfcf;
}

textarea::-webkit-scrollbar-track {
  background: #ededed;
}

textarea::-webkit-input-placeholder {
  color: #dccdcd;
  font-size: 12px;
  font-weight: 400;
}

/* 编辑器文档说明 --- start */
.editor-books .books-title {
  font-size: 16px;
  height: 30px;
  line-height: 22px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #cbcbcb;
  color: #726f6f;
  font-weight: 400;
  margin-left: 11px;
}

.editor-books p {
  text-indent: 10px;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  color: #7f7c7c;
}

/* 编辑器文档说明 --- end */
</style>
