<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="用户名|手机号"
        style="width: 200px;"
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
      >新增</el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>-->
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
      <el-table-column type="index" width="60" align="center" sortable="custom" />
      <el-table-column label="账号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" align="center" label="备注">
        <template slot-scope="{row}">
          <span>{{ row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button size="mini" icon="el-icon-refresh" @click="handleReset(row)">重置</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />

    <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="user"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色" prop="name">
          <el-select v-model="user.role_id" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" show-password />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="user.remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="add()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchAdd,
  fetchEdit,
  fetchDelete,
  fetchReset
} from '@/api/users'
import { fetchList as fetchRoles } from '@/api/roles'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  filters: {
    dateFormat(time) {
      return parseTime(time, '{y}-{m}-{d}')
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      roles: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        begin_date: undefined,
        end_date: undefined,
        search: undefined,
        status: undefined,
        order: '-id'
      },
      user: {},
      dialogLoading: false,
      downloadLoading: false,
      dialogFormVisible: false
    }
  },
  created() {
    this.getRoles()
    this.getList()
  },
  methods: {
    async getRoles() {
      const { data: roles } = await fetchRoles()
      this.roles = roles
    },
    async getList() {
      try {
        this.listLoading = true
        const { data: list } = await fetchList(this.listQuery)
        this.list = list
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    async add() {
      this.dialogLoading = true
      try {
        await fetchAdd(this.user)
        this.$message({ message: '成功', type: 'success' })
        this.dialogLoading = false
        await this.getList()
        this.dialogFormVisible = false
      } catch (e) {
        this.dialogFormVisible = false
      }
    },
    async edit() {
      try {
        await fetchEdit(this.user)
        this.$message({ message: '成功', type: 'success' })
        this.dialogFormVisible = false
      } catch (e) {
        this.dialogFormVisible = false
      }
    },
    handleAdd() {
      this.user = {}
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      this.user = row
      this.dialogFormVisible = true
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset(row) {
      this.$confirm('你确定要重置员工密码为123456吗？')
        .then(_ => {
          try {
            (async() => {
              await fetchReset(row.id)
              this.$message({ message: '重置成功', type: 'success' })
            })()
          } catch (e) {
            this.$message({ message: '重置成功', type: 'error' })
          }
        })
        .catch(_ => {})
    },
    handleDelete(row) {
      this.$confirm(`此操作不可恢复，确认要删除【${row.name}】员工吗？`)
        .then(_ => {
          try {
            (async() => {
              await fetchDelete(row.id)
              this.$message({ message: '删除成功', type: 'success' })
              await this.getList()
            })()
          } catch (e) {
            this.$message({ message: '删除失败', type: 'error' })
          }
        })
        .catch(_ => {})
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.order = '-id'
      } else {
        this.listQuery.order = '-id'
      }
      this.handleFilter()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
