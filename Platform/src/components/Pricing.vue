<template>
  <section id="pricing" class="py-20 bg-white relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16">
        <span class="text-primary font-semibold text-sm uppercase tracking-wide">Pricing</span>
        <h2 class="text-4xl font-bold text-gray-900 mb-4 mt-2">Simple, Transparent Pricing</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that works best for you. All plans include full access to features.
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="spinner mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading pricing plans...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <i class="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
          <p class="text-red-600 font-semibold mb-4">{{ error }}</p>
          <button 
            @click="fetchPlans" 
            class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            <i class="fas fa-redo mr-2"></i>Try Again
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        <div 
          v-for="(plan, index) in sortedPlans" 
          :key="plan.id"
          :class="[
            'rounded-2xl shadow-xl p-8 transition-all duration-300 relative flex flex-col',
            plan.duration_months === 3 
              ? 'bg-gradient-to-br from-primary to-purple-600 text-white transform scale-105 lg:scale-110 z-10 border-4 border-yellow-400' 
              : 'bg-white hover:shadow-2xl hover:-translate-y-2 border-2 border-gray-100'
          ]"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Popular Badge -->
          <div 
            v-if="plan.duration_months === 3" 
            class="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center">
              <i class="fas fa-crown mr-2"></i>MOST POPULAR
            </div>
          </div>

          <!-- Best Value Badge -->
          <div 
            v-if="plan.duration_months === 12" 
            class="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <div class="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center">
              <i class="fas fa-star mr-2"></i>BEST VALUE
            </div>
          </div>

          <!-- Top Section: Header & Price -->
          <div class="text-center mb-8 mt-4">
            <!-- Plan Name -->
            <h3 
              :class="[
                'text-2xl font-bold mb-4',
                plan.duration_months === 3 ? 'text-white' : 'text-gray-900'
              ]"
            >
              {{ getPlanName(plan.duration_months) }}
            </h3>

            <!-- Price -->
            <div class="mb-4">
              <div 
                :class="[
                  'text-5xl font-bold mb-2',
                  plan.duration_months === 3 ? 'text-white' : 'text-primary'
                ]"
              >
                ${{ plan.price }}
              </div>
              <p 
                :class="[
                  'text-sm',
                  plan.duration_months === 3 ? 'text-gray-100' : 'text-gray-600'
                ]"
              >
                {{ plan.description }}
              </p>
            </div>

            <!-- Savings Badge -->
            <div v-if="getSavingsPercent(plan.duration_months) > 0" class="mb-4">
              <span 
                :class="[
                  'inline-block px-4 py-2 rounded-full text-sm font-bold',
                  plan.duration_months === 3 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'bg-green-100 text-green-700'
                ]"
              >
                <i class="fas fa-tag mr-1"></i>Save {{ getSavingsPercent(plan.duration_months) }}%
              </span>
            </div>

            <!-- Per Month Price -->
            <div 
              :class="[
                'text-sm font-semibold',
                plan.duration_months === 3 ? 'text-gray-200' : 'text-gray-500'
              ]"
            >
              ${{ (plan.price / plan.duration_months).toFixed(2) }}/month
            </div>
          </div>

          <!-- Middle Section: Features List (flex-grow to push button down) -->
          <ul class="space-y-4 mb-8 flex-grow">
            <li 
              v-for="(feature, idx) in getFeatures(plan.features)" 
              :key="idx"
              class="flex items-start"
            >
              <div 
                :class="[
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5',
                  plan.duration_months === 3 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'bg-green-100 text-green-600'
                ]"
              >
                <i class="fas fa-check text-sm"></i>
              </div>
              <span 
                :class="[
                  'text-sm leading-relaxed',
                  plan.duration_months === 3 ? 'text-white' : 'text-gray-700'
                ]"
              >
                {{ feature }}
              </span>
            </li>
          </ul>

          <!-- Bottom Section: Button & Guarantee (stays at bottom) -->
          <div class="mt-auto">
            <!-- CTA Button -->
            <router-link 
              to="/register" 
              :class="[
                'block w-full text-center py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg',
                plan.duration_months === 3 
                  ? 'bg-white text-primary hover:bg-gray-100 hover:shadow-2xl transform hover:scale-105' 
                  : 'bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary hover:to-blue-700 hover:shadow-xl'
              ]"
            >
              <i class="fas fa-rocket mr-2"></i>Get Started
            </router-link>

            <!-- Money Back Guarantee -->
            <div 
              :class="[
                'text-center mt-4 text-xs font-semibold',
                plan.duration_months === 3 ? 'text-gray-200' : 'text-gray-500'
              ]"
            >
              <i class="fas fa-shield-alt mr-1"></i>30-day money-back guarantee
            </div>
          </div>
        </div>
      </div>

      <!-- No Plans Available -->
      <div v-if="!loading && !error && sortedPlans.length === 0" class="text-center py-12">
        <div class="bg-gray-50 border-2 border-gray-200 rounded-2xl p-12 max-w-md mx-auto">
          <i class="fas fa-inbox text-gray-400 text-6xl mb-4"></i>
          <p class="text-gray-600 text-lg font-semibold">No pricing plans available at the moment.</p>
          <p class="text-gray-500 text-sm mt-2">Please check back later.</p>
        </div>
      </div>

      <!-- FAQ or Additional Info -->
      <div class="mt-16 text-center">
        <p class="text-gray-600 mb-4">
          Need a custom plan for your team? 
          <a href="mailto:sales@googleadstransparency.com" class="text-primary font-semibold hover:underline">
            Contact Sales
          </a>
        </p>
        <div class="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-2"></i>
            No credit card required
          </div>
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-2"></i>
            Cancel anytime
          </div>
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-2"></i>
            24/7 Support
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { pricingAPI } from '../services/api';

export default {
  name: 'Pricing',
  setup() {
    const plans = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchPlans = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await pricingAPI.getAllPlans();
        plans.value = response.plans || [];
      } catch (err) {
        console.error('Error fetching pricing plans:', err);
        error.value = 'Failed to load pricing plans. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    const sortedPlans = computed(() => {
      return [...plans.value].sort((a, b) => a.duration_months - b.duration_months);
    });

    const getPlanName = (months) => {
      if (months === 1) return 'Monthly Plan';
      if (months === 3) return 'Quarterly Plan';
      if (months === 12) return 'Annual Plan';
      return `${months} Months Plan`;
    };

    const getFeatures = (features) => {
      if (!features) return [];
      try {
        return typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        return [];
      }
    };

    const getSavingsPercent = (months) => {
      const monthlyPlan = plans.value.find(p => p.duration_months === 1);
      const currentPlan = plans.value.find(p => p.duration_months === months);
      
      if (!monthlyPlan || !currentPlan || months === 1) return 0;
      
      const monthlyTotal = monthlyPlan.price * months;
      const savings = ((monthlyTotal - currentPlan.price) / monthlyTotal) * 100;
      
      return Math.round(savings);
    };

    onMounted(() => {
      fetchPlans();
    });

    return {
      plans,
      sortedPlans,
      loading,
      error,
      fetchPlans,
      getPlanName,
      getFeatures,
      getSavingsPercent
    };
  }
}
</script>

<style scoped>
.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4285f4;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
