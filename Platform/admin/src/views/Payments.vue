<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 ml-64">
      <Header title="Payments Management" subtitle="Review and approve payments" />
      
      <div class="p-8">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">All Payments</h2>
            <div class="flex items-center space-x-4">
              <select 
                v-model="filterStatus"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">#{{ payment.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="font-medium">{{ payment.first_name }} {{ payment.last_name }}</p>
                      <p class="text-xs text-gray-500">{{ payment.email }}</p>
                      <p class="text-xs text-gray-500">UID: {{ payment.uid }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ payment.duration_months }} month(s)</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="font-semibold">${{ payment.final_amount }}</p>
                      <p v-if="payment.discount_amount > 0" class="text-xs text-green-600">
                        -${{ payment.discount_amount }} discount
                      </p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 rounded text-xs font-semibold uppercase"
                      :class="payment.payment_method === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                      {{ payment.payment_method }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="getStatusColor(payment.status)">
                      {{ payment.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatDate(payment.created_at) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="payment.status === 'pending'" class="flex space-x-2">
                      <!-- ✅ UPDATED: Opens in new tab directly -->
                      <a
                        v-if="payment.payment_method === 'bank_transfer' && payment.payment_proof"
                        :href="getProofUrl(payment.payment_proof)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-800"
                        title="View Proof"
                      >
                        <i class="fas fa-eye"></i>
                      </a>
                      <button
                        @click="approvePayment(payment.id)"
                        class="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                      <button
                        @click="showDeclineModal(payment.id)"
                        class="text-red-600 hover:text-red-800"
                        title="Decline"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <span v-else class="text-gray-400 text-sm">No actions</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Decline Modal -->
      <div v-if="declineModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Decline Payment</h3>
          <textarea
            v-model="declineReason"
            placeholder="Enter reason for decline..."
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
          ></textarea>
          <div class="flex justify-end space-x-4">
            <button @click="closeDeclineModal" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button @click="declinePayment" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
              Confirm Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import { adminAPI } from '../services/api';

export default {
  name: 'Payments',
  components: { Sidebar, Header },
  setup() {
    const payments = ref([]);
    const filterStatus = ref('');
    const declineModal = ref(false);
    const selectedPaymentId = ref(null);
    const declineReason = ref('');

    const filteredPayments = computed(() => {
      if (!filterStatus.value) return payments.value;
      return payments.value.filter(p => p.status === filterStatus.value);
    });

    const loadPayments = async () => {
      try {
        const response = await adminAPI.getAllPayments();
        if (response.success) {
          payments.value = response.data;
        }
      } catch (err) {
        console.error('Failed to load payments:', err);
      }
    };

    const getStatusColor = (status) => {
      const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        success: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        declined: 'bg-red-100 text-red-800'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };

    // ✅ NEW: Generate proof URL
    const getProofUrl = (filename) => {
      return `http://localhost:5000/uploads/payments/${filename}`;
    };

    const approvePayment = async (paymentId) => {
      if (!confirm('Are you sure you want to approve this payment?')) return;

      try {
        const response = await adminAPI.reviewPayment({
          paymentId,
          status: 'success'
        });
        if (response.success) {
          alert('Payment approved! License key generated and sent to user.');
          loadPayments();
        }
      } catch (err) {
        alert('Failed to approve payment: ' + (err.message || 'Unknown error'));
      }
    };

    const showDeclineModal = (paymentId) => {
      selectedPaymentId.value = paymentId;
      declineModal.value = true;
    };

    const closeDeclineModal = () => {
      declineModal.value = false;
      selectedPaymentId.value = null;
      declineReason.value = '';
    };

    const declinePayment = async () => {
      if (!declineReason.value.trim()) {
        alert('Please enter a reason for decline');
        return;
      }

      try {
        const response = await adminAPI.reviewPayment({
          paymentId: selectedPaymentId.value,
          status: 'declined',
          declineReason: declineReason.value
        });
        if (response.success) {
          alert('Payment declined successfully!');
          closeDeclineModal();
          loadPayments();
        }
      } catch (err) {
        alert('Failed to decline payment: ' + (err.message || 'Unknown error'));
      }
    };

    onMounted(() => {
      loadPayments();
    });

    return {
      payments,
      filterStatus,
      filteredPayments,
      declineModal,
      declineReason,
      getStatusColor,
      formatDate,
      getProofUrl,
      approvePayment,
      showDeclineModal,
      closeDeclineModal,
      declinePayment
    };
  }
}
</script>
