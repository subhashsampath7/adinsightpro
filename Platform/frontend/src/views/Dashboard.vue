<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- ✅ LOADING STATE -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p class="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
      </div>

      <!-- ✅ ERROR STATE -->
      <div v-else-if="error" class="bg-red-50 border-2 border-red-500 rounded-lg p-8 text-center">
        <i class="fas fa-exclamation-triangle text-red-600 text-5xl mb-4"></i>
        <h2 class="text-2xl font-bold text-red-800 mb-2">Failed to Load Dashboard</h2>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button 
          @click="loadDashboard" 
          class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold">
          <i class="fas fa-redo mr-2"></i>Retry
        </button>
      </div>

      <!-- ✅ IF ACCOUNT SUSPENDED - SHOW ONLY THIS -->
      <div v-else-if="user?.is_active === 0 || user?.is_active === false">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-2">Welcome back, {{ user?.first_name || 'User' }}!</p>
        </div>

        <!-- ACCOUNT SUSPENDED ALERT (FULL SCREEN) -->
        <div class="bg-red-100 border-2 border-red-500 rounded-lg p-8 shadow-lg">
          <div class="flex flex-col items-center text-center">
            <div class="bg-red-200 rounded-full p-6 mb-6">
              <i class="fas fa-ban text-red-600 text-6xl"></i>
            </div>
            
            <h2 class="text-4xl font-bold text-red-800 mb-4">
              Account Suspended
            </h2>
            
            <p class="text-red-700 text-lg font-semibold mb-6 max-w-2xl">
              Your account has been suspended by the administrator. You cannot access dashboard features until your account is reactivated.
            </p>
            
            <!-- Suspension Reason Box -->
            <div v-if="user?.suspension_reason" 
                 class="bg-white border-2 border-red-300 rounded-lg p-6 mb-6 w-full max-w-2xl">
              <p class="text-base font-bold text-red-800 mb-3 flex items-center justify-center">
                <i class="fas fa-info-circle mr-2"></i>Reason for Suspension
              </p>
              <p class="text-gray-900 text-lg leading-relaxed">{{ user.suspension_reason }}</p>
            </div>

            <!-- Restrictions List -->
            <div class="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6 w-full max-w-2xl">
              <p class="font-bold text-red-800 mb-4 text-lg flex items-center justify-center">
                <i class="fas fa-lock mr-2"></i>Account Restrictions
              </p>
              <ul class="text-red-700 text-left space-y-2 max-w-md mx-auto">
                <li class="flex items-start">
                  <i class="fas fa-times-circle mt-1 mr-3 flex-shrink-0"></i>
                  <span>Cannot access dashboard features</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-times-circle mt-1 mr-3 flex-shrink-0"></i>
                  <span>Cannot purchase new license keys</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-times-circle mt-1 mr-3 flex-shrink-0"></i>
                  <span>Cannot use existing license keys</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-times-circle mt-1 mr-3 flex-shrink-0"></i>
                  <span>Cannot submit KYC verifications</span>
                </li>
                <li class="flex items-start">
                  <i class="fas fa-times-circle mt-1 mr-3 flex-shrink-0"></i>
                  <span>Limited access to account features</span>
                </li>
              </ul>
            </div>

            <!-- Contact Support -->
            <div class="flex flex-col items-center space-y-4">
              <a href="mailto:support@googleadstransparency.com" 
                 class="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg inline-flex items-center shadow-lg">
                <i class="fas fa-envelope mr-3"></i>Contact Support
              </a>
              <p class="text-red-700 text-base max-w-md">
                If you believe this is a mistake or would like to appeal this suspension, please contact our support team immediately.
              </p>
            </div>

            <!-- Quick Links (Limited) -->
            <div class="mt-8 pt-8 border-t-2 border-red-300 w-full max-w-2xl">
              <p class="text-gray-700 font-semibold mb-4">You can still access:</p>
              <div class="flex justify-center space-x-4">
                <router-link 
                  to="/profile" 
                  class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold inline-flex items-center">
                  <i class="fas fa-user mr-2"></i>My Profile
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ IF ACCOUNT ACTIVE - SHOW FULL DASHBOARD -->
      <div v-else>
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-2">Welcome back, {{ user?.first_name || 'User' }}!</p>
        </div>

        <!-- Profile Completion Alert -->
        <div v-if="!user?.profile_completed" 
             class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <i class="fas fa-exclamation-triangle text-yellow-400 text-xl mr-3"></i>
            <div>
              <p class="font-semibold text-yellow-800">Complete Your Profile</p>
              <p class="text-yellow-700 text-sm mt-1">Please complete your profile to access all features.</p>
              <router-link to="/profile" class="text-yellow-800 font-semibold hover:underline text-sm mt-2 inline-block">
                Complete Now <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- KYC Pending/Submitted Alert -->
        <div v-if="user?.profile_completed && (user?.kyc_status === 'pending' || user?.kyc_status === 'submitted')" 
             class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div class="flex">
            <i class="fas fa-id-card text-blue-400 text-xl mr-3"></i>
            <div class="flex-1">
              <p class="font-semibold text-blue-800">
                {{ user?.kyc_status === 'submitted' ? 'KYC Under Review' : 'KYC Verification Required' }}
              </p>
              <p class="text-blue-700 text-sm mt-1">
                {{ user?.kyc_status === 'submitted' 
                   ? 'Your KYC documents are being reviewed. You will be notified once approved.' 
                   : 'Complete KYC verification to purchase license keys.' }}
              </p>
              <router-link v-if="user?.kyc_status === 'pending'" 
                          to="/kyc" 
                          class="text-blue-800 font-semibold hover:underline text-sm mt-2 inline-block">
                Verify Now <i class="fas fa-arrow-right ml-1"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- KYC DECLINED Alert with Reason -->
        <div v-if="user?.kyc_status === 'declined'" 
             class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div class="flex">
            <i class="fas fa-times-circle text-red-400 text-xl mr-3"></i>
            <div class="flex-1">
              <p class="font-semibold text-red-800">KYC Verification Declined</p>
              <p class="text-red-700 text-sm mt-1">
                Your KYC verification was declined. Please review the reason below and resubmit.
              </p>
              
              <!-- Decline Reason Box -->
              <div v-if="user?.kyc_decline_reason" 
                   class="bg-white border border-red-200 rounded-lg p-4 mt-3">
                <p class="text-sm font-semibold text-gray-700 mb-2">
                  <i class="fas fa-info-circle text-red-500 mr-2"></i>Decline Reason:
                </p>
                <p class="text-gray-800">{{ user.kyc_decline_reason }}</p>
              </div>

              <router-link to="/kyc" 
                          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold mt-4 inline-block">
                <i class="fas fa-redo mr-2"></i>Resubmit KYC
              </router-link>
            </div>
          </div>
        </div>

        <!-- KYC Verified Success -->
        <div v-if="user?.kyc_status === 'verified'" 
             class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div class="flex">
            <i class="fas fa-check-circle text-green-400 text-xl mr-3"></i>
            <div>
              <p class="font-semibold text-green-800">KYC Verified</p>
              <p class="text-green-700 text-sm mt-1">Your account is fully verified. You can now purchase license keys.</p>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Active Licenses</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ dashboardData?.activeLicenses?.length || 0 }}</p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <i class="fas fa-key text-green-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Pending Payments</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ dashboardData?.pendingPayments?.length || 0 }}</p>
              </div>
              <div class="bg-yellow-100 rounded-full p-3">
                <i class="fas fa-clock text-yellow-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Account Status</p>
                <p class="text-xl font-bold text-green-600 mt-2">ACTIVE</p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <i class="fas fa-check-circle text-green-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm">Your UID</p>
                <p class="text-2xl font-bold text-gray-900 mt-2">{{ user?.uid }}</p>
              </div>
              <div class="bg-purple-100 rounded-full p-3">
                <i class="fas fa-fingerprint text-purple-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <router-link 
            to="/purchase" 
            class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
            :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': user?.kyc_status !== 'verified' }"
          >
            <i class="fas fa-shopping-cart text-3xl mb-3"></i>
            <h3 class="text-xl font-bold mb-2">Purchase License</h3>
            <p class="text-blue-100">Get a new license key</p>
            <p v-if="user?.kyc_status !== 'verified'" class="text-xs text-blue-200 mt-2">
              <i class="fas fa-lock mr-1"></i>Requires KYC verification
            </p>
          </router-link>

          <router-link 
            to="/my-keys" 
            class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <i class="fas fa-key text-3xl mb-3"></i>
            <h3 class="text-xl font-bold mb-2">My License Keys</h3>
            <p class="text-green-100">View and manage keys</p>
          </router-link>

          <router-link 
            to="/profile" 
            class="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <i class="fas fa-user text-3xl mb-3"></i>
            <h3 class="text-xl font-bold mb-2">My Profile</h3>
            <p class="text-purple-100">View profile details</p>
          </router-link>
        </div>

        <!-- Active Licenses -->
        <div v-if="dashboardData?.activeLicenses?.length > 0" class="bg-white rounded-lg shadow mb-8">
          <div class="px-6 py-4 border-b">
            <h2 class="text-xl font-bold text-gray-900">Active Licenses</h2>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-3 px-4">License Key</th>
                    <th class="text-left py-3 px-4">Plan</th>
                    <th class="text-left py-3 px-4">Expires At</th>
                    <th class="text-left py-3 px-4">Days Left</th>
                    <th class="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="license in dashboardData.activeLicenses" :key="license.id" class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4 font-mono">{{ license.license_key }}</td>
                    <td class="py-3 px-4">{{ license.duration_months }} month(s)</td>
                    <td class="py-3 px-4">{{ formatDate(license.expires_at) }}</td>
                    <td class="py-3 px-4">
                      <span :class="getDaysLeftColor(calculateDaysLeft(license.expires_at))">
                        {{ calculateDaysLeft(license.expires_at) }} days
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-3 py-1 rounded-full text-sm" :class="getStatusColor(license.status)">
                        {{ license.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { userAPI } from '../services/api';
import { store } from '../store';
import { formatDate, getStatusColor, getDaysRemaining } from '../utils/helpers';

export default {
  name: 'Dashboard',
  components: { Navbar, Footer },
  setup() {
    const router = useRouter();
    const dashboardData = ref(null);
    const loading = ref(true); // ✅ Loading state
    const error = ref(''); // ✅ Error state
    const user = computed(() => store.user);

    const loadDashboard = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const response = await userAPI.getDashboard();
        
        if (response.success) {
          dashboardData.value = response.data;
          store.setUser(response.data.user);
          
          // Debug logs
          console.log('📊 Dashboard loaded successfully');
          console.log('👤 User:', response.data.user);
          console.log('✅ Is Active:', response.data.user.is_active);
          console.log('🔐 KYC Status:', response.data.user.kyc_status);
          
          if (response.data.user.is_active === 0 || response.data.user.is_active === false) {
            console.log('⚠️ Account is suspended');
            console.log('📝 Suspension Reason:', response.data.user.suspension_reason);
          }
        }
      } catch (err) {
        console.error('❌ Failed to load dashboard:', err);
        error.value = err.message || 'Failed to load dashboard data. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const calculateDaysLeft = (expiryDate) => {
      return getDaysRemaining(expiryDate);
    };

    const getDaysLeftColor = (days) => {
      if (days <= 5) return 'text-red-600 font-bold';
      if (days <= 15) return 'text-yellow-600 font-bold';
      return 'text-green-600 font-bold';
    };

    onMounted(() => {
      loadDashboard();
    });

    return {
      dashboardData,
      user,
      loading, // ✅ Return loading
      error, // ✅ Return error
      loadDashboard, // ✅ Return function for retry
      formatDate,
      getStatusColor,
      calculateDaysLeft,
      getDaysLeftColor
    };
  }
}
</script>
