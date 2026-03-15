<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 ml-64">
      <Header title="KYC Verifications" subtitle="Review and approve KYC submissions" />
      
      <div class="p-8">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b">
            <h2 class="text-xl font-bold text-gray-900">Pending KYC Verifications</h2>
          </div>

          <div v-if="kycList.length === 0" class="p-12 text-center">
            <i class="fas fa-check-circle text-6xl text-green-300 mb-4"></i>
            <p class="text-gray-600">No pending KYC verifications</p>
          </div>

          <div v-else class="divide-y">
            <div v-for="kyc in kycList" :key="kyc.id" class="p-6 hover:bg-gray-50 transition">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">
                    {{ getFullName(kyc) }}
                  </h3>
                  <p class="text-sm text-gray-600">UID: {{ kyc.uid }} | Email: {{ kyc.email }}</p>
                  <p class="text-sm text-gray-600 mt-1">
                    Document Type: <span class="font-semibold uppercase">{{ kyc.document_type }}</span>
                  </p>
                  <p class="text-sm text-gray-600">
                    Submitted: {{ formatDate(kyc.submitted_at) }}
                  </p>
                </div>
                <button
                  @click="viewUserProfile(kyc.user_id)"
                  class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  <i class="fas fa-user mr-2"></i>View Profile
                </button>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-2">Front Image</p>
                  <img 
                    :src="`http://localhost:5000/uploads/kyc/${kyc.document_front_image}`" 
                    alt="Front"
                    class="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-75 transition"
                    @click="openImage(`http://localhost:5000/uploads/kyc/${kyc.document_front_image}`)"
                  />
                </div>
                <div v-if="kyc.document_back_image">
                  <p class="text-sm font-medium text-gray-700 mb-2">Back Image</p>
                  <img 
                    :src="`http://localhost:5000/uploads/kyc/${kyc.document_back_image}`" 
                    alt="Back"
                    class="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-75 transition"
                    @click="openImage(`http://localhost:5000/uploads/kyc/${kyc.document_back_image}`)"
                  />
                </div>
              </div>

              <div class="flex items-center space-x-4">
                <button
                  @click="approveKYC(kyc.id)"
                  class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <i class="fas fa-check mr-2"></i>Approve
                </button>
                <button
                  @click="showDeclineModal(kyc.id)"
                  class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <i class="fas fa-times mr-2"></i>Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Lightbox Modal -->
      <div 
        v-if="lightboxImage" 
        class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
        @click="lightboxImage = null"
      >
        <button 
          @click="lightboxImage = null"
          class="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 flex items-center justify-center transition z-10"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
        <button 
          @click="openImageInNewTab(lightboxImage)"
          class="absolute top-4 right-20 text-white bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 flex items-center justify-center transition z-10"
          title="Open in new tab"
        >
          <i class="fas fa-external-link-alt text-xl"></i>
        </button>
        <img 
          :src="lightboxImage" 
          alt="Preview"
          class="max-w-full max-h-screen object-contain"
          @click.stop
        />
      </div>

      <!-- User Profile Modal -->
      <div 
        v-if="profileModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="profileModal = false"
      >
        <div 
          class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h3 class="text-xl font-bold text-gray-900">User Profile</h3>
            <button
              @click="profileModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div v-if="selectedUser" class="p-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">UID</label>
                <p class="text-gray-900 font-semibold">{{ selectedUser.uid }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p class="text-gray-900">{{ selectedUser.email }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p class="text-gray-900">{{ selectedUser.first_name || 'N/A' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <p class="text-gray-900">{{ selectedUser.middle_name || 'N/A' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p class="text-gray-900">{{ selectedUser.last_name || 'N/A' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p class="text-gray-900 font-semibold">{{ getFullName(selectedUser) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p class="text-gray-900">{{ selectedUser.phone || 'N/A' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p class="text-gray-900">{{ formatDateOfBirth(selectedUser.date_of_birth) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p class="text-gray-900 capitalize">{{ selectedUser.gender || 'N/A' }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                <span :class="selectedUser.email_verified ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                  <i :class="selectedUser.email_verified ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="mr-1"></i>
                  {{ selectedUser.email_verified ? 'Verified' : 'Not Verified' }}
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Profile Completed</label>
                <span :class="selectedUser.profile_completed ? 'text-green-600' : 'text-orange-600'" class="font-semibold">
                  <i :class="selectedUser.profile_completed ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-1"></i>
                  {{ selectedUser.profile_completed ? 'Completed' : 'Incomplete' }}
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
                <span 
                  :class="{
                    'text-green-600': selectedUser.kyc_status === 'verified',
                    'text-yellow-600': selectedUser.kyc_status === 'submitted' || selectedUser.kyc_status === 'pending',
                    'text-red-600': selectedUser.kyc_status === 'declined'
                  }" 
                  class="font-semibold capitalize"
                >
                  {{ selectedUser.kyc_status }}
                </span>
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p class="text-gray-900">{{ selectedUser.address || 'N/A' }}</p>
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Registered</label>
                <p class="text-gray-900">{{ formatDate(selectedUser.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decline Modal -->
      <div 
        v-if="declineModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="declineModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full" @click.stop>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Decline KYC Verification</h3>
          <textarea
            v-model="declineReason"
            placeholder="Enter reason for decline..."
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
          ></textarea>
          <div class="flex justify-end space-x-4">
            <button
              @click="declineModal = false"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="declineKYC"
              :disabled="!declineReason.trim()"
              class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import { adminAPI } from '../services/api';

export default {
  name: 'KYCVerifications',
  components: { Sidebar, Header },
  setup() {
    const kycList = ref([]);
    const declineModal = ref(false);
    const selectedKYCId = ref(null);
    const declineReason = ref('');
    const lightboxImage = ref(null);
    const profileModal = ref(false);
    const selectedUser = ref(null);

    const loadKYC = async () => {
      try {
        const response = await adminAPI.getPendingKYC();
        if (response.success) {
          kycList.value = response.data;
        }
      } catch (err) {
        console.error('Failed to load KYC:', err);
      }
    };

    const approveKYC = async (kycId) => {
      if (!confirm('Are you sure you want to approve this KYC verification?')) {
        return;
      }

      try {
        const response = await adminAPI.reviewKYC({
          kycId,
          status: 'approved'
        });
        if (response.success) {
          alert('KYC approved successfully!');
          loadKYC();
        }
      } catch (err) {
        alert('Failed to approve KYC');
      }
    };

    const showDeclineModal = (kycId) => {
      selectedKYCId.value = kycId;
      declineModal.value = true;
      declineReason.value = '';
    };

    const declineKYC = async () => {
      if (!declineReason.value.trim()) {
        alert('Please enter a reason for decline');
        return;
      }

      try {
        const response = await adminAPI.reviewKYC({
          kycId: selectedKYCId.value,
          status: 'declined',
          declineReason: declineReason.value
        });
        if (response.success) {
          alert('KYC declined successfully!');
          declineModal.value = false;
          declineReason.value = '';
          loadKYC();
        }
      } catch (err) {
        alert('Failed to decline KYC');
      }
    };

    const openImage = (url) => {
      lightboxImage.value = url;
    };

    const openImageInNewTab = (url) => {
      window.open(url, '_blank');
    };

    const viewUserProfile = async (userId) => {
      try {
        const response = await adminAPI.getUserProfile(userId);
        if (response.success) {
          selectedUser.value = response.data;
          profileModal.value = true;
        }
      } catch (err) {
        alert('Failed to load user profile');
      }
    };

    const getFullName = (user) => {
      const parts = [
        user.first_name,
        user.middle_name,
        user.last_name
      ].filter(part => part && part.trim());
      
      return parts.length > 0 ? parts.join(' ') : 'N/A';
    };

    const formatDate = (date) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatDateOfBirth = (date) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    onMounted(() => {
      loadKYC();
    });

    return {
      kycList,
      declineModal,
      declineReason,
      lightboxImage,
      profileModal,
      selectedUser,
      approveKYC,
      showDeclineModal,
      declineKYC,
      openImage,
      openImageInNewTab,
      viewUserProfile,
      getFullName,
      formatDate,
      formatDateOfBirth
    };
  }
}
</script>
