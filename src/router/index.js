import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import AddCustomer from '@/components/views/AddCustomer'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        title: '首页'
      },
      component: Home
    },
    {
      path: '/addCustomer',
      name: 'addCustomer',
      meta: {
        title: '新增客户'
      },
      component: AddCustomer
    }
  ]
})

router.beforeEach((to, form, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
