// Example of how to use Vue Router

import { createRouter, createWebHistory } from 'vue-router'

// 1. Define route components.
// These can be imported from other files
import SimilarUsers from '../pages/SimilarUsers.vue';
import OtherPage from '../pages/OtherPage.vue';
import ProfilePage from '../pages/Profile.vue';
import HobbyList from '../pages/HobbyList.vue';

let base = (import.meta.env.MODE == 'development') ? import.meta.env.BASE_URL : ''

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const router = createRouter({
    history: createWebHistory(base),
    routes: [
        { path: '/other/', name: 'Other Page', component: OtherPage },
        { path: '/profile/', name: 'Profile Page', component: ProfilePage },
        { path: '/', name: 'Similar Users', component: SimilarUsers },
        { path: '/hobbies/', name: 'Hobby List', component: HobbyList },
    ]
})

export default router
