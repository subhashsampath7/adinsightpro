<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div v-if="loading" class="py-8">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Verifying your payment...</p>
      </div>

      <div v-else-if="success" class="py-8">
        <div class="mb-6">
          <i class="fas fa-check-circle text-6xl text-green-500"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p class="text-gray-600 mb-6">
          Your payment has been processed successfully. Your license key will be sent to your email shortly.
        </p>
        <div class="space-y-3">
          <router-link 
            to="/my-keys" 
            class="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View My License Keys
          </router-link>
          <router-link 
            to="/dashboard" 
            class="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Go to Dashboard
          </router-link>
        </div>
      </div>

      <div v-else class="py-8">
        <div class="mb-6">
          <i class="fas fa-exclamation-circle text-6xl text-red-500"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Payment Verification Failed</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        <router-link 
          to="/purchase" 
          class="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { paymentAPI } from '../services/api';

export default {
  name: 'PaymentSuccess',
  setup() {
    const route = useRoute();
    const loading = ref(true);
    const success = ref(false);
    const errorMessage = ref('');

    const verifyPayment = async () => {
      try {
        const sessionId = route.query.session_id;
        const paymentId = route.query.payment_id;

        if (!sessionId || !paymentId) {
          throw new Error('Invalid payment session');
        }

        const response = await paymentAPI.verifyStripePayment({
          sessionId,
          paymentId: parseInt(paymentId)
        });

        if (response.success) {
          success.value = true;
        } else {
          errorMessage.value = response.message || 'Payment verification failed';
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        errorMessage.value = error.message || 'Failed to verify payment';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      verifyPayment();
    });

    return {
      loading,
      success,
      errorMessage
    };
  }
};
</script>
