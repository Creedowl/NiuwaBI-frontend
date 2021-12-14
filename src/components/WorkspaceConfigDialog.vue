<template>
  <el-dialog
    v-model="dialogVisible"
    title="设置"
    :destroy-on-close="true"
    @close="cancel()"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      label-position="left"
    >
      <el-form-item
        label="ID"
        prop="id"
        required
      >
        <el-input
          v-model="form.id"
          disabled
        />
      </el-form-item>
      <el-form-item
        label="报表名"
        prop="name"
        required
      >
        <el-input
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item
        label="创建人"
        prop="owner"
        required
      >
        <el-input
          v-model="form.owner"
          disabled
        />
      </el-form-item>
      <el-divider>数据库配置</el-divider>
      <el-form-item
        label="数据库类型"
        prop="config.db.type"
        required
      >
        <div id="type">
          <el-select
            v-model="form.config.db.type"
            placeholder="请选择数据类型"
          >
            <el-option
              label="Mysql"
              value="mysql"
            />
            <el-option
              label="SQLite"
              value="sqlite"
            />
          </el-select>
          <el-button
            type="primary"
            @click="testConn()"
          >
            测试连接
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="主机"
        prop="config.db.host"
        required
      >
        <el-input
          v-model="form.config.db.host"
        />
      </el-form-item>
      <el-form-item
        label="端口"
        prop="config.db.port"
        required
      >
        <el-input-number
          v-model="form.config.db.port"
          :min="1"
          :max="65535"
          :step-strictly="true"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="用户名"
        prop="config.db.username"
        required
      >
        <el-input
          v-model="form.config.db.username"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="config.db.password"
        required
      >
        <el-input
          v-model="form.config.db. password"
        />
      </el-form-item>
      <el-form-item
        label="数据库"
        prop="config.db.database"
        required
      >
        <el-input
          v-model="form.config.db.database"
        />
      </el-form-item>
      <el-divider />
      <el-button
        type="primary"
        @click="save()"
      >
        保存
      </el-button>
      <el-button
        type="warning"
        @click="cancel()"
      >
        取消
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus'
import { inject, onMounted, reactive, ref } from 'vue'
import api, { WorkspaceConfig } from '../api'
import { Auth } from '../utils/user'

const props = withDefaults(defineProps<{
  visible: boolean
  config?: WorkspaceConfig
}>(), {
  config: () => {
    return {
      id: 0,
      name: '',
      owner: 0,
      config: {
        db: {
          type: 'mysql',
          host: '',
          port: 0,
          username: '',
          password: '',
          database: ''
        }
      }
    }
  }
})

const emit = defineEmits(['update:visible', 'save'])

const formRef = ref<InstanceType<typeof ElForm>>()

const dialogVisible = ref(props.visible)
const form = reactive<WorkspaceConfig>(JSON.parse(JSON.stringify(props.config)))

const auth = inject<Auth>('auth') as Auth

onMounted(() => {
  if (form.owner === 0) {
    form.owner = auth.user?.id || 0
  }
})

// watch(() => props.visible, () => { dialogVisible.value = props.visible })
// watch(() => props.config, () => { form.value = props.config })

function save () {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      emit('save', form)
      ElMessage.success('连接成功')
    } else {
      ElMessage.error('表单校验失败')
      return false
    }
  })
}

function cancel () {
  emit('update:visible', false)
}

async function testConn () {
  try {
    await formRef.value?.validate(async (valid) => {
      if (valid) {
        await api.workspace.testConn(form)
        ElMessage.success('连接成功')
      } else {
        ElMessage.error('表单校验失败')
        return false
      }
    })
  } catch (error) {
    ElMessage.error('连接失败')
    console.error(error)
  }
}

</script>

<style scoped>
#type {
  display: flex;
  justify-content: space-evenly;
}
</style>
