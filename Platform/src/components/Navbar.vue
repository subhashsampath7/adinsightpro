<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a @click.prevent="goToHome" href="/" class="flex items-center space-x-2 cursor-pointer">
            <i class="fas fa-chart-line text-primary text-2xl"></i>
            <span class="text-xl font-bold text-gray-800">Google Ads Transparency</span>
          </a>
        </div>
        
        <div class="hidden md:flex items-center space-x-8">
          <a @click.prevent="goToHome" href="/" class="text-gray-700 hover:text-primary transition cursor-pointer">
            Home
          </a>
          
          <a @click.prevent="scrollToSection('features')" href="#features" class="text-gray-700 hover:text-primary transition cursor-pointer">
            Features
          </a>
          <a @click.prevent="scrollToSection('pricing')" href="#pricing" class="text-gray-700 hover:text-primary transition cursor-pointer">
            Pricing
          </a>

          <!-- ✅ NEW: Help Dropdown Menu -->
          <div class="relative" @mouseenter="helpMenuOpen = true" @mouseleave="helpMenuOpen = false">
            <button class="text-gray-700 hover:text-primary transition flex items-center">
              Help
              <i class="fas fa-chevron-down ml-1 text-xs"></i>
            </button>
            
            <!-- Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div v-show="helpMenuOpen" class="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                <router-link 
                  to="/documentation" 
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition"
                >
                  <i class="fas fa-book text-primary w-5"></i>
                  <div class="ml-3">
                    <div class="font-semibold">Documentation</div>
                    <div class="text-xs text-gray-500">Complete user guide</div>
                  </div>
                </router-link>
                
                <router-link 
                  to="/help-center" 
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition"
                >
                  <i class="fas fa-life-ring text-green-500 w-5"></i>
                  <div class="ml-3">
                    <div class="font-semibold">Help Center</div>
                    <div class="text-xs text-gray-500">Get support</div>
                  </div>
                </router-link>
                
                <router-link 
                  to="/faq" 
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition"
                >
                  <i class="fas fa-question-circle text-yellow-500 w-5"></i>
                  <div class="ml-3">
                    <div class="font-semibold">FAQ</div>
                    <div class="text-xs text-gray-500">Common questions</div>
                  </div>
                </router-link>
                
                <router-link 
                  to="/contact" 
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition"
                >
                  <i class="fas fa-envelope text-purple-500 w-5"></i>
                  <div class="ml-3">
                    <div class="font-semibold">Contact Us</div>
                    <div class="text-xs text-gray-500">Send us a message</div>
                  </div>
                </router-link>
              </div>
            </transition>
          </div>
          
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="text-gray-700 hover:text-primary transition">Login</router-link>
            <router-link to="/register" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Get Started
            </router-link>
          </template>
          
          <template v-else>
            <router-link to="/dashboard" class="text-gray-700 hover:text-primary transition">Dashboard</router-link>
            <button @click="handleLogout" class="text-gray-700 hover:text-primary transition">
              <i class="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </template>
        </div>
        
        <div class="md:hidden flex items-center">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700">
            <i class="fas text-2xl" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a @click.prevent="goToHome" href="/" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
          Home
        </a>
        
        <a @click.prevent="scrollToSection('features')" href="#features" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
          Features
        </a>
        <a @click.prevent="scrollToSection('pricing')" href="#pricing" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
          Pricing
        </a>

        <!-- ✅ NEW: Mobile Help Menu -->
        <div class="border-t border-gray-200 pt-2 mt-2">
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Help & Support
          </div>
          
          <router-link 
            to="/documentation" 
            @click="mobileMenuOpen = false"
            class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <i class="fas fa-book text-primary w-5 mr-2"></i>
            Documentation
          </router-link>
          
          <router-link 
            to="/help-center" 
            @click="mobileMenuOpen = false"
            class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <i class="fas fa-life-ring text-green-500 w-5 mr-2"></i>
            Help Center
          </router-link>
          
          <router-link 
            to="/faq" 
            @click="mobileMenuOpen = false"
            class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <i class="fas fa-question-circle text-yellow-500 w-5 mr-2"></i>
            FAQ
          </router-link>
          
          <router-link 
            to="/contact" 
            @click="mobileMenuOpen = false"
            class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <i class="fas fa-envelope text-purple-500 w-5 mr-2"></i>
            Contact Us
          </router-link>
        </div>
        
        <template v-if="!isAuthenticated">
          <router-link to="/login" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Login</router-link>
          <router-link to="/register" class="block px-3 py-2 bg-primary text-white rounded">Get Started</router-link>
        </template>
        
        <template v-else>
          <router-link to="/dashboard" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Dashboard</router-link>
          <button @click="handleLogout" class="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Logout</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { store } from '../store';
import { signOutUser } from '../config/firebase';

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const mobileMenuOpen = ref(false);
    const helpMenuOpen = ref(false); // ✅ NEW: Help menu state
    const isAuthenticated = computed(() => store.isAuthenticated);

    const handleLogout = async () => {
      await signOutUser();
      store.logout();
      router.push('/');
    };

    const goToHome = () => {
      mobileMenuOpen.value = false;
      helpMenuOpen.value = false; // ✅ Close help menu

      if (route.path !== '/') {
        router.push('/').then(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const scrollToSection = (sectionId) => {
      mobileMenuOpen.value = false;
      helpMenuOpen.value = false; // ✅ Close help menu

      if (route.path !== '/') {
        router.push('/').then(() => {
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    return {
      mobileMenuOpen,
      helpMenuOpen, // ✅ NEW
      isAuthenticated,
      handleLogout,
      goToHome,
      scrollToSection
    };
  }
}
</script>
