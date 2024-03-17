export default {
    // Method to store authentication token in local storage
    setAuthToken(token) {
        localStorage.setItem('authToken', token);
    },
    // Method to retrieve authentication token from local storage
    getAuthToken() {
        return localStorage.getItem('authToken');
    },
    // Method to remove authentication token from local storage
    removeAuthToken() {
        localStorage.removeItem('authToken');
    },
    // Method to check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }
};