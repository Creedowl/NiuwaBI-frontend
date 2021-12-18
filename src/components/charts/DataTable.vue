<template>
  <el-card class="data-table">
    <template #header>
      <div class="card-header">
        <span class="title">{{ config.name }}</span>
        <el-button
          v-if="setting.edit"
          @click="dialogVisible = true"
        >
          编辑
        </el-button>
        <el-button
          v-else
          type="primary"
          plain
        >
          导出
        </el-button>
      </div>
    </template>
    <el-table
      v-if="header.length > 0"
      :data="data.data"
      style="width: 100%"
    >
      <el-table-column
        v-for="item in header"
        :key="item"
        :prop="item"
        :label="labels[item] || item"
      />
    </el-table>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    title="设置"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      label-position="left"
    >
      <el-form-item
        label="类型"
        prop="type"
        required
      >
        <el-input
          v-model="form.type"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
        required
      >
        <el-input
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item
        label="Sql"
        prop="sql"
        required
      >
        <el-input
          v-model="form.sql"
          autosize
        />
      </el-form-item>
      <el-divider />
      <el-form-item
        v-for="(item, index) in form.kv"
        :key="item.key"
        :label="item.key"
        :prop="`kv.${index}.key`"
        required
      >
        <el-input
          v-model="item.label"
          autosize
        >
          <template #append>
            <el-button
              :icon="Close"
              @click="removeKv(item)"
            />
          </template>
        </el-input>
      </el-form-item>
      <el-popover
        v-model:visible="kvVisible"
        placement="top"
        :width="160"
      >
        <el-form
          ref="kvRef"
          :model="kv"
          label-position="left"
        >
          <el-form-item
            label="Key"
            prop="key"
            required
          >
            <el-input
              v-model="kv.key"
            />
          </el-form-item>
          <el-form-item
            label="标签"
            prop="label"
            required
          >
            <el-input
              v-model="kv.label"
            />
          </el-form-item>
        </el-form>
        <el-button
          size="mini"
          type="text"
          @click="kvVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="addKv()"
        >
          添加
        </el-button>
        <template #reference>
          <el-button
            type="primary"
          >
            新增
          </el-button>
        </template>
      </el-popover>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Close } from '@element-plus/icons'
import { Kv, ReportData, TableConfig } from '../../api'

const props = defineProps<{
  config: TableConfig
  data: ReportData
  setting: any
}>()

const form = ref(props.config)

const header = ref([] as string[])
const labels = ref({} as any)
const dialogVisible = ref(false)
const kvVisible = ref(false)
const kv = reactive({
  key: '',
  label: ''
})

onMounted(() => {
  if (props.data.data.length > 0) {
    for (const key in props.data.data[0]) {
      header.value.push(key)
    }
  }
  if (props.config.kv.length > 0) {
    for (const item of props.config.kv) {
      labels.value[item.key] = item.label
    }
  }
})

function addKv () {
  if (!labels.value[kv.key]) {
    const k = reactive({ ...kv })
    form.value.kv.push(k)
    labels.value[k.key] = k.label
  }
  kvVisible.value = false
}

function removeKv (item: Kv) {
  const index = form.value.kv.indexOf(item)
  if (index !== -1) {
    delete labels.value[item.key]
    form.value.kv.splice(index, 1)
  }
}

</script>

<style scoped>
.data-table {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.title {
  font-size: large;
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
</style>
