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
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router
