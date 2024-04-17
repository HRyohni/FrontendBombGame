import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'LandingPage',

            component: () => import('../views/LandingPage.vue')
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

        {
            path: '/create-gamemode',
            name: 'createNewGamemode',
            component: () => import('../views/CreateGamemodeView.vue')
        },
        {
            path: '/create-gamemode/:gamename',
            name: 'createNewGamemodeWithName',
            component: () => import('../views/CreateGamemodeView.vue'),
            props: true // Pass route params as props to the component
        },
        {
            path: '/shop',
            name: 'shop',
            component: () => import('../views/ShopView.vue')
        },

    ]
})

export default router
