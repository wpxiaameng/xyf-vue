import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CustomerIndex from '@/components/views/CustomerIndex'

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
      path: '/customerIndex',
      name: 'customerIndex',
      meta: {
        title: '新增客户'
      },
      component: CustomerIndex
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
