import jwtDecode from 'jwt-decode'
import api from '../api'

interface User {
  id: number
  name: string
  nickname: string
  permissions: number
}

export async function login (username: string, password: string): Promise<User> {
  const { data } = await (api.login({ username, password }))
  const token = data.access_token as string
  localStorage.setItem('token', token)
  const user = jwtDecode<User>(token)
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export function isAuthenticated (): boolean {
  // debugger
  console.log(getUser())
  return getUser() !== null
}

export function getToken (): string|null {
  return localStorage.getItem('token')
}

export function getUser (): User|null {
  const u = localStorage.getItem('user')
  if (u === null) {
    return null
  }
  return JSON.parse(u) as User
}

export function logout () {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
