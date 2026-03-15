<template>
  <section id="download" class="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Download Chrome Extension
        </h2>
        <p class="text-xl text-gray-600">
          Install our powerful extension and start analyzing Google Ads data instantly
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Download Card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div class="flex items-center justify-center mb-6">
            <div class="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
              <i class="fab fa-chrome text-white text-5xl"></i>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-center mb-4">
            Google Ads Transparency Extension
          </h3>
          
          <div class="space-y-3 mb-8">
            <div class="flex items-center text-gray-700">
              <i class="fas fa-check-circle text-green-500 mr-3"></i>
              <span>Latest Version: <strong>1.3.7</strong></span>
            </div>
            <div class="flex items-center text-gray-700">
              <i class="fas fa-file-archive text-blue-500 mr-3"></i>
              <span>File Size: <strong>94.5 MB</strong></span>
            </div>
            <div class="flex items-center text-gray-700">
              <i class="fas fa-calendar text-purple-500 mr-3"></i>
              <span>Last Updated: <strong>{{ lastUpdated }}</strong></span>
            </div>
            <div class="flex items-center text-gray-700">
              <i class="fas fa-shield-alt text-green-500 mr-3"></i>
              <span>100% Secure & Verified</span>
            </div>
          </div>

          <button
            @click="downloadExtension"
            :disabled="downloading"
            class="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-download mr-2"></i>
            {{ downloading ? 'Downloading...' : 'Download Extension' }}
          </button>

          <p class="text-center text-sm text-gray-500 mt-4">
            Compatible with Chrome, Edge, and Brave browsers
          </p>
        </div>

        <!-- Right: Installation Steps -->
        <div>
          <h3 class="text-2xl font-bold mb-6">Installation Steps</h3>
          
          <div class="space-y-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h4 class="font-bold text-lg mb-2">Download Extension</h4>
                <p class="text-gray-600">
                  Click the download button to get the extension ZIP file
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h4 class="font-bold text-lg mb-2">Extract ZIP File</h4>
                <p class="text-gray-600">
                  Extract the downloaded ZIP file to a folder on your computer
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h4 class="font-bold text-lg mb-2">Open Chrome Extensions</h4>
                <p class="text-gray-600">
                  Go to <code class="bg-gray-100 px-2 py-1 rounded">chrome://extensions/</code> in your browser
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </div>
              <div>
                <h4 class="font-bold text-lg mb-2">Enable Developer Mode</h4>
                <p class="text-gray-600">
                  Toggle "Developer mode" in the top right corner
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                5
              </div>
              <div>
                <h4 class="font-bold text-lg mb-2">Load Unpacked Extension</h4>
                <p class="text-gray-600">
                  Click "Load unpacked" and select the extracted folder
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                <i class="fas fa-check"></i>
              </div>
              <div>
                <h4 class="font-bold text-lg mb-2">Start Using!</h4>
                <p class="text-gray-600">
                  The extension is now installed and ready to use
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 bg-blue-50 border-l-4 border-primary p-4 rounded">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-primary text-xl mr-3 mt-1"></i>
              <div>
                <h4 class="font-bold mb-1">Need Help?</h4>
                <p class="text-sm text-gray-700">
                  Check our <router-link to="/documentation" class="text-primary hover:underline">detailed installation guide</router-link> 
                  or <router-link to="/contact" class="text-primary hover:underline">contact support</router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'DownloadSection',
  setup() {
    const downloading = ref(false);
    const lastUpdated = ref(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));

    const downloadExtension = () => {
      downloading.value = true;
      
      // Path to your extension file
      const fileUrl = '/assets/google-ads-transparency-extension.zip';
      const fileName = 'google-ads-transparency-extension.zip';
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        downloading.value = false;
        
        // Show success notification
        alert('✅ Extension download started!\n\nPlease check your downloads folder and follow the installation steps.');
      }, 1000);
    };

    return {
      downloading,
      lastUpdated,
      downloadExtension
    };
  }
}
</script>
