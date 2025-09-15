import { createRouter, createWebHistory } from 'vue-router'
import HousesView from '@/views/HousesView.vue'
import AboutView from '@/views/AboutView.vue'
import HouseDetails from '@/views/HouseDetails.vue'
import CreateHouseView from '@/views/CreateHouseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/houses',
    },
    {
      path: '/houses',
      name: 'houses',
      component: HousesView,
    },
    {
      path: '/houses/create',
      name: 'create-house',
      component: CreateHouseView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/houses/:id',
      name: 'HouseDetails',
      component: HouseDetails,
      props: true,
    },
  ],
})

export default router
