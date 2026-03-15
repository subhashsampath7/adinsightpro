<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Purchase License Key</h1>
        <p class="text-gray-600 mt-2">Choose your plan and complete payment</p>
      </div>

      <!-- Step 1: Select Plan -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b">
          <h2 class="text-xl font-bold text-gray-900">Step 1: Select Plan</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="plan in plans" 
              :key="plan.id"
              @click="selectPlan(plan)"
              class="border-2 rounded-lg p-6 cursor-pointer transition hover:shadow-lg"
              :class="selectedPlan?.id === plan.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'"
            >
              <div class="text-center mb-4">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ plan.duration_months }} Month{{ plan.duration_months > 1 ? 's' : '' }}
                </h3>
                <div class="text-4xl font-bold text-blue-600 mb-2">${{ plan.price }}</div>
              </div>
              <p class="text-gray-600 text-center">{{ plan.description }}</p>
              <div v-if="selectedPlan?.id === plan.id" class="mt-4 text-center">
                <i class="fas fa-check-circle text-blue-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Apply Discount -->
      <div v-if="selectedPlan" class="bg-white rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b">
          <h2 class="text-xl font-bold text-gray-900">Step 2: Apply Discount Code (Optional)</h2>
        </div>
        <div class="p-6">
          <div class="flex gap-4">
            <input
              v-model="discountCode"
              type="text"
              placeholder="Enter discount code"
              :disabled="discountApplied"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              v-if="!discountApplied"
              @click="validateDiscount"
              :disabled="!discountCode || validatingDiscount"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ validatingDiscount ? 'Validating...' : 'Apply' }}
            </button>
            <button
              v-else
              @click="removeDiscount"
              class="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Remove
            </button>
          </div>
          <div v-if="discountApplied" class="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <i class="fas fa-check-circle mr-2"></i>Discount applied: {{ discountPercentage }}% off
          </div>
        </div>
      </div>

      <!-- Step 3: Payment Summary -->
      <div v-if="selectedPlan" class="bg-white rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b">
          <h2 class="text-xl font-bold text-gray-900">Step 3: Payment Summary</h2>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div class="flex justify-between text-lg">
              <span class="text-gray-600">Plan:</span>
              <span class="font-semibold">{{ selectedPlan.duration_months }} Month(s)</span>
            </div>
            <div class="flex justify-between text-lg">
              <span class="text-gray-600">Price:</span>
              <span class="font-semibold">${{ selectedPlan.price }}</span>
            </div>
            <div v-if="discountApplied" class="flex justify-between text-lg text-green-600">
              <span>Discount ({{ discountPercentage }}%):</span>
              <span class="font-semibold">-${{ discountAmount.toFixed(2) }}</span>
            </div>
            <div class="border-t pt-3 flex justify-between text-2xl">
              <span class="font-bold text-gray-900">Total:</span>
              <span class="font-bold text-blue-600">${{ finalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Payment Method -->
      <div v-if="selectedPlan" class="bg-white rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b">
          <h2 class="text-xl font-bold text-gray-900">Step 4: Select Payment Method</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Online Payment with Stripe -->
            <div 
              @click="selectPaymentMethod('online')"
              class="border-2 rounded-lg p-6 cursor-pointer transition hover:shadow-md"
              :class="paymentMethod === 'online' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <i class="fas fa-credit-card text-3xl text-blue-600 mr-4"></i>
                  <div>
                    <h3 class="font-bold text-lg">Online Payment</h3>
                    <p class="text-sm text-gray-600">Secure payment via Stripe</p>
                    <p class="text-xs text-gray-500 mt-1">Instant activation</p>
                  </div>
                </div>
                <div v-if="paymentMethod === 'online'">
                  <i class="fas fa-check-circle text-blue-600 text-2xl"></i>
                </div>
              </div>
            </div>

            <!-- Bank Transfer -->
            <div 
              @click="selectPaymentMethod('bank_transfer')"
              class="border-2 rounded-lg p-6 cursor-pointer transition hover:shadow-md"
              :class="paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <i class="fas fa-university text-3xl text-blue-600 mr-4"></i>
                  <div>
                    <h3 class="font-bold text-lg">Bank Transfer</h3>
                    <p class="text-sm text-gray-600">Direct bank transfer</p>
                    <p class="text-xs text-gray-500 mt-1">Manual verification required</p>
                  </div>
                </div>
                <div v-if="paymentMethod === 'bank_transfer'">
                  <i class="fas fa-check-circle text-blue-600 text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Online Payment Section -->
          <div v-if="paymentMethod === 'online'" class="mt-6 border-t pt-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div class="flex items-start">
                <i class="fas fa-info-circle text-blue-600 mt-1 mr-3"></i>
                <div>
                  <h4 class="font-semibold text-blue-900 mb-1">Stripe Test Mode</h4>
                  <p class="text-sm text-blue-800 mb-2">
                    You'll be redirected to Stripe's secure checkout page.
                  </p>
                  <p class="text-sm text-blue-800">
                    Test card: <code class="bg-white px-2 py-1 rounded font-mono">4242 4242 4242 4242</code>
                    <br>
                    Expiry: Any future date | CVV: Any 3 digits
                  </p>
                </div>
              </div>
            </div>

            <button
              @click="processOnlinePayment"
              :disabled="processing"
              class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="processing" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-lock mr-2"></i>
              {{ processing ? 'Processing...' : `Pay $${finalAmount.toFixed(2)} with Stripe` }}
            </button>
          </div>

          <!-- Bank Transfer Section -->
          <div v-if="paymentMethod === 'bank_transfer'" class="mt-6 border-t pt-6">
            <h3 class="font-bold text-lg mb-4">Bank Transfer Details</h3>
            <div class="bg-gray-50 rounded-lg p-6 space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Bank:</span>
                <span class="font-semibold">BOC</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Account Number:</span>
                <span class="font-semibold">86793959</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Branch:</span>
                <span class="font-semibold">Rajanganaya</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Account Holder:</span>
                <span class="font-semibold">A.S.S.Thilakarathna</span>
              </div>
              <div class="flex justify-between border-t pt-3">
                <span class="text-gray-600">Reference (Important):</span>
                <span class="font-semibold text-blue-600">{{ userUid }}</span>
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Upload Payment Proof (Image or PDF) *
              </label>
              <input
                type="file"
                @change="handleProofUpload"
                accept="image/*,application/pdf"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <p v-if="paymentProof" class="text-sm text-green-600 mt-2">
                <i class="fas fa-check mr-1"></i>{{ paymentProof.name }} selected
              </p>
              <p class="text-xs text-gray-500 mt-2">
                Accepted formats: JPG, PNG, PDF (Max 5MB)
              </p>
            </div>

            <button
              @click="processBankTransfer"
              :disabled="processing || !paymentProof"
              class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="processing" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-upload mr-2"></i>
              {{ processing ? 'Uploading...' : 'Submit Payment Proof' }}
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
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
import { paymentAPI } from '../services/api';

export default {
  name: 'Purchase',
  components: { Navbar, Footer },
  setup() {
    const router = useRouter();
    const plans = ref([]);
    const selectedPlan = ref(null);
    const discountCode = ref('');
    const discountApplied = ref(false);
    const discountPercentage = ref(0);
    const validatingDiscount = ref(false);
    const paymentMethod = ref('');
    const processing = ref(false);
    const error = ref('');
    const paymentProof = ref(null);
    const paymentId = ref(null);
    
    // Get user UID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userUid = ref(user.uid || '');

    const discountAmount = computed(() => {
      if (!selectedPlan.value || !discountApplied.value) return 0;
      return (selectedPlan.value.price * discountPercentage.value) / 100;
    });

    const finalAmount = computed(() => {
      if (!selectedPlan.value) return 0;
      return selectedPlan.value.price - discountAmount.value;
    });

    const loadPlans = async () => {
      try {
        const response = await paymentAPI.getPricingPlans();
        if (response.success) {
          plans.value = response.data;
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
        error.value = 'Failed to load pricing plans';
      }
    };

    const selectPlan = (plan) => {
      selectedPlan.value = plan;
      paymentId.value = null;
      error.value = '';
    };

    const selectPaymentMethod = (method) => {
      paymentMethod.value = method;
      error.value = '';
    };

    const validateDiscount = async () => {
      if (!discountCode.value.trim()) return;
      
      validatingDiscount.value = true;
      error.value = '';
      
      try {
        const response = await paymentAPI.validateDiscountCode(discountCode.value);
        if (response.success) {
          discountApplied.value = true;
          discountPercentage.value = response.data.discountPercentage;
        }
      } catch (err) {
        error.value = err.message || 'Invalid discount code';
      } finally {
        validatingDiscount.value = false;
      }
    };

    const removeDiscount = () => {
      discountApplied.value = false;
      discountPercentage.value = 0;
      discountCode.value = '';
    };

    const processOnlinePayment = async () => {
      processing.value = true;
      error.value = '';

      try {
        // Step 1: Create payment record
        const paymentData = {
          planId: selectedPlan.value.id,
          paymentMethod: 'online',
          discountCode: discountApplied.value ? discountCode.value : null
        };

        const createResponse = await paymentAPI.createPayment(paymentData);
        
        if (!createResponse.success) {
          throw new Error(createResponse.message || 'Failed to create payment');
        }

        paymentId.value = createResponse.data.paymentId;

        // Step 2: Create Stripe Checkout Session
        const checkoutResponse = await paymentAPI.createCheckoutSession(paymentId.value);
        
        if (!checkoutResponse.success) {
          throw new Error(checkoutResponse.message || 'Failed to create checkout session');
        }

        // Step 3: Redirect to Stripe Checkout
        window.location.href = checkoutResponse.data.sessionUrl;
        
      } catch (err) {
        error.value = err.message || 'Payment processing failed';
        processing.value = false;
      }
    };

    const handleProofUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          error.value = 'File size must be less than 5MB';
          event.target.value = '';
          return;
        }
        paymentProof.value = file;
        error.value = '';
      }
    };

    const processBankTransfer = async () => {
      if (!paymentProof.value) {
        error.value = 'Please upload payment proof';
        return;
      }

      processing.value = true;
      error.value = '';

      try {
        // Step 1: Create payment record
        const paymentData = {
          planId: selectedPlan.value.id,
          paymentMethod: 'bank_transfer',
          discountCode: discountApplied.value ? discountCode.value : null
        };

        const createResponse = await paymentAPI.createPayment(paymentData);
        
        if (!createResponse.success) {
          throw new Error(createResponse.message || 'Failed to create payment');
        }

        paymentId.value = createResponse.data.paymentId;

        // Step 2: Upload payment proof
        const formData = new FormData();
        formData.append('paymentId', paymentId.value);
        formData.append('proof', paymentProof.value);

        const uploadResponse = await paymentAPI.uploadPaymentProof(formData);
        
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message || 'Failed to upload payment proof');
        }

        alert('Payment proof uploaded successfully! Awaiting admin verification.');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
        
      } catch (err) {
        error.value = err.message || 'Failed to upload payment proof';
      } finally {
        processing.value = false;
      }
    };

    onMounted(() => {
      loadPlans();
    });

    return {
      plans,
      selectedPlan,
      discountCode,
      discountApplied,
      discountPercentage,
      validatingDiscount,
      paymentMethod,
      processing,
      error,
      paymentProof,
      userUid,
      discountAmount,
      finalAmount,
      selectPlan,
      selectPaymentMethod,
      validateDiscount,
      removeDiscount,
      processOnlinePayment,
      handleProofUpload,
      processBankTransfer
    };
  }
};
</script>
