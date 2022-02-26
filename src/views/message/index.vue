<template>
  <div class="app-container">
    <el-button type="primary" @click="visible = true">打开</el-button>
    <Chat
      :params="params"
      :dialog-visible="visible"
      @closeDialog="visible = false"
    />
  </div>
</template>
<script>
import Chat from '@/components/Chat'
export default {
  name: 'MessageDemo',
  components: {
    Chat,
  },
  data() {
    return {
      params: {
        nickname: '赵云(教师)', // 接收者名称
        type: 'teacher', // 接收类型
        receiver_id: 8, // 接收人id
      },
      visible: false,
    }
  },
  methods: {},
}
</script>
