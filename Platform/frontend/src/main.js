import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import './assets/styles.css';

// Initialize store from localStorage
store.initializeFromStorage();

console.log('🚀 App starting with store:', {
    isAuthenticated: store.isAuthenticated,
    hasUser: !!store.user,
    hasToken: !!store.token
});

const app = createApp(App);
app.use(router);
app.mount('#app');