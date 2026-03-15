<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 ml-64">
      <Header title="Discount Codes" subtitle="Create and manage discount codes" />
      
      <div class="p-8">
        <!-- Create New Code -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Create New Discount Code</h2>
          <form @submit.prevent="createCode" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Code</label>
              <input
                v-model="newCode.code"
                type="text"
                required
                placeholder="SUMMER2024"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                v-model.number="newCode.discountPercentage"
                type="number"
                min="1"
                max="100"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Uses</label>
              <input
                v-model.number="newCode.maxUses"
                type="number"
                min="1"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Expires At</label>
              <input
                v-model="newCode.expiresAt"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="md:col-span-4">
              <button
                type="submit"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <i class="fas fa-plus mr-2"></i>Create Code
              </button>
            </div>
          </form>
        </div>

        <!-- Existing Codes -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b">
            <h2 class="text-xl font-bold text-gray-900">Existing Discount Codes</h2>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uses</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="code in codes" :key="code.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap font-mono font-bold">{{ code.code }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ code.discount_percentage }}%</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ code.current_uses }} / {{ code.max_uses }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ code.expires_at ? formatDate(code.expires_at) : 'Never' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="code.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ code.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="toggleCode(code)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      <i :class="code.is_active ? 'fas fa-toggle-on' : 'fas fa-toggle-off'" class="text-xl"></i>
                    </button>
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
import { ref, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import { adminAPI } from '../services/api';

export default {
  name: 'DiscountCodes',
  components: { Sidebar, Header },
  setup() {
    const codes = ref([]);
    const newCode = ref({
      code: '',
      discountPercentage: 10,
      maxUses: 100,
      expiresAt: ''
    });

    const loadCodes = async () => {
      try {
        const response = await adminAPI.getAllDiscountCodes();
        if (response.success) {
          codes.value = response.data;
        }
      } catch (err) {
        console.error('Failed to load discount codes:', err);
      }
    };

    const createCode = async () => {
      try {
        const response = await adminAPI.createDiscountCode(newCode.value);
        if (response.success) {
          alert('Discount code created successfully!');
          newCode.value = {
            code: '',
            discountPercentage: 10,
            maxUses: 100,
            expiresAt: ''
          };
          loadCodes();
        }
      } catch (err) {
        alert('Failed to create discount code');
      }
    };

    const toggleCode = async (code) => {
      try {
        const response = await adminAPI.toggleDiscountCode({
          codeId: code.id,
          isActive: !code.is_active
        });
        if (response.success) {
          loadCodes();
        }
      } catch (err) {
        alert('Failed to toggle discount code');
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    onMounted(() => {
      loadCodes();
    });

    return {
      codes,
      newCode,
      createCode,
      toggleCode,
      formatDate
    };
  }
}
</script>