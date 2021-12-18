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
    path: '/report/:id',
    component: importComponent('report/Report')
  },
  {
    path: '/workspace',
    component: importComponent('workspace/Workspaces')
  },
  {
    path: '/workspace/:id',
    component: importComponent('report/Reports')
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router
