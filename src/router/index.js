import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
import Cart from '@/components/Cart'
import Address from '@/components/Address'
import OrderConfirm from '@/components/OrderConfirm'
import OrderSuccess from '@/components/OrderSuccess'
import Myself from '@/components/Myself'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    },
    {
      path: '/myself',
      name: 'Myself',
      component: Myself
    }
  ]
})
