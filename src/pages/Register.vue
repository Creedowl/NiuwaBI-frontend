<template>
  <el-card id="login">
    <template #header>
      <div class="card-header">
        <span>注册</span>
      </div>
    </template>
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      label-position="right"
    >
      <el-form-item
        label="用户名"
        prop="username"
        :required="true"
      >
        <el-input
          v-model="form.username"
          placeholder="Please input username"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :required="true"
      >
        <el-input
          v-model="form.password"
          placeholder="Please input password"
          show-password
        />
      </el-form-item>
      <el-form-item
        label="昵称"
        prop="nickname"
        placeholder="Please input nickname"
        required
      >
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit()"
        >
          注册
        </el-button>
        <el-button
          type="warning"
          @click="reset()"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ElForm, ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { login, register } from '../utils/user'
import { useRouter } from 'vue-router'

const formRef = ref<InstanceType<typeof ElForm>>()

const form = reactive({
  username: '',
  password: '',
  nickname: ''
})

const router = useRouter()

function reset () {
  formRef.value?.resetFields()
}

async function submit () {
  try {
    const resp = await register(form.username, form.password, form.nickname)
    if (resp === 'success') {
      ElMessage.success('注册成功')
      router.push('/')
    } else {
      ElMessage.error('注册失败')
    }
  } catch (error) {
    ElMessage.error('注册失败')
    console.error(error)
  }
}
</script>

  <style scoped>
  .card-header {
    text-align: center;
  }

  #login {
    min-width: 30vw;
    height: fit-content;
    text-align: right;
  }
  </style>
