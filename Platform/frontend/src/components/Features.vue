<template>
  <section id="features" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="text-primary font-semibold text-sm uppercase tracking-wide">Features</span>
        <h2 class="text-4xl font-bold text-gray-900 mb-4 mt-2">Powerful Extension Features</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to scrape and analyze Google Ads data effectively
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="feature.title"
          class="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary cursor-pointer transform hover:-translate-y-2"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="mb-6 relative">
            <div class="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <i :class="feature.icon"></i>
            </div>
            <div class="absolute top-0 left-0 w-16 h-16 bg-primary opacity-20 rounded-2xl blur-xl group-hover:opacity-40 transition-opacity"></div>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
          
          <!-- Feature Badge -->
          <div v-if="feature.badge" class="mt-4">
            <span class="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              {{ feature.badge }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Features',
  setup() {
    const features = ref([
      {
        icon: 'fas fa-robot',
        title: 'Automated Data Scraping',
        description: 'Automatically scrape ad data from Google Ads Transparency Center with customizable delay and batch settings.',
        badge: 'Core Feature'
      },
      {
        icon: 'fas fa-chart-line',
        title: 'Real-time Analytics Dashboard',
        description: 'View comprehensive analytics including spend ranges, impressions, display days, and advertiser details in real-time.',
        badge: 'Popular'
      },
      {
        icon: 'fas fa-filter',
        title: 'Advanced Filtering',
        description: 'Filter ads by advertiser, domain, spending, time period, and more to find exactly what you need.',
      },
      {
        icon: 'fas fa-download',
        title: 'Export to Excel',
        description: 'Export your scraped data to Excel format for further analysis, reporting, and presentations.',
      },
      {
        icon: 'fas fa-server',
        title: 'Local & Server Mode',
        description: 'Choose between local processing with Windows app or server-based processing for flexibility.',
      },
      {
        icon: 'fas fa-brain',
        title: 'AI-Powered Insights',
        description: 'Get intelligent market analysis, competitor insights, campaign optimization, and trend predictions.',
        badge: 'AI Feature'
      }
    ]);

    return { features };
  }
}
</script>
