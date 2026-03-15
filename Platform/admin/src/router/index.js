import { createRouter, createWebHistory } from 'vue-router';
import { store } from '../store';

import AdminLogin from '../views/AdminLogin.vue';
import Dashboard from '../views/Dashboard.vue';
import Users from '../views/Users.vue';
import KYCVerifications from '../views/KYCVerifications.vue';
import Payments from '../views/Payments.vue';
import Licenses from '../views/Licenses.vue';
import Pricing from '../views/Pricing.vue';
import DiscountCodes from '../views/DiscountCodes.vue';

const routes = [{
        path: '/login',
        name: 'AdminLogin',
        component: AdminLogin,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: { requiresAuth: true }
    },
    {
        path: '/kyc',
        name: 'KYCVerifications',
        component: KYCVerifications,
        meta: { requiresAuth: true }
    },
    {
        path: '/payments',
        name: 'Payments',
        component: Payments,
        meta: { requiresAuth: true }
    },
    {
        path: '/licenses',
        name: 'Licenses',
        component: Licenses,
        meta: { requiresAuth: true }
    },
    {
        path: '/pricing',
        name: 'Pricing',
        component: Pricing,
        meta: { requiresAuth: true }
    },
    {
        path: '/discount-codes',
        name: 'DiscountCodes',
        component: DiscountCodes,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !store.isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && store.isAuthenticated) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;