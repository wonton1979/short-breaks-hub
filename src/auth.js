export const Auth = {
    save(token,emailVerified) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("emailVerified", emailVerified);
    },
    clear() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("emailVerified");
    },
    token() {
        return localStorage.getItem("authToken");
    },
    isLoggedIn() {
        return !!localStorage.getItem("authToken");
    },
    isEmailVerified() {
        return localStorage.getItem("emailVerified") === "true";
    }
};
