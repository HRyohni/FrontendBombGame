import {createRouter, createWebHistory} from 'vue-router'
import store from "../../store" ;
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
            path: '/new-room/:gamename',
            name: 'newroomProp',
            component: (gameModeName) => import('../views/newRoomView.vue'),
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
            path: '/shop',
            name: 'shop',
            component: () => import('../views/ShopView.vue')
        },
        {
            path: '/scoreboard',
            name: 'scoreboard',
            component: () => import('../views/ScoreboardView.vue')
        },

    ]
})
router.beforeResolve((to, from, next) => {
    const user = store.getters.getUser;
    console.log('username: ', user);
    if (!user && to.path !== "/login-register") {
        next("/login-register");
    } else {
        next(); // Call next only once

    }
});

export default router
