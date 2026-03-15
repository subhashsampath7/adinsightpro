<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h3 class="text-2xl font-bold text-gray-900">
          {{ kyc.first_name }} {{ kyc.last_name }}
        </h3>
        <p class="text-sm text-gray-600 mt-1">UID: {{ kyc.uid }}</p>
        <p class="text-sm text-gray-600">Email: {{ kyc.email }}</p>
        <p class="text-sm text-gray-600">
          Document Type: <span class="font-semibold uppercase">{{ kyc.document_type }}</span>
        </p>
        <p class="text-sm text-gray-600">
          Submitted: {{ formatDate(kyc.submitted_at) }}
        </p>
      </div>
      <button 
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600"
      >
        <i class="fas fa-times text-2xl"></i>
      </button>
    </div>

    <!-- Document Images -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <p class="text-sm font-semibold text-gray-700 mb-2">Front Image</p>
        <img 
          :src="getFrontImageUrl()" 
          alt="Document Front"
          class="w-full rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition"
          @click="openImageInNewTab(getFrontImageUrl())"
        />
      </div>
      <div v-if="kyc.document_back_image">
        <p class="text-sm font-semibold text-gray-700 mb-2">Back Image</p>
        <img 
          :src="getBackImageUrl()" 
          alt="Document Back"
          class="w-full rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition"
          @click="openImageInNewTab(getBackImageUrl())"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between pt-6 border-t">
      <div class="flex space-x-4">
        <button
          @click="handleApprove"
          class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          <i class="fas fa-check mr-2"></i>Approve KYC
        </button>
        <button
          @click="showDeclineInput = !showDeclineInput"
          class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          <i class="fas fa-times mr-2"></i>Decline KYC
        </button>
      </div>
    </div>

    <!-- Decline Reason Input -->
    <div v-if="showDeclineInput" class="mt-4 p-4 bg-red-50 rounded-lg">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Reason for Decline *
      </label>
      <textarea
        v-model="declineReason"
        rows="3"
        placeholder="Enter the reason for declining this KYC verification..."
        class="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      ></textarea>
      <div class="flex justify-end space-x-3 mt-3">
        <button
          @click="showDeclineInput = false"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="handleDecline"
          :disabled="!declineReason.trim()"
          class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          Confirm Decline
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'KYCReview',
  props: {
    kyc: {
      type: Object,
      required: true
    }
  },
  emits: ['approve', 'decline', 'close'],
  setup(props, { emit }) {
    const showDeclineInput = ref(false);
    const declineReason = ref('');

    const getFrontImageUrl = () => {
      return `http://localhost:5000/uploads/kyc/${props.kyc.document_front_image}`;
    };

    const getBackImageUrl = () => {
      return `http://localhost:5000/uploads/kyc/${props.kyc.document_back_image}`;
    };

    const openImageInNewTab = (url) => {
      window.open(url, '_blank');
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const handleApprove = () => {
      if (confirm('Are you sure you want to approve this KYC verification?')) {
        emit('approve', props.kyc.id);
      }
    };

    const handleDecline = () => {
      if (!declineReason.value.trim()) {
        alert('Please enter a reason for decline');
        return;
      }
      emit('decline', { kycId: props.kyc.id, reason: declineReason.value });
    };

    return {
      showDeclineInput,
      declineReason,
      getFrontImageUrl,
      getBackImageUrl,
      openImageInNewTab,
      formatDate,
      handleApprove,
      handleDecline
    };
  }
}
</script>