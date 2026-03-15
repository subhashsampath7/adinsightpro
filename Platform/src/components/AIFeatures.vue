<template>
  <section class="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16">
        <span class="text-yellow-300 font-semibold text-sm uppercase tracking-wide">AI-Powered</span>
        <h2 class="text-4xl font-bold mb-4 mt-2">Intelligent Analysis Features</h2>
        <p class="text-xl text-gray-200 max-w-2xl mx-auto">
          Leverage artificial intelligence to gain deeper insights from your ad data
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in aiFeatures" 
          :key="feature.title"
          class="group bg-white/10 backdrop-blur-lg p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-yellow-300 cursor-pointer transform hover:-translate-y-2"
        >
          <!-- Icon -->
          <div class="mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <i :class="feature.icon"></i>
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-2xl font-bold mb-3 group-hover:text-yellow-300 transition-colors">
            {{ feature.title }}
          </h3>
          <p class="text-gray-200 leading-relaxed mb-4">{{ feature.description }}</p>

          <!-- Features List -->
          <ul class="space-y-2">
            <li v-for="item in feature.items" :key="item" class="flex items-start text-sm text-gray-300">
              <i class="fas fa-check-circle text-green-400 mr-2 mt-1 flex-shrink-0"></i>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- AI Demo Section -->
      <div class="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-3xl font-bold mb-4">
              <i class="fas fa-brain text-yellow-300 mr-3"></i>Ask AI Anything
            </h3>
            <p class="text-gray-200 text-lg mb-6">
              Our AI assistant can answer custom questions about your scraped data, 
              provide recommendations, and help you make data-driven decisions.
            </p>
            <div class="space-y-3">
              <div class="bg-white/10 rounded-lg p-4 border-l-4 border-yellow-300">
                <p class="text-sm text-gray-300">"Which advertisers spent the most last month?"</p>
              </div>
              <div class="bg-white/10 rounded-lg p-4 border-l-4 border-green-300">
                <p class="text-sm text-gray-300">"What are the trending ad formats in my industry?"</p>
              </div>
              <div class="bg-white/10 rounded-lg p-4 border-l-4 border-blue-300">
                <p class="text-sm text-gray-300">"Predict my competitor's next campaign strategy"</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl">
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user text-primary"></i>
                </div>
                <div class="bg-white rounded-lg p-4 flex-1">
                  <p class="text-gray-800 text-sm">Analyze competitor spending trends</p>
                </div>
              </div>

              <div class="flex items-start space-x-3 justify-end">
                <div class="bg-yellow-300 rounded-lg p-4 flex-1">
                  <p class="text-gray-900 text-sm font-semibold">
                    <i class="fas fa-robot mr-2"></i>AI Analysis:
                  </p>
                  <p class="text-gray-800 text-sm mt-2">
                    Based on the data, your top 3 competitors increased spending by 35% in Q4. 
                    Recommended action: Increase budget by 20% to maintain market share.
                  </p>
                </div>
                <div class="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-robot text-purple-900"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AIFeatures',
  setup() {
    const aiFeatures = ref([
      {
        icon: 'fas fa-globe',
        title: 'Market Overview',
        description: 'Get comprehensive market analysis and identify emerging trends in your industry.',
        items: [
          'Industry trend analysis',
          'Market size estimation',
          'Growth predictions',
          'Seasonal patterns'
        ]
      },
      {
        icon: 'fas fa-users',
        title: 'Competitor Analysis',
        description: 'Deep dive into specific competitors and understand their advertising strategies.',
        items: [
          'Spending patterns',
          'Ad creative analysis',
          'Target audience insights',
          'Campaign performance'
        ]
      },
      {
        icon: 'fas fa-bullhorn',
        title: 'Campaign Optimizer',
        description: 'Get AI-powered recommendations to optimize your advertising campaigns.',
        items: [
          'Budget allocation',
          'Targeting suggestions',
          'Creative recommendations',
          'Timing optimization'
        ]
      },
      {
        icon: 'fas fa-chart-line',
        title: 'Trend Prediction',
        description: 'Forecast future market movements and stay ahead of the competition.',
        items: [
          'Spending forecasts',
          'Market shift predictions',
          'Opportunity identification',
          'Risk assessment'
        ]
      },
      {
        icon: 'fas fa-dollar-sign',
        title: 'ROI Estimator',
        description: 'Calculate potential returns and make data-driven investment decisions.',
        items: [
          'Campaign ROI calculation',
          'Budget recommendations',
          'Performance benchmarking',
          'Cost optimization'
        ]
      },
      {
        icon: 'fas fa-comments',
        title: 'Ask AI Anything',
        description: 'Get custom answers about your data with our intelligent AI assistant.',
        items: [
          'Natural language queries',
          'Custom data analysis',
          'Actionable insights',
          'Real-time responses'
        ]
      }
    ]);

    return { aiFeatures };
  }
}
</script>

<style scoped>
.delay-1000 {
  animation-delay: 1s;
}
</style>
