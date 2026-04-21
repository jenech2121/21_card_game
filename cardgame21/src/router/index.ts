import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainGame from '@/views/MainGame.vue'
import MainMenu from '@/components/MainMenu.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
      {
      path: '/MainMenu',
      name: 'MainMenu',
      component: MainMenu,
    },
       {
      path: '/game',
      name: 'MainGame',
      component: MainGame,
    },
  ],
})

export default router
