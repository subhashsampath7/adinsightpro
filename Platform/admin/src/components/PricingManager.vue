<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-xl font-bold text-gray-900 mb-6">Pricing Plan Manager</h3>
    
    <form @submit.prevent="handleUpdate" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Plan Duration
          </label>
          <input
            type="text"
            :value="`${plan.duration_months} Month${plan.duration_months > 1 ? 's' : ''}`"
            disabled
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) *
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">$</span>
            <input
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          v-model="formData.description"
          rows="3"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Features (one per line)
        </label>
        <textarea
          v-model="featuresText"
          rows="5"
          placeholder="Access to all features&#10;Email support&#10;Regular updates&#10;Cancel anytime"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
        <p class="text-sm text-gray-500 mt-1">
          <i class="fas fa-info-circle mr-1"></i>Enter each feature on a new line
        </p>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div class="flex">
          <i class="fas fa-info-circle text-blue-400 mt-1 mr-3"></i>
          <div>
            <p class="text-sm text-blue-700">
              <strong>Current Settings:</strong>
            </p>
            <p class="text-sm text-blue-600 mt-1">
              Price: ${{ plan.price }} | Duration: {{ plan.duration_months }} month(s)
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="resetForm"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
        >
          <i class="fas fa-save mr-2"></i>
          {{ loading ? 'Updating...' : 'Update Plan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'PricingManager',
  props: {
    plan: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const formData = ref({
      price: props.plan.price,
      description: props.plan.description
    });

    const featuresText = ref('');

    // Initialize features text
    if (props.plan.features) {
      try {
        const features = typeof props.plan.features === 'string' 
          ? JSON.parse(props.plan.features) 
          : props.plan.features;
        featuresText.value = Array.isArray(features) ? features.join('\n') : '';
      } catch (e) {
        featuresText.value = '';
      }
    }

    const resetForm = () => {
      formData.value = {
        price: props.plan.price,
        description: props.plan.description
      };
      if (props.plan.features) {
        try {
          const features = typeof props.plan.features === 'string' 
            ? JSON.parse(props.plan.features) 
            : props.plan.features;
          featuresText.value = Array.isArray(features) ? features.join('\n') : '';
        } catch (e) {
          featuresText.value = '';
        }
      }
    };

    const handleUpdate = () => {
      const features = featuresText.value
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      emit('update', {
        planId: props.plan.id,
        price: formData.value.price,
        description: formData.value.description,
        features: features
      });
    };

    // Watch for plan changes
    watch(() => props.plan, (newPlan) => {
      formData.value = {
        price: newPlan.price,
        description: newPlan.description
      };
      if (newPlan.features) {
        try {
          const features = typeof newPlan.features === 'string' 
            ? JSON.parse(newPlan.features) 
            : newPlan.features;
          featuresText.value = Array.isArray(features) ? features.join('\n') : '';
        } catch (e) {
          featuresText.value = '';
        }
      }
    });

    return {
      formData,
      featuresText,
      resetForm,
      handleUpdate
    };
  }
}
</script>