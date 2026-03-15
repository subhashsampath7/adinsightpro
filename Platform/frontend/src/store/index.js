import { reactive } from 'vue';

export const store = reactive({
    user: null,
    token: null,
    isAuthenticated: false,

    setUser(user) {
        this.user = user;
        this.isAuthenticated = !!user;
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    },

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },

    logout() {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    initializeFromStorage() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            this.token = token;
            this.user = JSON.parse(user);
            this.isAuthenticated = true;
        }
    }
});