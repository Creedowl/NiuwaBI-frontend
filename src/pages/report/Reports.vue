<template>
  <div id="reports">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="'/workspace'">
        工作区列表
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="`/workspace/${workspaceID}`">
        {{ workspaceID }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div id="operations">
      <el-button
        type="primary"
        @click="create()"
      >
        新建
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="300"
      />
      <el-table-column
        prop="name"
        label="报表"
        width="300"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleView(scope.$index, scope.row)"
          >
            查看
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>

          <el-popconfirm
            title="确认要删除这个报表吗？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button
                size="mini"
                type="danger"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div id="pagination">
      <el-pagination
        :page-size="pagination.page_size"
        :current-page="pagination.page_num"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { ReportConfig } from '../../api'

const workspaceID = parseInt(useRoute().params.id as string)
const tableData = ref([])
const loading = ref(true)
const pagination = ref({
  page_num: 1,
  page_size: 30,
  total: 0
})
const visible = ref(false)
const config = ref<ReportConfig>()

const router = useRouter()

const getData = async () => {
  try {
    const resp = (await api.report.getAll(pagination.value, workspaceID)).data
    tableData.value = resp.data.data
    if (pagination.value.total === 0) {
      pagination.value.total = resp.data.total
    }
    loading.value = false
  } catch (error) {
    console.error(error)
  }
}

onMounted(getData)

function handleView (index: any, row: ReportConfig) {
  console.log(index, row)
  router.push(`/report/${row.id}`)
}

function handleEdit (index: any, row: ReportConfig) {
  console.log(index, row)
  config.value = row
  visible.value = true
}

async function handleDelete (index: any, row: ReportConfig) {
  console.log(index, row)
  try {
    await api.workspace.delete(row.id)
    ElMessage.success('删除成功')
    await getData()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error(error)
  }
}

const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`)
}

async function handleCurrentChange (val: number) {
  loading.value = true
  pagination.value.page_num = val
  await getData()
  loading.value = false
}

function create () {
  config.value = undefined
  visible.value = true
}

async function createReport (c: ReportConfig) {
  try {
    if (c.id === 0) {
      await api.report.create(c)
      ElMessage.success('创建成功')
    } else {
      await api.report.update(c)
      ElMessage.success('更新成功')
    }
    visible.value = false
    await getData()
  } catch (error) {
    ElMessage.error('保存失败')
    console.error(error)
  }
}
</script>

<style scoped>
#reports {
  width: 80%;
}

#operations {
  display: flex;
  justify-content: right;
}

#pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>
