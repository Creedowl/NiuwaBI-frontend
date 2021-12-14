import * as VueRouter from 'vue-router'

function importComponent (name: string) {
  return () => import(`../pages/${name}.vue`)
}

const routes = [
  {
    path: '/',
    component: importComponent('HelloWorld')
  },
  {
    path: '/login',
    component: importComponent('Login')
  },
  {
    path: '/report',
    component: importComponent('Report')
  },
  {
    path: '/workspace',
    component: importComponent('/workspace/Workspaces')
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router
