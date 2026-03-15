<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 py-8 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
    </div>

    <div class="max-w-md w-full relative z-10">
      <!-- Logo/Header with Animation -->
      <div class="text-center mb-8 animate-fade-in-down">
        <div class="relative inline-block mb-6">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-75 animate-pulse-slow"></div>
          <div class="relative bg-white w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <i class="fas fa-chart-line text-5xl bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent"></i>
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Create Account
        </h1>
        <p class="text-lg text-white/90 font-light">Start your journey with us today</p>
      </div>

      <!-- Register Card with Glass Morphism -->
      <div class="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 animate-fade-in-up">
        <!-- Error Message with Animation -->
        <transition name="slide-fade">
          <div v-if="error" class="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl animate-shake">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-500 text-xl mt-0.5"></i>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm text-red-800 font-medium">{{ error }}</p>
              </div>
              <button @click="error = ''" class="flex-shrink-0 ml-3 text-red-400 hover:text-red-600 transition">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </transition>

        <!-- Welcome Message -->
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Get Started</h2>
          <p class="text-gray-600 text-sm">Create your account in seconds</p>
        </div>

        <!-- Google Sign Up Button with Enhanced Design -->
        <button
          @click="handleGoogleSignUp"
          :disabled="loading"
          class="group w-full relative overflow-hidden bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl hover:border-gray-300 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:-translate-y-1 active:translate-y-0"
        >
          <!-- Button Shine Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div class="relative flex items-center justify-center gap-3">
            <!-- Google Logo -->
            <svg class="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            
            <!-- Loading Spinner -->
            <div v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-base">Creating account...</span>
            </div>
            
            <!-- Default Text -->
            <span v-else class="text-base">Sign up with Google</span>
          </div>
        </button>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white/95 text-gray-500 font-medium">Quick & Secure</span>
          </div>
        </div>

        <!-- Benefits List -->
        <div class="space-y-3 mb-8">
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-rocket text-white text-xs"></i>
            </div>
            <span>Get started in under 30 seconds</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-star text-white text-xs"></i>
            </div>
            <span>Access to your dashboard</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-shield-alt text-white text-xs"></i>
            </div>
            <span>Your data is encrypted & protected</span>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="space-y-4">
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <router-link to="/login" class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold transition-all">
                Sign in
              </router-link>
            </p>
          </div>

          <div class="text-center pt-4 border-t border-gray-100">
            <router-link to="/" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors group">
              <i class="fas fa-arrow-left transform group-hover:-translate-x-1 transition-transform"></i>
              <span>Back to Home</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="mt-8 text-center animate-fade-in">
        <p class="text-white/80 text-xs mb-3 font-medium">Trusted by thousands of users worldwide</p>
        <div class="flex items-center justify-center gap-6 text-white/60">
          <div class="flex items-center gap-2">
            <i class="fas fa-check-circle text-green-300"></i>
            <span class="text-xs font-medium">SSL Secured</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-check-circle text-green-300"></i>
            <span class="text-xs font-medium">GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithGoogle } from '../config/firebase';
import { authAPI } from '../services/api';
import { store } from '../store';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref('');

    const handleGoogleSignUp = async () => {
      loading.value = true;
      error.value = '';

      try {
        const result = await signInWithGoogle();
        
        if (!result.success) {
          error.value = result.error;
          loading.value = false;
          return;
        }

        // Register to backend
        const response = await authAPI.register({
          email: result.user.email,
          firebaseUid: result.user.uid,
          idToken: result.idToken
        });

        if (response.success) {
          store.setToken(response.data.token);
          store.setUser(response.data);
          router.push('/profile');
        } else {
          // If user exists, try login
          const loginResponse = await authAPI.login({
            idToken: result.idToken
          });
          
          if (loginResponse.success) {
            store.setToken(loginResponse.data.token);
            store.setUser(loginResponse.data);
            router.push('/dashboard');
          } else {
            error.value = loginResponse.message;
          }
        }
      } catch (err) {
        error.value = err.message || 'Registration failed. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      error,
      handleGoogleSignUp
    };
  }
}
</script>

<style scoped>
/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-30px) translateX(-15px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out 0.2s both;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out 0.4s both;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Transition for error message */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Mobile Responsive Adjustments */
@media (max-width: 640px) {
  .backdrop-blur-xl {
    backdrop-filter: blur(20px);
  }
}

/* Smooth scrolling for mobile */
@media (max-height: 700px) {
  .min-h-screen {
    min-height: 100vh;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>
