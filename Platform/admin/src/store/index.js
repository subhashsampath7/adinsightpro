import { reactive } from 'vue';

export const store = reactive({
    admin: null,
    token: null,
    isAuthenticated: false,

    setAdmin(admin) {
        this.admin = admin;
        this.isAuthenticated = !!admin;
        if (admin) {
            localStorage.setItem('admin', JSON.stringify(admin));
        } else {
            localStorage.removeItem('admin');
        }
    },

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('adminToken', token);
        } else {
            localStorage.removeItem('adminToken');
        }
    },

    logout() {
        this.admin = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
    },

    initializeFromStorage() {
        const token = localStorage.getItem('adminToken');
        const admin = localStorage.getItem('admin');

        if (token && admin) {
            this.token = token;
            this.admin = JSON.parse(admin);
            this.isAuthenticated = true;
        }
    }
});