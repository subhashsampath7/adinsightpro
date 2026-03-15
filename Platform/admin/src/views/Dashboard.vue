<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 ml-64">
      <Header title="Dashboard" subtitle="Overview of your platform" />
      
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Total Users</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalUsers || 0 }}</p>
              </div>
              <div class="bg-blue-100 rounded-full p-4">
                <i class="fas fa-users text-blue-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Pending KYC</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.pendingKYC || 0 }}</p>
              </div>
              <div class="bg-yellow-100 rounded-full p-4">
                <i class="fas fa-id-card text-yellow-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Pending Payments</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.pendingPayments || 0 }}</p>
              </div>
              <div class="bg-orange-100 rounded-full p-4">
                <i class="fas fa-clock text-orange-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Active Licenses</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.activeLicenses || 0 }}</p>
              </div>
              <div class="bg-green-100 rounded-full p-4">
                <i class="fas fa-key text-green-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Total Revenue</h3>
          <p class="text-4xl font-bold text-green-600">${{ formatRevenue(stats.totalRevenue) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import { adminAPI } from '../services/api';

export default {
  name: 'Dashboard',
  components: { Sidebar, Header },
  setup() {
    const stats = ref({
      totalUsers: 0,
      pendingKYC: 0,
      pendingPayments: 0,
      activeLicenses: 0,
      totalRevenue: 0
    });

    const loadStats = async () => {
      try {
        const response = await adminAPI.getStats();
        if (response.success) {
          stats.value = response.data;
          console.log('✅ Stats loaded:', stats.value);
        }
      } catch (err) {
        console.error('❌ Failed to load stats:', err);
      }
    };

    // ✅ Safe number formatting
    const formatRevenue = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    onMounted(() => {
      loadStats();
    });

    return { 
      stats,
      formatRevenue // ✅ Added
    };
  }
}
</script>
