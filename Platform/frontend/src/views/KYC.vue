<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">KYC Verification</h1>
        <p class="text-gray-600 mt-2">Complete your identity verification to purchase licenses</p>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b">
          <h2 class="text-xl font-bold text-gray-900">Identity Verification</h2>
        </div>

        <div class="p-6">
          <!-- KYC Status Display -->
          <div v-if="kycStatus && kycStatus.status !== 'not_submitted'" class="mb-6">
            <div 
              class="border-l-4 p-4"
              :class="{
                'bg-yellow-50 border-yellow-400': kycStatus.status === 'pending',
                'bg-green-50 border-green-400': kycStatus.status === 'approved',
                'bg-red-50 border-red-400': kycStatus.status === 'declined'
              }"
            >
              <div class="flex items-start">
                <i 
                  class="text-2xl mr-3"
                  :class="{
                    'fas fa-clock text-yellow-600': kycStatus.status === 'pending',
                    'fas fa-check-circle text-green-600': kycStatus.status === 'approved',
                    'fas fa-times-circle text-red-600': kycStatus.status === 'declined'
                  }"
                ></i>
                <div>
                  <p class="font-semibold" :class="{
                    'text-yellow-800': kycStatus.status === 'pending',
                    'text-green-800': kycStatus.status === 'approved',
                    'text-red-800': kycStatus.status === 'declined'
                  }">
                    KYC Status: {{ kycStatus.status.toUpperCase() }}
                  </p>
                  <p class="text-sm mt-1" :class="{
                    'text-yellow-700': kycStatus.status === 'pending',
                    'text-green-700': kycStatus.status === 'approved',
                    'text-red-700': kycStatus.status === 'declined'
                  }">
                    <span v-if="kycStatus.status === 'pending'">
                      Your documents are under review. You will be notified once verified.
                    </span>
                    <span v-else-if="kycStatus.status === 'approved'">
                      Your identity has been verified. You can now purchase licenses.
                    </span>
                    <span v-else-if="kycStatus.status === 'declined'">
                      {{ kycStatus.decline_reason || 'Your verification was declined. Please resubmit with correct documents.' }}
                    </span>
                  </p>
                  <p class="text-xs mt-2 opacity-75">
                    Submitted: {{ formatDate(kycStatus.submitted_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- KYC Form -->
          <div v-if="!kycStatus || kycStatus.status === 'not_submitted' || kycStatus.status === 'declined'">
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p class="text-blue-800 font-semibold">Required Documents</p>
              <ul class="text-blue-700 text-sm mt-2 space-y-1">
                <li>• NIC: Front and back images required</li>
                <li>• Passport: Single image required</li>
                <li>• Driving License: Single image required</li>
                <li>• Maximum file size: 5MB per image</li>
                <li>• Accepted formats: JPG, PNG, PDF</li>
              </ul>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
                <select
                  v-model="form.documentType"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Document Type</option>
                  <option value="nic">National Identity Card (NIC)</option>
                  <option value="passport">Passport</option>
                  <option value="driving_license">Driving License</option>
                </select>
              </div>

              <div v-if="form.documentType === 'nic'">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Front Image *</label>
                    <input
                      type="file"
                      @change="handleFileChange($event, 'front')"
                      accept="image/*,.pdf"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p v-if="form.frontPreview" class="text-sm text-green-600 mt-2">
                      <i class="fas fa-check mr-1"></i>File selected
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Back Image *</label>
                    <input
                      type="file"
                      @change="handleFileChange($event, 'back')"
                      accept="image/*,.pdf"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p v-if="form.backPreview" class="text-sm text-green-600 mt-2">
                      <i class="fas fa-check mr-1"></i>File selected
                    </p>
                  </div>
                </div>
              </div>

              <div v-else-if="form.documentType">
                <label class="block text-sm font-medium text-gray-700 mb-2">Document Image *</label>
                <input
                  type="file"
                  @change="handleFileChange($event, 'front')"
                  accept="image/*,.pdf"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p v-if="form.frontPreview" class="text-sm text-green-600 mt-2">
                  <i class="fas fa-check mr-1"></i>File selected
                </p>
              </div>

              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {{ error }}
              </div>

              <div class="flex justify-end space-x-4">
                <router-link
                  to="/dashboard"
                  class="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </router-link>
                <button
                  type="submit"
                  :disabled="loading"
                  class="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {{ loading ? 'Submitting...' : 'Submit for Verification' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { kycAPI } from '../services/api';
import { formatDate, showToast } from '../utils/helpers';

export default {
  name: 'KYC',
  components: { Navbar, Footer },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref('');
    const kycStatus = ref(null);

    const form = ref({
      documentType: '',
      frontFile: null,
      backFile: null,
      frontPreview: null,
      backPreview: null
    });

    const loadKYCStatus = async () => {
      try {
        const response = await kycAPI.getKYCStatus();
        if (response.success) {
          kycStatus.value = response.data;
        }
      } catch (err) {
        console.error('Failed to load KYC status:', err);
      }
    };

    const handleFileChange = (event, type) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          error.value = 'File size must be less than 5MB';
          event.target.value = '';
          return;
        }

        if (type === 'front') {
          form.value.frontFile = file;
          form.value.frontPreview = URL.createObjectURL(file);
        } else {
          form.value.backFile = file;
          form.value.backPreview = URL.createObjectURL(file);
        }
      }
    };

    const handleSubmit = async () => {
      loading.value = true;
      error.value = '';

      try {
        const formData = new FormData();
        formData.append('documentType', form.value.documentType);
        
        if (form.value.frontFile) {
          formData.append('front', form.value.frontFile);
        }
        
        if (form.value.backFile) {
          formData.append('back', form.value.backFile);
        }

        const response = await kycAPI.submitKYC(formData);
        
        if (response.success) {
          showToast('KYC verification submitted successfully!', 'success');
          router.push('/dashboard');
        } else {
          error.value = response.message;
        }
      } catch (err) {
        error.value = err.message || 'Failed to submit KYC verification';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadKYCStatus();
    });

    return {
      form,
      loading,
      error,
      kycStatus,
      handleFileChange,
      handleSubmit,
      formatDate
    };
  }
}
</script>