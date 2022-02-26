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
      <el-table-column width="100" label="关注" align="center">
        <template slot-scope="{ row }">
          <el-button type="text" @click="changeLike(row)">
            <i v-if="row.isLike === 1" class="el-icon-star-on star" />
            <i v-else class="el-icon-star-off star" />
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="100" label="姓名" align="center">
        <template slot-scope="{ row }">
          <el-button type="text" @click="openChat(row)">
            {{ row.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="100" label="邮箱" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="在线状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.online == 1 ? '在线' : '离线' }}</span>
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

<style scoped>
.star {
  font-size: 20px;
}
</style>

<script>
import { like, unlike, getTeacherList } from '@/api/student'
import waves from '@/directive/waves' // waves directive
import drag from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Chat from '@/components/Chat'

export default {
  name: 'ApplySchoolList',
  components: { Pagination, Chat },
  directives: { waves, drag },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger',
        3: 'primary',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      chatVisible: false,
      chatParams: {
        nickname: '', // 接收者名称
        type: 'teacher', // 接收类型
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
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.listLoading = true
        const {
          data: { meta, list },
        } = await getTeacherList(this.listQuery)
        this.list = list
        this.total = meta.total
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    openChat(row) {
      this.chatVisible = true
      this.chatParams = {
        nickname: row.name, // 接收者名称
        type: 'teacher', // 接收类型
        receiver_id: row.id, // 接收人id
      }
    },
    async changeLike(row) {
      try {
        this.listLoading = true
        if (row.isLike === 1) {
          // 取消关注
          await unlike({ teacher_id: row.id })
          this.$message({ message: '取消关注成功', type: 'success' })
        } else {
          // 关注
          await like({ teacher_id: row.id })
          this.$message({ message: '关注成功', type: 'success' })
        }
        await this.getList()
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
