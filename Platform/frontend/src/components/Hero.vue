<template>
  <section class="gradient-bg text-white py-20 lg:py-32 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="animate-fade-in text-center lg:text-left">
          <div class="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span class="text-sm font-semibold">🚀 AI-Powered Ad Intelligence</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Unlock Google Ads
            <span class="text-yellow-300">Transparency</span>
          </h1>
          
          <p class="text-lg sm:text-xl mb-8 text-gray-100 leading-relaxed">
            Scrape, analyze, and compare Google Ads data with AI-powered insights. 
            Make data-driven decisions with comprehensive ad intelligence.
          </p>
          
          <!-- ✅ UPDATED: Button Group with Download -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <router-link 
              to="/register" 
              class="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <i class="fas fa-rocket mr-2"></i>Get Started Free
            </router-link>
            
            <!-- ✅ NEW: Download Extension Button -->
            <button
              @click="downloadExtension"
              :disabled="downloading"
              class="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <i :class="downloading ? 'fas fa-spinner fa-spin' : 'fas fa-download'" class="mr-2"></i>
              {{ downloading ? 'Downloading...' : 'Download Extension' }}
            </button>
            
            <a 
              href="#how-it-works" 
              class="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition text-center"
            >
              <i class="fas fa-play-circle mr-2"></i>See How It Works
            </a>
          </div>

          <!-- ✅ NEW: Download Info -->
          <div class="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-200">
            <div class="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
              <i class="fab fa-chrome text-yellow-300 mr-2"></i>
              <span>Chrome Extension</span>
            </div>
            <div class="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
              <i class="fas fa-shield-alt text-green-300 mr-2"></i>
              <span>100% Secure</span>
            </div>
            <div class="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
              <i class="fas fa-star text-yellow-300 mr-2"></i>
              <span>Version 1.0.0</span>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left">
            <div>
              <div class="text-3xl sm:text-4xl font-bold text-yellow-300">10K+</div>
              <div class="text-sm sm:text-base text-gray-200">Active Users</div>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-bold text-yellow-300">50M+</div>
              <div class="text-sm sm:text-base text-gray-200">Ads Analyzed</div>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-bold text-yellow-300">99.9%</div>
              <div class="text-sm sm:text-base text-gray-200">Accuracy</div>
            </div>
          </div>
        </div>
        
        <!-- Right Content - Extension Preview -->
        <div class="animate-fade-in-delay">
          <div class="relative">
            <!-- Extension Window Mockup -->
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <!-- Extension Header -->
              <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <i class="fas fa-chart-line text-white text-xl"></i>
                  <span class="text-white font-bold">L2G ADS</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="bg-green-400 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    ✓ License Active
                  </span>
                </div>
              </div>
              
              <!-- Extension Body -->
              <div class="p-6 bg-gray-50">
                <div class="space-y-4">
                  <!-- Delay Setting -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Delay (ms)</label>
                    <input type="text" value="2000" class="w-full px-4 py-2 border border-gray-300 rounded-lg" readonly>
                  </div>
                  
                  <!-- Max Ads -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Max Ads</label>
                    <input type="text" value="100" class="w-full px-4 py-2 border border-gray-300 rounded-lg" readonly>
                  </div>
                  
                  <!-- Mode Toggle -->
                  <div class="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                    <span class="font-semibold text-gray-700">Mode: Local</span>
                    <div class="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="grid grid-cols-2 gap-3 mt-4">
                    <button class="bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                      <i class="fas fa-play mr-2"></i>Start
                    </button>
                    <button class="bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
                      <i class="fas fa-pause mr-2"></i>Pause
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Floating Stats -->
            <div class="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow">
              <div class="text-sm text-gray-600">Ads Collected</div>
              <div class="text-2xl font-bold text-primary">1,247</div>
            </div>

            <!-- ✅ NEW: Download Badge -->
            <div class="absolute -top-4 -left-4 bg-green-500 text-white rounded-full p-3 shadow-lg animate-pulse">
              <i class="fas fa-download text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ NEW: Success Notification (appears after download) -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showNotification"
        class="fixed bottom-8 right-8 bg-white text-gray-800 px-6 py-4 rounded-lg shadow-2xl z-50 max-w-md"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-500 text-2xl"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-bold text-gray-900">Download Started!</h3>
            <p class="text-sm text-gray-600 mt-1">
              Extension file is downloading. Check your downloads folder.
            </p>
            <router-link 
              to="/documentation" 
              class="text-sm text-primary hover:underline mt-2 inline-block"
            >
              View Installation Guide →
            </router-link>
          </div>
          <button @click="showNotification = false" class="ml-4 text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Hero',
  setup() {
    const downloading = ref(false);
    const showNotification = ref(false);

    const downloadExtension = () => {
      downloading.value = true;
      
      // Path to your extension file in public/assets folder
      const fileUrl = '/assets/google-ads-transparency-extension.zip';
      const fileName = 'google-ads-transparency-extension.zip';
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up and show notification
      setTimeout(() => {
        document.body.removeChild(link);
        downloading.value = false;
        showNotification.value = true;
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          showNotification.value = false;
        }, 5000);
      }, 1000);
    };

    return {
      downloading,
      showNotification,
      downloadExtension
    };
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-delay {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in-delay 0.8s ease-out 0.3s both;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
