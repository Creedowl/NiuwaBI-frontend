<template>
  <el-divider>过滤器</el-divider>
  <el-form-item
    v-for="(item, index) in form.filters"
    :key="index"
    :label="`过滤器 ${index}`"
    required
  >
    <div class="filters">
      <el-select
        v-model="item.field"
        placeholder="选择字段"
      >
        <el-option-group
          key="dimension"
          label="维度"
        >
          <el-option
            v-for="dim in dmf_?.dimensions"
            :key="dim.name"
            :label="dim.label"
            :value="dim.name"
          />
        </el-option-group>
        <el-option-group
          key="metric"
          label="指标"
        >
          <el-option
            v-for="met in dmf_?.metrics"
            :key="met.name"
            :label="met.label"
            :value="met.name"
          />
        </el-option-group>
      </el-select>
      <el-select
        v-model="item.op"
        placeholder="操作符"
      >
        <el-option
          v-for="op in ops"
          :key="op"
          :label="op"
          :value="op"
        />
      </el-select>
      <el-input
        v-model="item.value"
        style="width: auto;"
        autosize
        @blur="onBlur"
      />
      <el-button
        type="warning"
        @click="removeFilter(item)"
      >
        删除
      </el-button>
    </div>
  </el-form-item>
  <el-button
    type="primary"
    @click="addFilter()"
  >
    新增
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dmf, Filter, TableConfig } from '../api'

const ops = ['>', '>=', '=', '<', '<=', 'in', 'not in']

const props = defineProps<{
  config: TableConfig;
  dmf?: Dmf;
}>()

const form = ref(props.config)
const dmf_ = ref(props.dmf)

function addFilter () {
  form.value.filters.push({
    field: '',
    op: '',
    value: ''
  })
}

function removeFilter (item: Filter) {
  const index = form.value.filters.indexOf(item)
  if (index !== -1) {
    form.value.filters.splice(index, 1)
  }
}

function onBlur (value: string) {
  form.value.filters.forEach(filter => {
    if (filter.op === 'in' || filter.op === 'not in') {
      if (typeof (filter.value) === 'string') {
        filter.value = filter.value.split(',')
      }
    }
  })
}
</script>

<style scoped>
.filters {
  display: flex;
  justify-content: space-evenly;
}
</style>
