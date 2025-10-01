export const Auth = {
    save(token) {
        localStorage.setItem("authToken", token);
    },
    clear() {
        localStorage.removeItem("authToken");
    },
    token() {
        return localStorage.getItem("authToken");
    },
    isLoggedIn() {
        return !!localStorage.getItem("authToken");
    },
};
