<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="pageLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Loading profile...</p>
      </div>

      <!-- Profile Content -->
      <div v-else>
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
          <p class="text-gray-600 mt-2">Manage your account information</p>
        </div>

        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b">
            <h2 class="text-xl font-bold text-gray-900">Profile Information</h2>
          </div>

          <div class="p-6">
            <!-- Not Completed Profile Form -->
            <div v-if="!user?.profile_completed">
              <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p class="text-blue-800 font-semibold">Complete your profile to access all features</p>
                <p class="text-blue-700 text-sm mt-1">Note: Profile information cannot be edited after submission.</p>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      v-model="form.firstName"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                    <input
                      v-model="form.middleName"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      v-model="form.lastName"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    v-model="form.address"
                    required
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      v-model="form.dateOfBirth"
                      type="date"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    v-model="form.gender"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {{ error }}
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    {{ loading ? 'Saving...' : 'Save Profile' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Completed Profile Display -->
            <div v-else class="space-y-6">
              <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <p class="text-green-800 font-semibold">Profile Completed</p>
                <p class="text-green-700 text-sm mt-1">Your profile information is locked and cannot be edited.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <p class="text-gray-900 font-semibold">
                    {{ user?.first_name }} {{ user?.middle_name }} {{ user?.last_name }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p class="text-gray-900 font-semibold">{{ user?.email }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <p class="text-gray-900 font-semibold">{{ user?.phone || 'N/A' }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <p class="text-gray-900 font-semibold">{{ formatDate(user?.date_of_birth) }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <p class="text-gray-900 font-semibold capitalize">{{ user?.gender || 'N/A' }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">User ID (UID)</label>
                  <p class="text-gray-900 font-semibold">{{ user?.uid }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <p class="text-gray-900 font-semibold">{{ user?.address || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { userAPI } from '../services/api';
import { store } from '../store';
import axios from 'axios';

export default {
  name: 'Profile',
  components: { Navbar, Footer },
  setup() {
    const router = useRouter();
    const user = ref(null);
    const loading = ref(false);
    const error = ref('');
    const pageLoading = ref(true);

    const form = ref({
      firstName: '',
      middleName: '',
      lastName: '',
      address: '',
      phone: '',
      dateOfBirth: '',
      gender: ''
    });

    // Format date helper
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    // Load user data
    const loadUserData = async () => {
      try {
        pageLoading.value = true;
        const token = localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          user.value = response.data.user;
          store.setUser(response.data.user);

          // Pre-fill form if profile not completed
          if (!user.value.profile_completed) {
            form.value = {
              firstName: user.value.first_name || '',
              middleName: user.value.middle_name || '',
              lastName: user.value.last_name || '',
              address: user.value.address || '',
              phone: user.value.phone || '',
              dateOfBirth: user.value.date_of_birth || '',
              gender: user.value.gender || ''
            };
          }
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        error.value = 'Failed to load profile data';
      } finally {
        pageLoading.value = false;
      }
    };

    // Handle form submission
    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        const token = localStorage.getItem('token');

        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/user/profile`,
          {
            firstName: form.value.firstName,
            middleName: form.value.middleName,
            lastName: form.value.lastName,
            address: form.value.address,
            phone: form.value.phone,
            dateOfBirth: form.value.dateOfBirth,
            gender: form.value.gender
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          // Reload user data
          await loadUserData();
          alert('✅ Profile updated successfully!');
        } else {
          error.value = response.data.message || 'Failed to update profile';
        }
      } catch (err) {
        console.error('Profile update error:', err);
        error.value = err.response?.data?.message || 'Failed to update profile';
      } finally {
        loading.value = false;
      }
    };

    // Load user data on mount
    onMounted(() => {
      loadUserData();
    });

    return {
      user,
      form,
      loading,
      error,
      pageLoading,
      handleSubmit,
      formatDate
    };
  }
}
</script>
