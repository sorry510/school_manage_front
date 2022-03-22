<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="名称"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        :loading="listLoading"
        @click="handleFilter"
        >搜索</el-button
      >
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column
        type="index"
        prop="id"
        width="40"
        align="center"
        sortable="custom"
      />
      <el-table-column min-width="120" label="名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="备注" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" label="教师" type="expand">
        <template slot-scope="{ row }">
          <el-table :data="row.teachers" border fit highlight-current-row>
            <el-table-column label="姓名" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="邮箱" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.type }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            icon="el-icon-document"
            type="primary"
            style="margin-right: 5px"
            @click="handleOpenDrawer(row)"
            >学生信息</el-button
          >
          <el-dropdown v-if="row.isAdmin === 1" trigger="click">
            <el-button size="mini">
              <i class="el-icon-more" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="handleOpenStudentDialog(row)">
                  <i class="el-icon-plus" />添加学生
                </span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="handleInvite(row)">
                  <i class="el-icon-s-promotion" />邀请教师
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      @closed="handleCloseForm"
    >
      <el-form
        ref="dataForm"
        :model="info"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin-left: 50px"
      >
        <el-form-item label="教师" prop="teacher_id">
          <el-select v-model="info.teacher_id" placeholder="请选择">
            <el-option
              v-for="item in invitationList"
              :key="item.id"
              :label="`${item.name}-${item.email}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="invite()">
          确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="发送通知" :visible.sync="dialogMessageVisible">
      <el-form
        ref="dataMessage"
        :model="messageInfo"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin-left: 50px"
      >
        <el-form-item label="内容">
          <el-input v-model="messageInfo.content" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMessageVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="sendMessage()"
        >
          确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="添加学生" :visible.sync="dialogStudentVisible">
      <el-form
        ref="dataStudent"
        :model="studentInfo"
        :rules="studentRules"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin-left: 50px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="studentInfo.name" />
        </el-form-item>
        <el-form-item label="用户名" prop="account">
          <el-input v-model="studentInfo.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="studentInfo.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStudentVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="studentFormLoading"
          @click="addStudentSubmit()"
        >
          确定</el-button
        >
      </div>
    </el-dialog>

    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="50%"
    >
      <div style="width: 96%; margin: 0 auto">
        <div class="filter-container">
          <el-input
            v-model="studentListQuery.search"
            placeholder="名称"
            style="width: 200px; margin-right: 10px"
            class="filter-item"
            @keyup.enter.native="handleStudentFilter"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            :loading="studentListLoading"
            @click="handleStudentFilter"
            >搜索</el-button
          >
          <el-button
            v-waves
            :disabled="messageInfo.student_ids.length === 0"
            class="filter-item"
            icon="el-icon-s-promotion"
            @click="handleSendMessage"
            >发送通知</el-button
          >
        </div>
        <el-table
          v-loading="studentListLoading"
          :data="studentList"
          border
          fit
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            type="index"
            prop="id"
            width="40"
            align="center"
            sortable="custom"
          />
          <el-table-column min-width="100" label="姓名" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" @click="openChat(row)">
                {{ row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column width="100" label="在线状态" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.online == 1 ? '在线' : '离线' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.created_at }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="studentTotal > 0"
          :total="studentTotal"
          :page.sync="studentListQuery.page"
          :limit.sync="studentListQuery.limit"
          @pagination="getStudentList"
        />
      </div>
    </el-drawer>
    <Chat
      :params="chatParams"
      :dialog-visible="chatVisible"
      @closeDialog="chatVisible = false"
    />
  </div>
</template>

<script>
import {
  getSchoolList,
  getTeacherInvitationList,
  invitationTeacher,
  getStudentList,
  addStudent,
  sendMessage,
} from '@/api/teacher'
import waves from '@/directive/waves' // waves directive
import drag from '@/directive/el-drag-dialog'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Chat from '@/components/Chat'

export default {
  name: 'Schoollist',
  components: { Pagination, Chat },
  directives: { waves, drag },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'warning',
        2: 'success',
      }
      return statusMap[status]
    },
    dateFormat(time) {
      return time === 0 ? '-' : parseTime(time, '{y}-{m}-{d}')
    },
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    const validateAccount = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户名'))
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
    return {
      chatVisible: false,
      chatParams: {
        nickname: '', // 接收者名称
        type: 'student', // 接收类型
        receiver_id: 0, // 接收人id
      },

      dialogMessageVisible: false,
      messageInfo: {
        student_ids: [],
        content: '',
      },
      schoolStudents: [],

      visible: false,
      drawerVisible: false,
      dialogStudentVisible: false,
      studentListLoading: false,
      studentFormLoading: false,
      studentListQuery: {
        school_id: undefined,
        page: 1,
        limit: 10,
      },
      tableKey: 0,
      list: [],
      invitationList: [],
      total: 0,
      studentList: [],
      studentTotal: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search: undefined,
        sort: '-id',
      },
      dialogTitle: '邀请教师',
      drawerTitle: '学生信息',
      info: {},
      studentInfo: {
        name: '',
        account: '',
        password: '',
        school_id: null,
      },
      downloadLoading: false,
      dialogLoading: false,
      dialogFormVisible: false,
      studentRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateUsername },
        ],
        account: [
          { required: true, trigger: 'blur', validator: validateAccount },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    openChat(row) {
      this.chatVisible = true
      this.chatParams = {
        nickname: row.name, // 接收者名称
        type: 'student', // 接收类型
        receiver_id: row.id, // 接收人id
      }
    },
    reset() {
      this.listQuery = this.$options.data().listQuery
      this.info = {}
    },
    async getList() {
      try {
        this.listLoading = true
        const {
          data: { meta, list },
        } = await getSchoolList(this.listQuery)
        this.list = list
        this.total = meta.total
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    async getStudentList() {
      try {
        this.studentListLoading = true
        const {
          data: { meta, list },
        } = await getStudentList(this.studentListQuery)
        this.studentList = list
        this.studentTotal = meta.total
        this.studentListLoading = false
      } catch (e) {
        this.studentListLoading = false
      }
    },
    handleSendMessage() {
      this.messageInfo.content = ''
      this.dialogMessageVisible = true
    },
    async sendMessage() {
      if (this.messageInfo.content === '') {
        return
      }
      try {
        this.dialogLoading = true
        await sendMessage({
          student_ids: this.messageInfo.student_ids.map((item) => item.id),
          content: this.messageInfo.content,
        })
        this.$message({ message: '已发送通知', type: 'success' })
        this.dialogLoading = false
      } catch (e) {
        this.dialogLoading = false
      }
    },
    handleSelectionChange(val) {
      this.messageInfo.student_ids = val
    },
    async getInvitationList(school_id) {
      const { data } = await getTeacherInvitationList({ school_id })
      this.invitationList = data
    },
    handleInvite(row) {
      this.info.school_id = row.id
      this.getInvitationList(row.id)
      this.dialogTitle = '邀请教师'
      this.dialogFormVisible = true
    },
    async invite() {
      try {
        this.dialogLoading = true
        await invitationTeacher(this.info)
        this.$message({ message: '已发送邀请邮件', type: 'success' })
        this.dialogLoading = false
      } catch (e) {
        this.dialogLoading = false
      }
    },
    addStudentSubmit() {
      this.$refs.dataStudent.validate(async (valid) => {
        if (valid) {
          try {
            this.studentFormLoading = true
            await addStudent(this.studentInfo)
            this.$message({ message: '添加成功', type: 'success' })
            this.studentFormLoading = false
            this.dialogStudentVisible = false
          } catch (e) {
            this.studentFormLoading = false
          }
        } else {
          this.studentFormLoading = false
          return false
        }
      })
    },
    handleOpenStudentDialog(row) {
      // 添加学生
      this.studentInfo = {
        name: '',
        account: '',
        password: '',
        school_id: row.id,
      }
      this.dialogStudentVisible = true
    },
    handleOpenDrawer(row) {
      // 学生列表
      this.drawerTitle = `${row.name}-学生信息`
      this.studentListQuery.school_id = row.id
      this.drawerVisible = true
      this.getStudentList()
    },
    handleCloseForm() {
      this.reset()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleStudentFilter() {
      this.studentListQuery.page = 1
      this.getStudentList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop) {
        this.sort(prop, order)
      }
    },
    sort(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
  },
}
</script>
