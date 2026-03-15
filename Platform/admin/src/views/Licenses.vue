<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 ml-64">
      <Header title="Licenses Management" subtitle="View and manage all license keys" />
      
      <div class="p-8">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">All Licenses</h2>
            <div class="flex items-center space-x-4">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by key or UID..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select 
                v-model="filterStatus"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Key</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="license in filteredLicenses" :key="license.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold">
                    {{ license.license_key }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="font-medium">{{ license.first_name }} {{ license.last_name }}</p>
                      <p class="text-xs text-gray-500">{{ license.email }}</p>
                      <p class="text-xs text-gray-500">UID: {{ license.uid }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ license.duration_months }} month(s)</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="getStatusColor(license.status)">
                      {{ license.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatDate(license.created_at) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatDate(license.expires_at) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="font-semibold"
                      :class="getDaysLeftColor(license.daysRemaining)"
                    >
                      {{ license.daysRemaining }} days
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import { adminAPI } from '../services/api';

export default {
  name: 'Licenses',
  components: { Sidebar, Header },
  setup() {
    const licenses = ref([]);
    const searchQuery = ref('');
    const filterStatus = ref('');

    const filteredLicenses = computed(() => {
      let filtered = licenses.value;

      if (filterStatus.value) {
        filtered = filtered.filter(l => l.status === filterStatus.value);
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(l => 
          l.license_key.toLowerCase().includes(query) ||
          l.uid.toLowerCase().includes(query) ||
          l.email.toLowerCase().includes(query)
        );
      }

      return filtered;
    });

    const loadLicenses = async () => {
      try {
        const response = await adminAPI.getAllLicenses();
        if (response.success) {
          licenses.value = response.data;
        }
      } catch (err) {
        console.error('Failed to load licenses:', err);
      }
    };

    const getStatusColor = (status) => {
      const colors = {
        active: 'bg-green-100 text-green-800',
        expired: 'bg-red-100 text-red-800',
        revoked: 'bg-gray-100 text-gray-800'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getDaysLeftColor = (days) => {
      if (days <= 0) return 'text-red-600';
      if (days <= 5) return 'text-red-600';
      if (days <= 15) return 'text-yellow-600';
      return 'text-green-600';
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    onMounted(() => {
      loadLicenses();
    });

    return {
      licenses,
      searchQuery,
      filterStatus,
      filteredLicenses,
      getStatusColor,
      getDaysLeftColor,
      formatDate
    };
  }
}
</script>