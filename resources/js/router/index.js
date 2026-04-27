import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../pages/Home.vue')
    },
    {
    path: '/catalog',
    name: 'Catalog',
    component: () => import('../pages/Catalog.vue')
},
{
    path: '/catalog/:filter',
    name: 'CatalogFiltered',
    component: () => import('../pages/Catalog.vue')
},
    // {
    //     path: '/catalog/:category',
    //     name: 'catalog-category',
    //     component: () => import('../pages/CatalogCategory.vue')
    // },
    {
        path: '/product/:id',
        name: 'product-detail',
        component: () => import('../pages/ProductDetail.vue')
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('../pages/Cart.vue')
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: () => import('../pages/Checkout.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../pages/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../pages/Register.vue')
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('../pages/ForgotPassword.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../pages/Profile.vue')
    },
    {
        path: '/profile/orders',
        name: 'profile-orders',
        component: () => import('../pages/ProfileOrders.vue')
    },
    {
        path: '/profile/password',
        name: 'profile-password',
        component: () => import('../pages/ProfilePassword.vue')
    },
    {
        path: '/favorites',
        name: 'favorites',
        component: () => import('../pages/Favorites.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../pages/About.vue')
    },
    {
        path: '/contacts',
        name: 'contacts',
        component: () => import('../pages/Contacts.vue')
    },
    {
    path: '/admin',
    name: 'Admin',
    component: () => import('../pages/AdminPanel.vue')
}

    
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router