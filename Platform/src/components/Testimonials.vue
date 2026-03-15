<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16">
        <span class="text-primary font-semibold text-sm uppercase tracking-wide">Testimonials</span>
        <h2 class="text-4xl font-bold text-gray-900 mb-4 mt-2">What Our Users Say</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Trusted by thousands of advertisers and marketers worldwide
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(testimonial, index) in testimonials" 
          :key="testimonial.name"
          class="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-primary"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <!-- Quote Icon -->
          <div class="mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <i class="fas fa-quote-left text-white text-xl"></i>
            </div>
          </div>

          <!-- Stars -->
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400 text-lg">
              <i v-for="n in 5" :key="n" class="fas fa-star mr-1"></i>
            </div>
            <span class="ml-2 text-sm text-gray-600 font-semibold">5.0</span>
          </div>

          <!-- Testimonial Text -->
          <p class="text-gray-700 mb-6 leading-relaxed text-base">
            "{{ testimonial.text }}"
          </p>

          <!-- User Info -->
          <div class="flex items-center pt-6 border-t border-gray-100">
            <div class="relative">
              <div class="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {{ testimonial.name.charAt(0) }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div class="ml-4">
              <div class="font-bold text-gray-900 text-lg">{{ testimonial.name }}</div>
              <div class="text-gray-600 text-sm">{{ testimonial.role }}</div>
              <div class="text-primary text-xs font-semibold mt-1">
                <i class="fas fa-check-circle mr-1"></i>Verified User
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="mt-16 pt-12 border-t border-gray-200">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
          <div class="text-center">
            <div class="text-3xl font-bold text-primary mb-1">10,000+</div>
            <div class="text-sm text-gray-600">Active Users</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary mb-1">4.9/5</div>
            <div class="text-sm text-gray-600">Average Rating</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary mb-1">50M+</div>
            <div class="text-sm text-gray-600">Ads Analyzed</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary mb-1">99.9%</div>
            <div class="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Testimonials',
  setup() {
    const testimonials = ref([
      {
        name: 'Sarah Johnson',
        role: 'Marketing Director at TechCorp',
        text: 'This extension has completely transformed how we analyze competitor ads. The AI-powered insights are invaluable and have helped us optimize our campaigns by 45%!'
      },
      {
        name: 'Michael Chen',
        role: 'Digital Marketing Manager',
        text: 'Easy to use and incredibly powerful. We\'ve optimized our ad spend by 40% using this tool. The real-time data scraping feature is a game-changer for our team.'
      },
      {
        name: 'Emily Rodriguez',
        role: 'Business Analyst at AdVenture',
        text: 'The data comparison features and AI analysis are exactly what we needed. The ROI estimator alone has saved us thousands of dollars. Highly recommended!'
      }
    ]);

    return { testimonials };
  }
}
</script>
