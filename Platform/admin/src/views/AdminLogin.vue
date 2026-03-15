<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <i class="fas fa-shield-alt text-blue-600 text-5xl mb-4"></i>
        <h2 class="text-3xl font-bold text-gray-900">Admin Login</h2>
        <p class="text-gray-600 mt-2">Access the admin panel</p>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        <p>Default credentials:</p>
        <p class="font-mono mt-1">Username: admin | Password: admin123</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminAPI } from '../services/api';
import { store } from '../store';

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const error = ref('');

    const form = ref({
      username: '',
      password: ''
    });

    const handleLogin = async () => {
      loading.value = true;
      error.value = '';

      try {
        const response = await adminAPI.login(form.value);
        
        if (response.success) {
          store.setToken(response.data.token);
          store.setAdmin(response.data);
          router.push('/dashboard');
        } else {
          error.value = response.message;
        }
      } catch (err) {
        error.value = err.message || 'Login failed';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      handleLogin
    };
  }
}
</script>