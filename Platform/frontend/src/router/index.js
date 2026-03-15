import { createRouter, createWebHistory } from 'vue-router';
import { store } from '../store';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Profile from '../views/Profile.vue';
import KYC from '../views/KYC.vue';
import Purchase from '../views/Purchase.vue';
import MyKeys from '../views/MyKeys.vue';
import PaymentSuccess from '../views/PaymentSuccess.vue';

// ✅ NEW IMPORTS - Help & Support Pages
import FAQ from '../views/FAQ.vue';
import ContactUs from '../views/ContactUs.vue';
import HelpCenter from '../views/HelpCenter.vue';
import Documentation from '../views/Documentation.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { requiresAuth: false }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
        path: '/kyc',
        name: 'KYC',
        component: KYC,
        meta: { requiresAuth: true }
    },
    {
        path: '/purchase',
        name: 'Purchase',
        component: Purchase,
        meta: { requiresAuth: true }
    },
    {
        path: '/my-keys',
        name: 'MyKeys',
        component: MyKeys,
        meta: { requiresAuth: true }
    },
    {
        path: '/payment-success',
        name: 'PaymentSuccess',
        component: PaymentSuccess,
        meta: { requiresAuth: true }
    },
    // ✅ NEW ROUTES - Help & Support Pages
    {
        path: '/faq',
        name: 'FAQ',
        component: FAQ,
        meta: { requiresAuth: false }
    },
    {
        path: '/contact',
        name: 'ContactUs',
        component: ContactUs,
        meta: { requiresAuth: false }
    },
    {
        path: '/help-center',
        name: 'HelpCenter',
        component: HelpCenter,
        meta: { requiresAuth: false }
    },
    {
        path: '/documentation',
        name: 'Documentation',
        component: Documentation,
        meta: { requiresAuth: false }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    // ✅ OPTIONAL: Add smooth scroll behavior
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            };
        } else {
            return { top: 0 };
        }
    }
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    console.log('🔍 Navigation Guard:', {
        to: to.path,
        from: from.path,
        requiresAuth,
        isAuthenticated: store.isAuthenticated,
        hasToken: !!store.token,
        hasUser: !!store.user
    });

    if (requiresAuth && !store.isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to login');
        next('/login');
    } else if ((to.path === '/login' || to.path === '/register') && store.isAuthenticated) {
        console.log('✅ Already authenticated, redirecting to dashboard');
        next('/dashboard');
    } else {
        console.log('✅ Navigation allowed');
        next();
    }
});

export default router;
