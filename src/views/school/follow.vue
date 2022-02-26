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
      >搜索</el-button>
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
      <el-table-column min-width="100" label="姓名" align="center">
        <template slot-scope="{ row }">
          <el-button type="text" @click="openChat(row)">
            {{ row.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="100" label="学校" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.school_name }}</span>
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
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <Chat
      :params="chatParams"
      :dialog-visible="chatVisible"
      @closeDialog="chatVisible = false"
    />
  </div>
</template>

<script>
import { getFollowStudentList } from '@/api/teacher'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Chat from '@/components/Chat'

export default {
  name: 'ApplySchoolList',
  components: { Pagination, Chat },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger',
        3: 'primary',
      }
      return statusMap[status]
    },
    dateFormat(time) {
      return time === 0 ? '-' : parseTime(time, '{y}-{m}-{d}')
    },
  },
  data() {
    return {
      chatVisible: false,
      chatParams: {
        nickname: '', // 接收者名称
        type: 'student', // 接收类型
        receiver_id: 0, // 接收人id
      },

      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search: undefined,
        sort: '-id',
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
    async getList() {
      try {
        this.listLoading = true
        const {
          data: { meta, list },
        } = await getFollowStudentList(this.listQuery)
        this.list = list
        this.total = meta.total
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
