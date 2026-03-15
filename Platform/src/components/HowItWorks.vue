<template>
  <section id="how-it-works" class="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="text-primary font-semibold text-sm uppercase tracking-wide">How It Works</span>
        <h2 class="text-4xl font-bold text-gray-900 mb-4 mt-2">Get Started in 5 Simple Steps</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          From registration to AI-powered insights in minutes
        </p>
      </div>

      <div class="relative">
        <!-- Connection Line (Desktop) -->
        <div class="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary transform -translate-y-1/2 z-0"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
          <div 
            v-for="(step, index) in steps" 
            :key="step.number"
            class="relative"
          >
            <!-- Step Card -->
            <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary">
              <!-- Step Number -->
              <div class="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div class="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {{ step.number }}
                </div>
              </div>

              <!-- Icon -->
              <div class="mt-8 mb-4 text-center">
                <div class="inline-block p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <i :class="step.icon" class="text-4xl text-primary"></i>
                </div>
              </div>

              <!-- Content -->
              <h3 class="text-lg font-bold text-gray-900 mb-2 text-center">{{ step.title }}</h3>
              <p class="text-sm text-gray-600 text-center leading-relaxed">{{ step.description }}</p>

              <!-- Time Estimate -->
              <div class="mt-4 text-center">
                <span class="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <i class="fas fa-clock mr-1"></i>{{ step.time }}
                </span>
              </div>
            </div>

            <!-- Arrow (Desktop) -->
            <div v-if="index < steps.length - 1" class="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
              <i class="fas fa-arrow-right text-primary text-2xl animate-pulse"></i>
            </div>

            <!-- Arrow (Mobile) -->
            <div v-if="index < steps.length - 1" class="lg:hidden flex justify-center my-4">
              <i class="fas fa-arrow-down text-primary text-2xl animate-bounce"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="text-center mt-16">
        <router-link 
          to="/register" 
          class="inline-block bg-gradient-to-r from-primary to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <i class="fas fa-rocket mr-2"></i>Start Your Journey Now
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'HowItWorks',
  setup() {
    const steps = ref([
      {
        number: 1,
        icon: 'fas fa-user-plus',
        title: 'Create Account',
        description: 'Sign up for free and complete your profile with basic information.',
        time: '2 mins'
      },
      {
        number: 2,
        icon: 'fas fa-id-card',
        title: 'KYC Verification',
        description: 'Submit KYC documents for verification to ensure security.',
        time: '5 mins'
      },
      {
        number: 3,
        icon: 'fas fa-shopping-cart',
        title: 'Purchase License',
        description: 'Choose a plan and get your license key instantly after payment.',
        time: '3 mins'
      },
      {
        number: 4,
        icon: 'fas fa-key',
        title: 'Activate Extension',
        description: 'Install the extension and activate it with your license key.',
        time: '2 mins'
      },
      {
        number: 5,
        icon: 'fas fa-chart-bar',
        title: 'Start Scraping',
        description: 'Configure settings, start scraping, and get AI-powered insights.',
        time: '1 min'
      }
    ]);

    return { steps };
  }
}
</script>
