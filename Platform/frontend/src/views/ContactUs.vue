<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary to-purple-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <span class="text-sm font-semibold">📧 Get In Touch</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Contact Our Support Team</h1>
        <p class="text-xl text-gray-100 max-w-2xl mx-auto">
          We're here to help! Send us a message and we'll respond within 24 hours.
        </p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl shadow-xl p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="form.name"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <input 
                    v-model="form.email"
                    type="email" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <!-- Subject -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span class="text-red-500">*</span>
                  </label>
                  <select 
                    v-model="form.subject"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="kyc">KYC Verification</option>
                    <option value="license">License Issues</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <!-- Message -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Message <span class="text-red-500">*</span>
                  </label>
                  <textarea 
                    v-model="form.message"
                    required
                    rows="6"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Please describe your issue or question in detail..."
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-primary hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i v-if="!loading" class="fas fa-paper-plane mr-2"></i>
                  <i v-else class="fas fa-spinner fa-spin mr-2"></i>
                  {{ loading ? 'Sending...' : 'Send Message' }}
                </button>
              </form>

              <!-- Success Message -->
              <div v-if="successMessage" class="mt-6 bg-green-50 border-2 border-green-500 rounded-lg p-4">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-500 text-2xl mr-3"></i>
                  <div>
                    <p class="font-semibold text-green-800">Message Sent Successfully!</p>
                    <p class="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="mt-6 bg-red-50 border-2 border-red-500 rounded-lg p-4">
                <div class="flex items-center">
                  <i class="fas fa-exclamation-circle text-red-500 text-2xl mr-3"></i>
                  <div>
                    <p class="font-semibold text-red-800">Error Sending Message</p>
                    <p class="text-red-700 text-sm">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-6">
            <!-- Email -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <i class="fas fa-envelope text-primary text-2xl"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
              <p class="text-gray-600 text-sm mb-3">Our support team is available 24/7</p>
              <a href="mailto:support@googleadstransparency.com" class="text-primary font-semibold hover:underline">
                support@googleadstransparency.com
              </a>
            </div>

            <!-- Live Chat -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i class="fas fa-comments text-green-600 text-2xl"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Live Chat</h3>
              <p class="text-gray-600 text-sm mb-3">Chat with our support team</p>
              <button class="text-green-600 font-semibold hover:underline">
                Start Live Chat →
              </button>
            </div>

            <!-- Response Time -->
            <div class="bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <i class="fas fa-clock text-white text-2xl"></i>
              </div>
              <h3 class="text-lg font-bold mb-2">Response Time</h3>
              <p class="text-gray-100 text-sm mb-3">Average response time</p>
              <div class="text-3xl font-bold">
                &lt; 24 hours
              </div>
            </div>

            <!-- Social Media -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div class="flex space-x-3">
                <a href="#" class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition">
                  <i class="fab fa-facebook"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition">
                  <i class="fab fa-linkedin"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white hover:bg-gray-900 transition">
                  <i class="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import { ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'ContactUs',
  components: { Navbar, Footer },
  setup() {
    const form = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    const loading = ref(false);
    const successMessage = ref(false);
    const errorMessage = ref('');

    const submitForm = async () => {
      loading.value = true;
      successMessage.value = false;
      errorMessage.value = '';

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // TODO: Replace with actual API call
        // await contactAPI.sendMessage(form.value);

        successMessage.value = true;
        form.value = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };

        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.value = false;
        }, 5000);
      } catch (error) {
        errorMessage.value = error.message || 'Failed to send message. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      successMessage,
      errorMessage,
      submitForm
    };
  }
}
</script>
