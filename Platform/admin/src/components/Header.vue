<template>
  <div class="bg-white shadow-sm border-b px-8 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
        <p class="text-gray-600 text-sm mt-1">{{ subtitle }}</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-sm text-gray-600">{{ currentDate }}</p>
          <p class="text-xs text-gray-500">{{ currentTime }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  },
  setup() {
    const currentDate = ref('');
    const currentTime = ref('');
    let interval;

    const updateDateTime = () => {
      const now = new Date();
      currentDate.value = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      currentTime.value = now.toLocaleTimeString('en-US');
    };

    onMounted(() => {
      updateDateTime();
      interval = setInterval(updateDateTime, 1000);
    });

    onUnmounted(() => {
      if (interval) clearInterval(interval);
    });

    return {
      currentDate,
      currentTime
    };
  }
}
</script>