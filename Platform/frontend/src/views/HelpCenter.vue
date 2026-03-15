<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary to-purple-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <span class="text-sm font-semibold">📚 Help Center</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-6">How Can We Help You Today?</h1>
        <p class="text-xl text-gray-100 max-w-2xl mx-auto mb-8">
          Browse our help articles, guides, and tutorials
        </p>
        
        <!-- Search Box -->
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search for help articles..." 
              class="w-full px-6 py-4 pl-14 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
            />
            <i class="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <router-link 
            to="/faq"
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i class="fas fa-question-circle text-blue-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">FAQ</h3>
            <p class="text-gray-600 text-sm">Frequently asked questions</p>
          </router-link>

          <router-link 
            to="/documentation"
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i class="fas fa-book text-purple-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Documentation</h3>
            <p class="text-gray-600 text-sm">Complete user guides</p>
          </router-link>

          <router-link 
            to="/contact"
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i class="fas fa-envelope text-green-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Contact Us</h3>
            <p class="text-gray-600 text-sm">Get in touch with support</p>
          </router-link>

          <a 
            href="#"
            class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <div class="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <i class="fas fa-comments text-yellow-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
            <p class="text-gray-600 text-sm">Chat with our team</p>
          </a>
        </div>

        <!-- Popular Topics -->
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Topics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="topic in popularTopics"
              :key="topic.title"
              class="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div class="flex items-start">
                <div :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform',
                  topic.color
                ]">
                  <i :class="topic.icon" class="text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {{ topic.title }}
                  </h3>
                  <p class="text-gray-600 text-sm mb-3">{{ topic.description }}</p>
                  <div class="flex items-center text-primary text-sm font-semibold">
                    <span>{{ topic.articles }} articles</span>
                    <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Getting Started Guide -->
        <div class="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-3xl font-bold mb-4">Getting Started Guide</h2>
              <p class="text-gray-100 text-lg mb-6">
                New to our extension? Follow our step-by-step guide to get up and running in minutes.
              </p>
              <ul class="space-y-3 mb-6">
                <li class="flex items-center">
                  <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-check"></i>
                  </div>
                  <span>Create your account and verify email</span>
                </li>
                <li class="flex items-center">
                  <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-check"></i>
                  </div>
                  <span>Complete KYC verification</span>
                </li>
                <li class="flex items-center">
                  <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-check"></i>
                  </div>
                  <span>Purchase and activate license</span>
                </li>
                <li class="flex items-center">
                  <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-check"></i>
                  </div>
                  <span>Start scraping and analyzing data</span>
                </li>
              </ul>
              <router-link 
                to="/documentation"
                class="inline-block bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition"
              >
                <i class="fas fa-book-open mr-2"></i>Read Full Guide
              </router-link>
            </div>
            <div class="hidden lg:block">
              <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <img src="@/assets/guide-illustration.jpg" alt="Getting Started" class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import { ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'HelpCenter',
  components: { Navbar, Footer },
  setup() {
    const searchQuery = ref('');

    const popularTopics = ref([
      {
        icon: 'fas fa-rocket text-white',
        color: 'bg-blue-500',
        title: 'Getting Started',
        description: 'Learn how to set up and use the extension',
        articles: 12
      },
      {
        icon: 'fas fa-user-check text-white',
        color: 'bg-green-500',
        title: 'Account & KYC',
        description: 'Account management and verification',
        articles: 8
      },
      {
        icon: 'fas fa-credit-card text-white',
        color: 'bg-purple-500',
        title: 'Billing & Payments',
        description: 'Pricing, payments, and subscriptions',
        articles: 10
      },
      {
        icon: 'fas fa-key text-white',
        color: 'bg-yellow-500',
        title: 'License Activation',
        description: 'How to activate and manage licenses',
        articles: 6
      },
      {
        icon: 'fas fa-database text-white',
        color: 'bg-red-500',
        title: 'Data Scraping',
        description: 'Scraping settings and best practices',
        articles: 15
      },
      {
        icon: 'fas fa-brain text-white',
        color: 'bg-indigo-500',
        title: 'AI Features',
        description: 'Using AI-powered analysis tools',
        articles: 9
      }
    ]);

    return {
      searchQuery,
      popularTopics
    };
  }
}
</script>
