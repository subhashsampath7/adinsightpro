<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary to-purple-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <span class="text-sm font-semibold">❓ Frequently Asked Questions</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-6">How Can We Help You?</h1>
        <p class="text-xl text-gray-100 max-w-2xl mx-auto mb-8">
          Find answers to common questions about our extension, features, and pricing
        </p>
        
        <!-- Search Box -->
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search for answers..." 
              class="w-full px-6 py-4 pl-14 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
            />
            <i class="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Categories -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Category Tabs -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-6 py-3 rounded-full font-semibold transition-all duration-300',
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
          >
            <i :class="category.icon" class="mr-2"></i>{{ category.name }}
          </button>
        </div>

        <!-- FAQ Items -->
        <div class="max-w-4xl mx-auto">
          <div v-if="filteredFAQs.length === 0" class="text-center py-12">
            <i class="fas fa-search text-gray-400 text-5xl mb-4"></i>
            <p class="text-gray-600 text-lg">No results found for "{{ searchQuery }}"</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(faq, index) in filteredFAQs"
              :key="index"
              class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <button
                @click="toggleFAQ(index)"
                class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start flex-1">
                  <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i class="fas fa-question text-primary"></i>
                  </div>
                  <span class="font-semibold text-gray-900 text-lg pr-4">{{ faq.question }}</span>
                </div>
                <i 
                  :class="[
                    'fas fa-chevron-down text-primary transition-transform duration-300',
                    openFAQ === index ? 'transform rotate-180' : ''
                  ]"
                ></i>
              </button>
              
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-96 opacity-100"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="max-h-96 opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div v-show="openFAQ === index" class="px-6 pb-6">
                  <div class="pl-12 text-gray-700 leading-relaxed">
                    <p v-html="faq.answer"></p>
                    <div v-if="faq.link" class="mt-4">
                      <router-link 
                        :to="faq.link.url" 
                        class="text-primary font-semibold hover:underline inline-flex items-center"
                      >
                        {{ faq.link.text }}
                        <i class="fas fa-arrow-right ml-2"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Still Have Questions -->
        <div class="mt-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <i class="fas fa-headset text-5xl mb-4 opacity-80"></i>
          <h3 class="text-3xl font-bold mb-4">Still Have Questions?</h3>
          <p class="text-xl text-gray-100 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/contact" 
              class="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition inline-flex items-center justify-center"
            >
              <i class="fas fa-envelope mr-2"></i>Contact Support
            </router-link>
            <router-link 
              to="/help-center" 
              class="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary transition inline-flex items-center justify-center"
            >
              <i class="fas fa-book mr-2"></i>Visit Help Center
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'FAQ',
  components: { Navbar, Footer },
  setup() {
    const searchQuery = ref('');
    const selectedCategory = ref('all');
    const openFAQ = ref(null);

    const categories = ref([
      { id: 'all', name: 'All', icon: 'fas fa-th' },
      { id: 'general', name: 'General', icon: 'fas fa-info-circle' },
      { id: 'account', name: 'Account', icon: 'fas fa-user' },
      { id: 'pricing', name: 'Pricing', icon: 'fas fa-dollar-sign' },
      { id: 'technical', name: 'Technical', icon: 'fas fa-cog' },
      { id: 'features', name: 'Features', icon: 'fas fa-star' }
    ]);

    const faqs = ref([
      // General
      {
        category: 'general',
        question: 'What is Google Ads Transparency Extension?',
        answer: 'Google Ads Transparency Extension is a powerful browser extension that allows you to scrape, analyze, and compare advertising data from the Google Ads Transparency Center. It provides AI-powered insights to help you make data-driven advertising decisions.'
      },
      {
        category: 'general',
        question: 'How does the extension work?',
        answer: 'The extension automatically scrapes ad data from Google Ads Transparency Center, processes it using our AI algorithms, and presents comprehensive analytics including spend ranges, impressions, advertiser details, and campaign insights. You can export data, compare campaigns, and get AI-powered recommendations.',
        link: { text: 'Learn More in Documentation', url: '/documentation' }
      },
      {
        category: 'general',
        question: 'Is this extension legal to use?',
        answer: 'Yes, absolutely. Our extension only accesses publicly available data from Google Ads Transparency Center. We comply with all terms of service and data protection regulations including GDPR and CCPA.'
      },

      // Account
      {
        category: 'account',
        question: 'How do I create an account?',
        answer: 'Click on "Get Started" or "Register" button, fill in your email and password, verify your email, complete your profile, and submit KYC verification. Once approved, you can purchase a license key.',
        link: { text: 'Register Now', url: '/register' }
      },
      {
        category: 'account',
        question: 'What is KYC verification and why is it required?',
        answer: 'KYC (Know Your Customer) verification is a security measure to ensure the authenticity of our users. You need to submit a government-issued ID and proof of address. This helps us prevent fraud and maintain a secure platform for all users.'
      },
      {
        category: 'account',
        question: 'How long does KYC verification take?',
        answer: 'KYC verification typically takes 24-48 hours. Our team reviews each submission manually to ensure accuracy. You will receive an email notification once your verification is approved or if additional information is needed.'
      },
      {
        category: 'account',
        question: 'Can I edit my profile after completion?',
        answer: 'For security reasons, profile information cannot be edited once completed. If you need to update your information, please contact our support team with proper documentation.'
      },

      // Pricing
      {
        category: 'pricing',
        question: 'What are the pricing plans?',
        answer: 'We offer three flexible plans: <strong>Monthly ($X/month)</strong>, <strong>Quarterly ($X/3 months - Save X%)</strong>, and <strong>Annual ($X/year - Save X%)</strong>. All plans include full access to all features including AI-powered analysis.',
        link: { text: 'View Pricing Details', url: '/#pricing' }
      },
      {
        category: 'pricing',
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards (Visa, Mastercard, American Express) via Stripe, and bank transfers. For bank transfers, you can upload payment proof after completing the transfer.'
      },
      {
        category: 'pricing',
        question: 'Is there a free trial?',
        answer: 'Currently, we don\'t offer a free trial. However, all plans come with a 30-day money-back guarantee. If you\'re not satisfied with the extension, you can request a full refund within 30 days of purchase.'
      },
      {
        category: 'pricing',
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time from your dashboard. Your license will remain active until the end of your billing period. No refunds are provided for partial months.'
      },
      {
        category: 'pricing',
        question: 'Do you offer discounts for annual plans?',
        answer: 'Yes! Our annual plan offers significant savings compared to monthly billing. You can save up to X% by choosing the annual plan. We also occasionally offer promotional discounts - subscribe to our newsletter to stay updated.'
      },

      // Technical
      {
        category: 'technical',
        question: 'Which browsers are supported?',
        answer: 'Currently, our extension is available for <strong>Google Chrome</strong> and <strong>Chromium-based browsers</strong> (Edge, Brave, Opera). Firefox and Safari support is coming soon.'
      },
      {
        category: 'technical',
        question: 'How do I install the extension?',
        answer: 'After purchasing a license key: <br>1. Download the extension from your dashboard<br>2. Open Chrome and go to chrome://extensions<br>3. Enable "Developer mode"<br>4. Click "Load unpacked" and select the extension folder<br>5. Open the extension and enter your license key',
        link: { text: 'Detailed Installation Guide', url: '/documentation#installation' }
      },
      {
        category: 'technical',
        question: 'What is the difference between Local and Server mode?',
        answer: '<strong>Local Mode:</strong> Data is processed on your computer using our Windows app. Faster but requires the app to be running.<br><br><strong>Server Mode:</strong> Data is processed on our servers. Works without the Windows app but requires internet connection.'
      },
      {
        category: 'technical',
        question: 'How do I activate my license key?',
        answer: 'After installing the extension, click on the extension icon, enter your license key in the activation window, and click "Activate". Your license will be verified instantly and the extension will be ready to use.',
        link: { text: 'Activation Guide', url: '/documentation#activation' }
      },
      {
        category: 'technical',
        question: 'Can I use one license on multiple devices?',
        answer: 'No, each license key is tied to one device/browser. If you need to use the extension on multiple devices, you\'ll need to purchase additional licenses. Contact sales for volume discounts.'
      },
      {
        category: 'technical',
        question: 'What should I do if the extension stops working?',
        answer: 'First, try refreshing the page and restarting your browser. If the issue persists, check if your license is still active in the dashboard. For technical issues, contact our support team with error details.',
        link: { text: 'Troubleshooting Guide', url: '/documentation#troubleshooting' }
      },

      // Features
      {
        category: 'features',
        question: 'What data can I scrape with this extension?',
        answer: 'You can scrape: Advertiser names, Ad URLs, Start/End dates, Display duration, Spend ranges, Impression ranges, Target domains, Ad creatives, and Campaign details. All data is sourced from Google Ads Transparency Center.'
      },
      {
        category: 'features',
        question: 'What AI features are available?',
        answer: 'Our AI provides: <strong>Market Overview</strong> (industry trends), <strong>Competitor Analysis</strong> (deep insights), <strong>Campaign Optimizer</strong> (recommendations), <strong>Trend Prediction</strong> (forecasting), <strong>ROI Estimator</strong> (calculations), and <strong>Ask AI Anything</strong> (custom queries).',
        link: { text: 'Explore AI Features', url: '/#ai-features' }
      },
      {
        category: 'features',
        question: 'Can I export the scraped data?',
        answer: 'Yes! You can export data to <strong>Excel (.xlsx)</strong>, <strong>CSV</strong>, or <strong>PDF</strong> formats. The export includes all scraped data, filters applied, and AI analysis results.'
      },
      {
        category: 'features',
        question: 'How accurate is the AI analysis?',
        answer: 'Our AI models are trained on millions of ad campaigns and achieve 99.9% accuracy in data analysis. However, AI predictions should be used as guidance alongside your own business judgment.'
      },
      {
        category: 'features',
        question: 'What is the maximum number of ads I can scrape?',
        answer: 'You can configure the maximum number of ads to scrape (default: 100). For larger datasets, you can increase this limit in settings. There\'s no hard limit, but scraping large datasets may take longer.'
      }
    ]);

    const filteredFAQs = computed(() => {
      let filtered = faqs.value;

      // Filter by category
      if (selectedCategory.value !== 'all') {
        filtered = filtered.filter(faq => faq.category === selectedCategory.value);
      }

      // Filter by search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
        );
      }

      return filtered;
    });

    const toggleFAQ = (index) => {
      openFAQ.value = openFAQ.value === index ? null : index;
    };

    return {
      searchQuery,
      selectedCategory,
      openFAQ,
      categories,
      faqs,
      filteredFAQs,
      toggleFAQ
    };
  }
}
</script>
