<template>
  <div class="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center space-x-2">
        <i class="fas fa-shield-alt text-2xl text-blue-400"></i>
        <span class="text-xl font-bold">Admin Panel</span>
      </div>
    </div>

    <nav class="p-4">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition"
        :class="isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'"
      >
        <i :class="item.icon" class="text-lg w-5"></i>
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {{ item.badge }}
        </span>
      </router-link>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
      <div class="flex items-center space-x-3 px-4 py-3">
        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <i class="fas fa-user"></i>
        </div>
        <div class="flex-1">
          <p class="font-semibold">{{ admin?.username }}</p>
          <p class="text-xs text-gray-400">{{ admin?.role }}</p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
      >
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { store } from '../store';

export default {
  name: 'Sidebar',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const admin = computed(() => store.admin);

    const menuItems = [
      { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-home' },
      { path: '/users', label: 'Users', icon: 'fas fa-users' },
      { path: '/kyc', label: 'KYC Verifications', icon: 'fas fa-id-card' },
      { path: '/payments', label: 'Payments', icon: 'fas fa-credit-card' },
      { path: '/licenses', label: 'Licenses', icon: 'fas fa-key' },
      { path: '/pricing', label: 'Pricing Plans', icon: 'fas fa-tags' },
      { path: '/discount-codes', label: 'Discount Codes', icon: 'fas fa-percent' }
    ];

    const isActive = (path) => {
      return route.path === path;
    };

    const handleLogout = () => {
      store.logout();
      router.push('/login');
    };

    return {
      admin,
      menuItems,
      isActive,
      handleLogout
    };
  }
}
</script>