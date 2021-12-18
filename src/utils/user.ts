import jwtDecode from 'jwt-decode'
import { App, reactive } from 'vue'
import { Router } from 'vue-router'

import api from '../api'

export interface User {
  id: number
  name: string
  nickname: string
  permissions: number
}

export interface Auth {
  user: User | null
  // logined: boolean
}

const auth: Auth = reactive({
  user: getUser()
  // logined:
})

export function initAuth () {
  // function getUser (): User {
  //   const u = localStorage.getItem('user') || '{}'
  //   return JSON.parse(u) as User
  // }

  // async function login (username: string, password: string): Promise<User> {
  //   const { data } = await (api.login({ username, password }))
  //   const token = data.access_token as string
  //   localStorage.setItem('token', token)
  //   const user = jwtDecode<User>(token)
  //   localStorage.setItem('user', JSON.stringify(user))
  //   auth.user = user
  //   return user
  // }

  const a = {
    // login,
    install: function (app: App) {
      app.config.globalProperties.$auth = this
      app.provide('auth', auth)
    }
  }
  return a
}

export async function login (username: string, password: string): Promise<User> {
  const { data } = await (api.login({ username, password }))
  const token = data.access_token as string
  localStorage.setItem('token', token)
  const user = jwtDecode<User>(token)
  localStorage.setItem('user', JSON.stringify(user))
  auth.user = user
  return user
}

export function isAuthenticated (): boolean {
  console.log(getUser())
  return getUser() !== null
}

export function getToken (): string|null {
  return localStorage.getItem('token')
}

export function getUser (): User|null {
  const u = localStorage.getItem('user')
  if (u === null) return null
  return JSON.parse(u) as User
}

export function logout (router: Router) {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  auth.user = null
  router.push('/')
}
