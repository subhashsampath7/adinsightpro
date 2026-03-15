<template>
  <footer class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
        <!-- Company Info -->
        <div class="lg:col-span-1">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-chart-line text-white text-xl"></i>
            </div>
            <span class="text-xl font-bold">L2G ADS</span>
          </div>
          <p class="text-gray-400 leading-relaxed mb-6">
            Make better advertising decisions with powerful AI-powered data analysis tools for Google Ads Transparency.
          </p>
          <!-- Social Links -->
          <div class="flex space-x-4">
            <a 
              href="#" 
              class="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              aria-label="Twitter"
            >
              <i class="fab fa-twitter"></i>
            </a>
            <a 
              href="#" 
              class="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              aria-label="Facebook"
            >
              <i class="fab fa-facebook"></i>
            </a>
            <a 
              href="#" 
              class="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <i class="fab fa-linkedin"></i>
            </a>
            <a 
              href="#" 
              class="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>
        
        <!-- Product Links -->
        <div>
          <h3 class="text-lg font-bold mb-6 flex items-center">
            <i class="fas fa-box text-primary mr-2"></i>Product
          </h3>
          <ul class="space-y-3">
            <li>
              <a href="#features" class="text-gray-400 hover:text-white transition-colors flex items-center group">
                <i class="fas fa-chevron-right text-primary text-xs mr-2 transform group-hover:translate-x-1 transition-transform"></i>
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" class="text-gray-400 hover:text-white transition-colors flex items-center group">
                <i class="fas fa-chevron-right text-primary text-xs mr-2 transform group-hover:translate-x-1 transition-transform"></i>
                Pricing
              </a>
            </li>
            <li>
              <a href="#how-it-works" class="text-gray-400 hover:text-white transition-colors flex items-center group">
                <i class="fas fa-chevron-right text-primary text-xs mr-2 transform group-hover:translate-x-1 transition-transform"></i>
                How It Works
              </a>
            </li>
            <li>
              <router-link to="/register" class="text-gray-400 hover:text-white transition-colors flex items-center group">
                <i class="fas fa-chevron-right text-primary text-xs mr-2 transform group-hover:translate-x-1 transition-transform"></i>
                Get Started
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Support Links -->
        <div>
          <h3 class="text-lg font-bold mb-6 flex items-center">
            <i class="fas fa-headset text-primary mr-2"></i>Support
          </h3>
          <ul class="space-y-3">
            <li>
              <router-link to="/documentation" class="text-gray-400 hover:text-white transition-colors flex items-center group">
                <i class="fas fa-chevron-right text-primary text-xs mr-2 transform group-hover:translate-x-1 transition-transform"></i>
                Documentation
              </router-link>
            </li>
            <li>
              <router-link to="/help-center" class="text-gray-400 hover:text-white transition-colors flex items-center group">
                <i class="fas fa-chevron-right text-primary text-xs mr-2 transform group-hover:translate-x-1 transition-transform"></i>
                Help Center
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-gray-400 hover:text-white transition-colors flex items-center group">
                <i class="fas fa-chevron-right text-primary text-xs mr-2 transform group-hover:translate-x-1 transition-transform"></i>
                Contact Us
              </router-link>
            </li>
            <li>
              <router-link to="/faq" class="text-gray-400 hover:text-white transition-colors flex items-center group">
                <i class="fas fa-chevron-right text-primary text-xs mr-2 transform group-hover:translate-x-1 transition-transform"></i>
                FAQ
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-bold mb-6 flex items-center">
            <i class="fas fa-envelope text-primary mr-2"></i>Stay Updated
          </h3>
          <p class="text-gray-400 text-sm mb-4">
            Subscribe to our newsletter for updates and tips.
          </p>
          <form class="space-y-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition-colors text-white placeholder-gray-500"
            />
            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-primary hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              <i class="fas fa-paper-plane mr-2"></i>Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="text-gray-400 text-sm text-center md:text-left">
            <p>&copy; 2026 Google Ads Transparency Extension. All rights reserved.</p>
          </div>
          <div class="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
