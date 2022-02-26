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
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
      >发起申请</el-button>
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
      <el-table-column
        type="index"
        prop="id"
        width="40"
        align="center"
        sortable="custom"
      />
      <el-table-column min-width="120" label="申请名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="申请状态" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            <span>{{ applyType[row.status] || '未知' }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.created_at }}</span>
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
            v-if="row.status === 3"
            size="mini"
            icon="el-icon-document"
            type="primary"
            @click="deleteApply(row)"
          >删除</el-button>
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
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="info.name" />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="info.remarks"
            :autosize="{ minRows: 4, maxRows: 10 }"
            type="textarea"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="addApply()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getApplySchoolList,
  applySchool,
  deleteApplySchool,
} from '@/api/teacher'
import waves from '@/directive/waves' // waves directive
import drag from '@/directive/el-drag-dialog'
import { parseTime } from '@/utils'
import { applyType } from '@/utils/dataType'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ApplySchoolList',
  components: { Pagination },
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
    dateFormat(time) {
      return time === 0 ? '-' : parseTime(time, '{y}-{m}-{d}')
    },
  },
  data() {
    return {
      visible: false,
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
      dialogTitle: '申请学校',
      info: {},
      applyType,
      downloadLoading: false,
      dialogLoading: false,
      dialogFormVisible: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    reset() {
      this.listQuery = this.$options.data().listQuery
      this.info = {}
    },
    async getList() {
      try {
        this.listLoading = true
        const {
          data: { meta, list },
        } = await getApplySchoolList(this.listQuery)
        this.list = list
        this.total = meta.total
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    handleAdd() {
      this.dialogTitle = '申请学校'
      this.dialogFormVisible = true
    },
    async addApply() {
      try {
        this.dialogLoading = true
        await applySchool(this.info)
        this.dialogLoading = false
        this.dialogFormVisible = false
        await this.getList()
      } catch (e) {
        this.dialogLoading = false
      }
    },
    handleCloseForm() {
      this.reset()
    },
    deleteApply(row) {
      this.$confirm(`此操作不可恢复，确认要删除【${row.name}】的申请吗？`)
        .then(async() => {
          try {
            await deleteApplySchool(row.id)
            this.$message({ message: '删除成功', type: 'success' })
            await this.getList()
          } catch (e) {
            this.$message({ message: '删除失败', type: 'error' })
          }
        })
        .catch((_) => {})
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
