<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 ml-64">
      <Header title="Pricing Management" subtitle="Update pricing plans" />
      
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="plan in plans" :key="plan.id" class="bg-white rounded-lg shadow p-6">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                {{ plan.duration_months }} Month{{ plan.duration_months > 1 ? 's' : '' }}
              </h3>
              <div class="text-4xl font-bold text-blue-600 mb-2">
                ${{ plan.price }}
              </div>
            </div>

            <form @submit.prevent="updatePlan(plan)" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  v-model.number="plan.price"
                  type="number"
                  step="0.01"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="plan.description"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <i class="fas fa-save mr-2"></i>Update Plan
              </button>
            </form>
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
  name: 'Pricing',
  components: { Sidebar, Header },
  setup() {
    const plans = ref([
      { id: 1, duration_months: 1, price: 29.99, description: 'Monthly Plan' },
      { id: 2, duration_months: 3, price: 79.99, description: 'Quarterly Plan' },
      { id: 3, duration_months: 12, price: 299.99, description: 'Annual Plan' }
    ]);

    const updatePlan = async (plan) => {
      try {
        const response = await adminAPI.updatePricing({
          planId: plan.id,
          price: plan.price,
          description: plan.description,
          features: []
        });

        if (response.success) {
          alert('Pricing plan updated successfully!');
        }
      } catch (err) {
        alert('Failed to update pricing plan');
      }
    };

    return {
      plans,
      updatePlan
    };
  }
}
</script>