import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'LandingPage',

            component: () => import('../views/LandingPage.vue')
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/profile-edit',
            name: 'profileEdit',
            component: () => import('../views/ProfileEditView.vue')
        },

        {
            path: '/game/:gameID',
            name: 'WordGame',
            props: true,
            component: () => import('../views/WordGameView.vue')
        },

        {
            path: '/login-register',
            name: 'loginRegister',
            component: () => import('../views/LoginRegisterView.vue')
        },

        {
            path: '/new-room',
            name: 'newroom',
            component: () => import('../views/newRoomView.vue')
        },

        {
            path: '/room-list',
            name: 'RoomList',
            component: () => import('../views/RoomListView.vue')
        },

    ]
})

export default router
