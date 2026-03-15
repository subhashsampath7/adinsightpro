<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My License Keys</h1>
        <p class="text-gray-600 mt-2">Manage and view your license keys</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-primary"></i>
        <p class="text-gray-600 mt-4">Loading licenses...</p>
      </div>

      <div v-else-if="licenses.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <i class="fas fa-key text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No License Keys Yet</h3>
        <p class="text-gray-600 mb-6">Purchase your first license key to get started</p>
        <router-link
          to="/purchase"
          class="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Purchase License
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div 
          v-for="license in licenses" 
          :key="license.id"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <div class="p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div class="flex items-center space-x-3 mb-2">
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-semibold"
                    :class="getStatusColor(license.status)"
                  >
                    {{ license.status.toUpperCase() }}
                  </span>
                  <span 
                    v-if="license.daysRemaining <= 5 && license.status === 'active'"
                    class="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800"
                  >
                    <i class="fas fa-exclamation-triangle mr-1"></i>Expiring Soon
                  </span>
                </div>
                <p class="text-sm text-gray-600">
                  Plan: {{ license.duration_months }} month(s) | 
                  Created: {{ formatDate(license.created_at) }}
                </p>
              </div>
              <div class="mt-4 md:mt-0 text-right">
                <p class="text-sm text-gray-600">Expires on</p>
                <p class="text-lg font-bold text-gray-900">{{ formatDate(license.expires_at) }}</p>
                <p 
                  class="text-sm font-semibold mt-1"
                  :class="getDaysLeftColor(license.daysRemaining)"
                >
                  {{ license.daysRemaining }} days remaining
                </p>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm text-gray-600 mb-2">License Key</p>
                  <p class="text-2xl font-mono font-bold text-gray-900">{{ license.license_key }}</p>
                </div>
                <button
                  @click="copyKey(license.license_key)"
                  class="ml-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <i class="fas fa-copy mr-2"></i>Copy
                </button>
              </div>
            </div>

            <div v-if="license.status === 'active'" class="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
              <p class="text-blue-800 text-sm">
                <i class="fas fa-info-circle mr-2"></i>
                Copy this key and paste it in the extension to activate your license.
              </p>
            </div>

            <div v-if="license.status === 'expired'" class="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <p class="text-red-800 text-sm">
                <i class="fas fa-exclamation-circle mr-2"></i>
                This license has expired. Purchase a new license to continue using the extension.
              </p>
            </div>
          </div>
        </div>

        <div class="text-center mt-8">
          <router-link
            to="/purchase"
            class="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            <i class="fas fa-plus mr-2"></i>Purchase Another License
          </router-link>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { licenseAPI } from '../services/api';
import { formatDate, getStatusColor, copyToClipboard, showToast } from '../utils/helpers';

export default {
  name: 'MyKeys',
  components: { Navbar, Footer },
  setup() {
    const loading = ref(true);
    const licenses = ref([]);

    const loadLicenses = async () => {
      try {
        const response = await licenseAPI.getUserLicenses();
        if (response.success) {
          licenses.value = response.data;
        }
      } catch (err) {
        console.error('Failed to load licenses:', err);
        showToast('Failed to load licenses', 'error');
      } finally {
        loading.value = false;
      }
    };

    const copyKey = async (key) => {
      try {
        await copyToClipboard(key);
        showToast('License key copied to clipboard!', 'success');
      } catch (err) {
        showToast('Failed to copy license key', 'error');
      }
    };

    const getDaysLeftColor = (days) => {
      if (days <= 5) return 'text-red-600';
      if (days <= 15) return 'text-yellow-600';
      return 'text-green-600';
    };

    onMounted(() => {
      loadLicenses();
    });

    return {
      loading,
      licenses,
      copyKey,
      formatDate,
      getStatusColor,
      getDaysLeftColor
    };
  }
}
</script>