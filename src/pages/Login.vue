<template>
  <el-card id="login">
    <template #header>
      <div class="card-header">
        <span>登录</span>
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
      <el-form-item>
        <el-button
          type="primary"
          @click="submit()"
        >
          登录
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
import { login } from '../utils/user'
import { useRouter } from 'vue-router'

const formRef = ref<InstanceType<typeof ElForm>>()

const form = reactive({
  username: '',
  password: ''
})

const router = useRouter()

function reset () {
  formRef.value?.resetFields()
}

async function submit () {
  try {
    const resp = await login(form.username, form.password)
    console.log(resp)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
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
