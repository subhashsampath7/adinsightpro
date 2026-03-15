<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 ml-64">
      <Header title="Users Management" subtitle="Manage all registered users" />
      
      <div class="p-8">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">All Users</h2>
            <div class="flex items-center space-x-4">
              <select
                v-model="statusFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="suspended">Suspended Users</option>
              </select>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search users..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">{{ user.uid }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ getFullName(user) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.phone || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ user.is_active ? 'Active' : 'Suspended' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="getKYCStatusColor(user.kyc_status)"
                    >
                      {{ user.kyc_status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {{ formatDate(user.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      @click="viewUserProfile(user.id)"
                      class="text-blue-600 hover:text-blue-800 font-medium"
                      title="View Profile"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      v-if="user.is_active"
                      @click="showSuspendModal(user)"
                      class="text-red-600 hover:text-red-800 font-medium"
                      title="Suspend User"
                    >
                      <i class="fas fa-ban"></i>
                    </button>
                    <button
                      v-else
                      @click="activateUser(user.id)"
                      class="text-green-600 hover:text-green-800 font-medium"
                      title="Activate User"
                    >
                      <i class="fas fa-check-circle"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <span :class="selectedUser.is_active ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                  <i :class="selectedUser.is_active ? 'fas fa-check-circle' : 'fas fa-ban'" class="mr-1"></i>
                  {{ selectedUser.is_active ? 'Active' : 'Suspended' }}
                </span>
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

              <div v-if="selectedUser.suspension_reason" class="col-span-2">
                <label class="block text-sm font-medium text-red-700 mb-1">Suspension Reason</label>
                <p class="text-red-900 bg-red-50 p-3 rounded-lg">{{ selectedUser.suspension_reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Suspend User Modal -->
      <div 
        v-if="suspendModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="suspendModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full" @click.stop>
          <h3 class="text-xl font-bold text-gray-900 mb-4">Suspend User Account</h3>
          <p class="text-gray-600 mb-4">
            You are about to suspend <strong>{{ selectedUserForSuspension?.email }}</strong>
          </p>
          <textarea
            v-model="suspensionReason"
            placeholder="Enter reason for suspension..."
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
          ></textarea>
          <div class="flex justify-end space-x-4">
            <button
              @click="suspendModal = false"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="suspendUser"
              :disabled="!suspensionReason.trim()"
              class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Suspension
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
  name: 'Users',
  components: { Sidebar, Header },
  setup() {
    const users = ref([]);
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const profileModal = ref(false);
    const selectedUser = ref(null);
    const suspendModal = ref(false);
    const selectedUserForSuspension = ref(null);
    const suspensionReason = ref('');

    const filteredUsers = computed(() => {
      let filtered = users.value;

      // Filter by status
      if (statusFilter.value === 'active') {
        filtered = filtered.filter(user => user.is_active);
      } else if (statusFilter.value === 'suspended') {
        filtered = filtered.filter(user => !user.is_active);
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(user => 
          user.uid.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          getFullName(user).toLowerCase().includes(query)
        );
      }

      return filtered;
    });

    const loadUsers = async () => {
      try {
        const response = await adminAPI.getAllUsers();
        if (response.success) {
          users.value = response.data;
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      }
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

    const showSuspendModal = (user) => {
      selectedUserForSuspension.value = user;
      suspensionReason.value = '';
      suspendModal.value = true;
    };

    const suspendUser = async () => {
      if (!suspensionReason.value.trim()) {
        alert('Please enter a reason for suspension');
        return;
      }

      try {
        const response = await adminAPI.suspendUser({
          userId: selectedUserForSuspension.value.id,
          reason: suspensionReason.value
        });

        if (response.success) {
          alert('User suspended successfully!');
          suspendModal.value = false;
          suspensionReason.value = '';
          selectedUserForSuspension.value = null;
          loadUsers();
        }
      } catch (err) {
        alert('Failed to suspend user');
      }
    };

    const activateUser = async (userId) => {
      if (!confirm('Are you sure you want to activate this user account?')) {
        return;
      }

      try {
        const response = await adminAPI.activateUser({ userId });
        if (response.success) {
          alert('User activated successfully!');
          loadUsers();
        }
      } catch (err) {
        alert('Failed to activate user');
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

    const getKYCStatusColor = (status) => {
      const colors = {
        pending: 'bg-gray-100 text-gray-800',
        submitted: 'bg-blue-100 text-blue-800',
        verified: 'bg-green-100 text-green-800',
        declined: 'bg-red-100 text-red-800'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
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
      loadUsers();
    });

    return {
      users,
      searchQuery,
      statusFilter,
      filteredUsers,
      profileModal,
      selectedUser,
      suspendModal,
      selectedUserForSuspension,
      suspensionReason,
      viewUserProfile,
      showSuspendModal,
      suspendUser,
      activateUser,
      getFullName,
      getKYCStatusColor,
      formatDate,
      formatDateOfBirth
    };
  }
}
</script>
