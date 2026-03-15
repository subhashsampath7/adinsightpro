<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary to-purple-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <div class="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span class="text-sm font-semibold">📖 Documentation</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4">Complete User Guide</h1>
            <p class="text-xl text-gray-100 max-w-2xl">
              Everything you need to know about using Google Ads Transparency Extension
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentation Content -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar Navigation -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
              <nav class="space-y-2">
                <a 
                  v-for="section in sections"
                  :key="section.id"
                  :href="`#${section.id}`"
                  @click.prevent="scrollToSection(section.id)"
                  :class="[
                    'block px-4 py-2 rounded-lg text-sm transition-colors',
                    activeSection === section.id 
                      ? 'bg-primary text-white font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <i :class="section.icon" class="mr-2"></i>{{ section.title }}
                </a>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              
              <!-- Introduction -->
              <div :id="sections[0].id" class="mb-16 scroll-mt-6">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-info-circle text-primary"></i>
                  </div>
                  Introduction
                </h2>
                <div class="prose max-w-none">
                  <p class="text-gray-700 leading-relaxed mb-4">
                    Welcome to the Google Ads Transparency Extension documentation. This comprehensive guide will help you understand and use all features of our powerful ad intelligence tool.
                  </p>
                  <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                    <h4 class="font-bold text-blue-900 mb-2">What is Google Ads Transparency Extension?</h4>
                    <p class="text-blue-800 text-sm">
                      A browser extension that scrapes, analyzes, and provides AI-powered insights from Google Ads Transparency Center. Perfect for marketers, advertisers, and business analysts who want to understand competitor strategies and optimize their campaigns.
                    </p>
                  </div>
                  <h4 class="text-xl font-bold text-gray-900 mb-3">Key Features:</h4>
                  <ul class="space-y-2 mb-6">
                    <li class="flex items-start">
                      <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                      <span class="text-gray-700">Automated data scraping from Google Ads Transparency Center</span>
                    </li>
                    <li class="flex items-start">
                      <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                      <span class="text-gray-700">Real-time analytics dashboard with comprehensive metrics</span>
                    </li>
                    <li class="flex items-start">
                      <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                      <span class="text-gray-700">AI-powered insights and predictions</span>
                    </li>
                    <li class="flex items-start">
                      <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                      <span class="text-gray-700">Export data to Excel, CSV, and PDF formats</span>
                    </li>
                    <li class="flex items-start">
                      <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                      <span class="text-gray-700">Local and Server processing modes</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Getting Started -->
              <div :id="sections[1].id" class="mb-16 scroll-mt-6">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-rocket text-green-600"></i>
                  </div>
                  Getting Started
                </h2>
                
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Step 1: Create Your Account</h3>
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                  <ol class="space-y-4">
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">1</span>
                      <div>
                        <p class="font-semibold text-gray-900">Visit the Registration Page</p>
                        <p class="text-gray-600 text-sm">Go to <router-link to="/register" class="text-primary hover:underline">Register Page</router-link> and click "Get Started"</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">2</span>
                      <div>
                        <p class="font-semibold text-gray-900">Fill in Your Details</p>
                        <p class="text-gray-600 text-sm">Enter your email address and create a strong password</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">3</span>
                      <div>
                        <p class="font-semibold text-gray-900">Verify Your Email</p>
                        <p class="text-gray-600 text-sm">Check your inbox and click the verification link</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">4</span>
                      <div>
                        <p class="font-semibold text-gray-900">Complete Your Profile</p>
                        <p class="text-gray-600 text-sm">Add your personal information (name, address, phone, date of birth)</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <h3 class="text-2xl font-bold text-gray-900 mb-4">Step 2: KYC Verification</h3>
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
                  <h4 class="font-bold text-yellow-900 mb-2">
                    <i class="fas fa-exclamation-triangle mr-2"></i>Important: KYC is Required
                  </h4>
                  <p class="text-yellow-800 text-sm">
                    You must complete KYC verification before purchasing a license. This helps us maintain security and prevent fraud.
                  </p>
                </div>
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 class="font-bold text-gray-900 mb-3">Required Documents:</h4>
                  <ul class="space-y-3">
                    <li class="flex items-start">
                      <i class="fas fa-id-card text-primary mr-3 mt-1"></i>
                      <div>
                        <p class="font-semibold text-gray-900">Government-Issued ID</p>
                        <p class="text-gray-600 text-sm">Passport, Driver's License, or National ID Card (clear photo, all corners visible)</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <i class="fas fa-file-alt text-primary mr-3 mt-1"></i>
                      <div>
                        <p class="font-semibold text-gray-900">Proof of Address</p>
                        <p class="text-gray-600 text-sm">Utility bill, bank statement, or government letter (issued within last 3 months)</p>
                      </div>
                    </li>
                  </ul>
                  <div class="mt-4 p-4 bg-white rounded-lg">
                    <p class="text-sm text-gray-600"><strong>Processing Time:</strong> 24-48 hours</p>
                    <p class="text-sm text-gray-600"><strong>Status Updates:</strong> You'll receive email notifications</p>
                  </div>
                </div>

                <h3 class="text-2xl font-bold text-gray-900 mb-4">Step 3: Purchase License</h3>
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                  <ol class="space-y-4">
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">1</span>
                      <div>
                        <p class="font-semibold text-gray-900">Choose Your Plan</p>
                        <p class="text-gray-600 text-sm">Select Monthly, Quarterly, or Annual plan based on your needs</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">2</span>
                      <div>
                        <p class="font-semibold text-gray-900">Complete Payment</p>
                        <p class="text-gray-600 text-sm">Pay via Stripe (card) or bank transfer</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">3</span>
                      <div>
                        <p class="font-semibold text-gray-900">Receive License Key</p>
                        <p class="text-gray-600 text-sm">Your license key will be displayed immediately and sent via email</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <!-- Installation -->
              <div :id="sections[2].id" class="mb-16 scroll-mt-6">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-download text-purple-600"></i>
                  </div>
                  Installation Guide
                </h2>

                <h3 class="text-2xl font-bold text-gray-900 mb-4">Chrome Installation</h3>
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                  <ol class="space-y-4">
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">1</span>
                      <div>
                        <p class="font-semibold text-gray-900">Download Extension</p>
                        <p class="text-gray-600 text-sm mb-2">Go to your dashboard and click "Download Extension"</p>
                        <code class="bg-gray-800 text-green-400 px-3 py-1 rounded text-sm">google-ads-transparency-extension.zip</code>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">2</span>
                      <div>
                        <p class="font-semibold text-gray-900">Extract ZIP File</p>
                        <p class="text-gray-600 text-sm">Right-click the downloaded file and select "Extract All"</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">3</span>
                      <div>
                        <p class="font-semibold text-gray-900">Open Chrome Extensions</p>
                        <p class="text-gray-600 text-sm mb-2">Type in address bar:</p>
                        <code class="bg-gray-800 text-green-400 px-3 py-1 rounded text-sm">chrome://extensions</code>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">4</span>
                      <div>
                        <p class="font-semibold text-gray-900">Enable Developer Mode</p>
                        <p class="text-gray-600 text-sm">Toggle the "Developer mode" switch in the top right corner</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">5</span>
                      <div>
                        <p class="font-semibold text-gray-900">Load Extension</p>
                        <p class="text-gray-600 text-sm">Click "Load unpacked" and select the extracted folder</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">6</span>
                      <div>
                        <p class="font-semibold text-gray-900">Pin Extension</p>
                        <p class="text-gray-600 text-sm">Click the puzzle icon and pin the extension to your toolbar</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-blue-900 mb-2">
                    <i class="fas fa-lightbulb mr-2"></i>Pro Tip
                  </h4>
                  <p class="text-blue-800 text-sm">
                    Keep the extension pinned to your toolbar for easy access. You can click the extension icon anytime to open the control panel.
                  </p>
                </div>
              </div>

              <!-- Activation -->
              <div :id="sections[3].id" class="mb-16 scroll-mt-6">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-key text-yellow-600"></i>
                  </div>
                  License Activation
                </h2>

                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-4">Activating Your License</h3>
                  <ol class="space-y-4">
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold mr-4">1</span>
                      <div>
                        <p class="font-semibold text-gray-900">Open Extension</p>
                        <p class="text-gray-600 text-sm">Click the extension icon in your browser toolbar</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold mr-4">2</span>
                      <div>
                        <p class="font-semibold text-gray-900">Enter License Key</p>
                        <p class="text-gray-600 text-sm mb-2">Copy your license key from the dashboard or email</p>
                        <div class="bg-white rounded-lg p-3 border border-gray-300 font-mono text-sm">
                          XXXX-XXXX-XXXX-XXXX
                        </div>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold mr-4">3</span>
                      <div>
                        <p class="font-semibold text-gray-900">Click Activate</p>
                        <p class="text-gray-600 text-sm">The extension will verify your license with our servers</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4">✓</span>
                      <div>
                        <p class="font-semibold text-green-600">Activation Complete!</p>
                        <p class="text-gray-600 text-sm">You'll see "License Active" status with expiry date</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h4 class="font-bold text-red-900 mb-2">
                    <i class="fas fa-exclamation-circle mr-2"></i>Troubleshooting Activation Issues
                  </h4>
                  <ul class="space-y-2 text-red-800 text-sm">
                    <li>• <strong>Invalid License Key:</strong> Double-check for typos or extra spaces</li>
                    <li>• <strong>License Already Used:</strong> Each key works on one device only</li>
                    <li>• <strong>Network Error:</strong> Check your internet connection</li>
                    <li>• <strong>License Expired:</strong> Renew your subscription from dashboard</li>
                  </ul>
                </div>
              </div>

              <!-- Using the Extension -->
              <div :id="sections[4].id" class="mb-16 scroll-mt-6">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-play-circle text-blue-600"></i>
                  </div>
                  Using the Extension
                </h2>

                <h3 class="text-2xl font-bold text-gray-900 mb-4">Extension Interface</h3>
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-bold text-gray-900 mb-3">
                        <i class="fas fa-clock text-primary mr-2"></i>Delay (ms)
                      </h4>
                      <p class="text-gray-600 text-sm mb-2">
                        Time delay between scraping each ad (in milliseconds)
                      </p>
                      <ul class="text-sm text-gray-600 space-y-1">
                        <li>• <strong>Recommended:</strong> 2000ms (2 seconds)</li>
                        <li>• <strong>Faster:</strong> 1000ms (may trigger rate limits)</li>
                        <li>• <strong>Safer:</strong> 3000ms (slower but more stable)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 class="font-bold text-gray-900 mb-3">
                        <i class="fas fa-hashtag text-primary mr-2"></i>Max Ads
                      </h4>
                      <p class="text-gray-600 text-sm mb-2">
                        Maximum number of ads to scrape in one session
                      </p>
                      <ul class="text-sm text-gray-600 space-y-1">
                        <li>• <strong>Default:</strong> 100 ads</li>
                        <li>• <strong>Small Dataset:</strong> 50 ads</li>
                        <li>• <strong>Large Dataset:</strong> 500+ ads</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 class="text-2xl font-bold text-gray-900 mb-4">Processing Modes</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div class="flex items-center mb-4">
                      <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-laptop text-2xl"></i>
                      </div>
                      <h4 class="text-xl font-bold">Local Mode</h4>
                    </div>
                    <p class="text-blue-100 text-sm mb-4">
                      Data is processed on your computer using our Windows application
                    </p>
                    <ul class="space-y-2 text-sm text-blue-100">
                      <li class="flex items-start">
                        <i class="fas fa-check mr-2 mt-1"></i>
                        <span>Faster processing speed</span>
                      </li>
                      <li class="flex items-start">
                        <i class="fas fa-check mr-2 mt-1"></i>
                        <span>More privacy (data stays local)</span>
                      </li>
                      <li class="flex items-start">
                        <i class="fas fa-times mr-2 mt-1"></i>
                        <span>Requires Windows app running</span>
                      </li>
                    </ul>
                  </div>

                  <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div class="flex items-center mb-4">
                      <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-server text-2xl"></i>
                      </div>
                      <h4 class="text-xl font-bold">Server Mode</h4>
                    </div>
                    <p class="text-purple-100 text-sm mb-4">
                      Data is processed on our secure cloud servers
                    </p>
                    <ul class="space-y-2 text-sm text-purple-100">
                      <li class="flex items-start">
                        <i class="fas fa-check mr-2 mt-1"></i>
                        <span>No Windows app needed</span>
                      </li>
                      <li class="flex items-start">
                        <i class="fas fa-check mr-2 mt-1"></i>
                        <span>Works from anywhere</span>
                      </li>
                      <li class="flex items-start">
                        <i class="fas fa-times mr-2 mt-1"></i>
                        <span>Requires internet connection</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 class="text-2xl font-bold text-gray-900 mb-4">Scraping Process</h3>
                <div class="bg-gray-50 rounded-xl p-6">
                  <ol class="space-y-4">
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">1</span>
                      <div>
                        <p class="font-semibold text-gray-900">Navigate to Google Ads Transparency Center</p>
                        <p class="text-gray-600 text-sm">
                          <a href="https://adstransparency.google.com" target="_blank" class="text-primary hover:underline">
                            https://adstransparency.google.com
                          </a>
                        </p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">2</span>
                      <div>
                        <p class="font-semibold text-gray-900">Click Extension Icon</p>
                        <p class="text-gray-600 text-sm">Open the extension control panel</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">3</span>
                      <div>
                        <p class="font-semibold text-gray-900">Configure Settings</p>
                        <p class="text-gray-600 text-sm">Set delay, max ads, and processing mode</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">4</span>
                      <div>
                        <p class="font-semibold text-gray-900">Click "Start"</p>
                        <p class="text-gray-600 text-sm">The extension will begin scraping ads automatically</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">5</span>
                      <div>
                        <p class="font-semibold text-gray-900">Monitor Progress</p>
                        <p class="text-gray-600 text-sm">Watch the counter showing ads collected</p>
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4">✓</span>
                      <div>
                        <p class="font-semibold text-green-600">View Dashboard</p>
                        <p class="text-gray-600 text-sm">Click "View Dashboard" to see collected data</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <!-- AI Features -->
              <div :id="sections[5].id" class="mb-16 scroll-mt-6">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-brain text-indigo-600"></i>
                  </div>
                  AI-Powered Features
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                    <div class="flex items-center mb-4">
                      <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-globe text-white"></i>
                      </div>
                      <h4 class="text-lg font-bold text-gray-900">Market Overview</h4>
                    </div>
                    <p class="text-gray-700 text-sm mb-3">
                      Get comprehensive market analysis and identify emerging trends
                    </p>
                    <ul class="space-y-1 text-sm text-gray-600">
                      <li>• Industry trend analysis</li>
                      <li>• Market size estimation</li>
                      <li>• Growth predictions</li>
                    </ul>
                  </div>

                  <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                    <div class="flex items-center mb-4">
                      <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-users text-white"></i>
                      </div>
                      <h4 class="text-lg font-bold text-gray-900">Competitor Analysis</h4>
                    </div>
                    <p class="text-gray-700 text-sm mb-3">
                      Deep dive into competitor strategies and performance
                    </p>
                    <ul class="space-y-1 text-sm text-gray-600">
                      <li>• Spending patterns</li>
                      <li>• Ad creative analysis</li>
                      <li>• Target audience insights</li>
                    </ul>
                  </div>

                  <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                    <div class="flex items-center mb-4">
                      <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-bullhorn text-white"></i>
                      </div>
                      <h4 class="text-lg font-bold text-gray-900">Campaign Optimizer</h4>
                    </div>
                    <p class="text-gray-700 text-sm mb-3">
                      Get AI-powered recommendations to optimize campaigns
                    </p>
                    <ul class="space-y-1 text-sm text-gray-600">
                      <li>• Budget allocation</li>
                      <li>• Targeting suggestions</li>
                      <li>• Creative recommendations</li>
                    </ul>
                  </div>

                  <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
                    <div class="flex items-center mb-4">
                      <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-chart-line text-white"></i>
                      </div>
                      <h4 class="text-lg font-bold text-gray-900">Trend Prediction</h4>
                    </div>
                    <p class="text-gray-700 text-sm mb-3">
                      Forecast future market movements and opportunities
                    </p>
                    <ul class="space-y-1 text-sm text-gray-600">
                      <li>• Spending forecasts</li>
                      <li>• Market shift predictions</li>
                      <li>• Risk assessment</li>
                    </ul>
                  </div>

                  <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
                    <div class="flex items-center mb-4">
                      <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-dollar-sign text-white"></i>
                      </div>
                      <h4 class="text-lg font-bold text-gray-900">ROI Estimator</h4>
                    </div>
                    <p class="text-gray-700 text-sm mb-3">
                      Calculate potential returns on ad investments
                    </p>
                    <ul class="space-y-1 text-sm text-gray-600">
                      <li>• Campaign ROI calculation</li>
                      <li>• Budget recommendations</li>
                      <li>• Performance benchmarking</li>
                    </ul>
                  </div>

                  <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
                    <div class="flex items-center mb-4">
                      <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <i class="fas fa-comments text-white"></i>
                      </div>
                      <h4 class="text-lg font-bold text-gray-900">Ask AI Anything</h4>
                    </div>
                    <p class="text-gray-700 text-sm mb-3">
                      Get custom answers about your scraped data
                    </p>
                    <ul class="space-y-1 text-sm text-gray-600">
                      <li>• Natural language queries</li>
                      <li>• Custom data analysis</li>
                      <li>• Real-time responses</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Troubleshooting -->
              <div :id="sections[6].id" class="mb-16 scroll-mt-6">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-wrench text-red-600"></i>
                  </div>
                  Troubleshooting
                </h2>

                <div class="space-y-6">
                  <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h4 class="font-bold text-gray-900 mb-3 flex items-center">
                      <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                      Extension Not Working
                    </h4>
                    <ul class="space-y-2 text-gray-700 text-sm">
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">1.</span>
                        <span>Refresh the page and try again</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">2.</span>
                        <span>Check if license is still active in dashboard</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">3.</span>
                        <span>Disable other extensions that might conflict</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">4.</span>
                        <span>Clear browser cache and cookies</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">5.</span>
                        <span>Reinstall the extension</span>
                      </li>
                    </ul>
                  </div>

                  <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h4 class="font-bold text-gray-900 mb-3 flex items-center">
                      <i class="fas fa-ban text-red-500 mr-2"></i>
                      Scraping Stopped or Slow
                    </h4>
                    <ul class="space-y-2 text-gray-700 text-sm">
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">•</span>
                        <span><strong>Increase delay:</strong> Set to 3000ms or higher</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">•</span>
                        <span><strong>Check internet:</strong> Ensure stable connection</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">•</span>
                        <span><strong>Reduce max ads:</strong> Try scraping fewer ads per session</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">•</span>
                        <span><strong>Switch mode:</strong> Try Server mode if Local mode fails</span>
                      </li>
                    </ul>
                  </div>

                  <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <h4 class="font-bold text-gray-900 mb-3 flex items-center">
                      <i class="fas fa-database text-blue-500 mr-2"></i>
                      Data Not Showing in Dashboard
                    </h4>
                    <ul class="space-y-2 text-gray-700 text-sm">
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">•</span>
                        <span>Wait a few seconds and refresh the dashboard</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">•</span>
                        <span>Check if scraping completed successfully</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">•</span>
                        <span>Verify you're logged into the correct account</span>
                      </li>
                      <li class="flex items-start">
                        <span class="font-semibold mr-2">•</span>
                        <span>Contact support if issue persists</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- FAQ Link -->
              <div :id="sections[7].id" class="scroll-mt-6">
                <div class="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 text-center text-white">
                  <i class="fas fa-question-circle text-5xl mb-4 opacity-80"></i>
                  <h3 class="text-2xl font-bold mb-4">Still Have Questions?</h3>
                  <p class="text-gray-100 mb-6">
                    Check our FAQ page or contact our support team
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <router-link 
                      to="/faq"
                      class="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition"
                    >
                      <i class="fas fa-question mr-2"></i>View FAQ
                    </router-link>
                    <router-link 
                      to="/contact"
                      class="border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-primary transition"
                    >
                      <i class="fas fa-envelope mr-2"></i>Contact Support
                    </router-link>
                  </div>
                </div>
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
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

export default {
  name: 'Documentation',
  components: { Navbar, Footer },
  setup() {
    const activeSection = ref('introduction');

    const sections = ref([
      { id: 'introduction', title: 'Introduction', icon: 'fas fa-info-circle' },
      { id: 'getting-started', title: 'Getting Started', icon: 'fas fa-rocket' },
      { id: 'installation', title: 'Installation', icon: 'fas fa-download' },
      { id: 'activation', title: 'Activation', icon: 'fas fa-key' },
      { id: 'using-extension', title: 'Using Extension', icon: 'fas fa-play-circle' },
      { id: 'ai-features', title: 'AI Features', icon: 'fas fa-brain' },
      { id: 'troubleshooting', title: 'Troubleshooting', icon: 'fas fa-wrench' },
      { id: 'support', title: 'Support', icon: 'fas fa-headset' }
    ]);

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        activeSection.value = sectionId;
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const section of sections.value) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            activeSection.value = section.id;
            break;
          }
        }
      }
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      activeSection,
      sections,
      scrollToSection
    };
  }
}
</script>
