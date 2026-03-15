<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h3 class="text-2xl font-bold text-gray-900">Payment Review</h3>
        <p class="text-sm text-gray-600 mt-1">Payment ID: #{{ payment.id }}</p>
      </div>
      <button 
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600"
      >
        <i class="fas fa-times text-2xl"></i>
      </button>
    </div>

    <!-- User Information -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">User Information</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">Name</p>
          <p class="font-semibold">{{ payment.first_name }} {{ payment.last_name }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Email</p>
          <p class="font-semibold">{{ payment.email }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">UID</p>
          <p class="font-mono font-semibold">{{ payment.uid }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Payment Date</p>
          <p class="font-semibold">{{ formatDate(payment.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- Payment Details -->
    <div class="bg-blue-50 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">Payment Details</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600">Plan</p>
          <p class="font-semibold">{{ payment.duration_months }} Month(s)</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Payment Method</p>
          <p class="font-semibold uppercase">{{ payment.payment_method }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Original Amount</p>
          <p class="font-semibold">${{ payment.amount }}</p>
        </div>
        <div v-if="payment.discount_amount > 0">
          <p class="text-sm text-gray-600">Discount</p>
          <p class="font-semibold text-green-600">-${{ payment.discount_amount }}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-gray-600">Final Amount</p>
          <p class="text-2xl font-bold text-blue-600">${{ payment.final_amount }}</p>
        </div>
      </div>
    </div>

    <!-- Payment Proof (for bank transfer) -->
    <div v-if="payment.payment_method === 'bank_transfer' && payment.payment_proof" class="mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">Payment Proof</h4>
      <img 
        :src="getProofImageUrl()" 
        alt="Payment Proof"
        class="w-full max-w-md rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition"
        @click="openImageInNewTab(getProofImageUrl())"
      />
      <p class="text-sm text-gray-600 mt-2">
        <i class="fas fa-info-circle mr-1"></i>Click image to view full size
      </p>
    </div>

    <!-- Transaction ID (for online payment) -->
    <div v-if="payment.payment_method === 'online' && payment.transaction_id" class="mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">Transaction Details</h4>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm text-gray-600">Transaction ID</p>
        <p class="font-mono font-semibold">{{ payment.transaction_id }}</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between pt-6 border-t">
      <div class="flex space-x-4">
        <button
          @click="handleApprove"
          class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          <i class="fas fa-check mr-2"></i>Approve Payment
        </button>
        <button
          @click="showDeclineInput = !showDeclineInput"
          class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          <i class="fas fa-times mr-2"></i>Decline Payment
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
        placeholder="Enter the reason for declining this payment..."
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
  name: 'PaymentReview',
  props: {
    payment: {
      type: Object,
      required: true
    }
  },
  emits: ['approve', 'decline', 'close'],
  setup(props, { emit }) {
    const showDeclineInput = ref(false);
    const declineReason = ref('');

    const getProofImageUrl = () => {
      return `http://localhost:5000/uploads/payments/${props.payment.payment_proof}`;
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
      if (confirm('Are you sure you want to approve this payment? A license key will be generated and sent to the user.')) {
        emit('approve', props.payment.id);
      }
    };

    const handleDecline = () => {
      if (!declineReason.value.trim()) {
        alert('Please enter a reason for decline');
        return;
      }
      emit('decline', { paymentId: props.payment.id, reason: declineReason.value });
    };

    return {
      showDeclineInput,
      declineReason,
      getProofImageUrl,
      openImageInNewTab,
      formatDate,
      handleApprove,
      handleDecline
    };
  }
}
</script>