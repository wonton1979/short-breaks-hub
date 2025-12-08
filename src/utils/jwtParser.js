import { jwtDecode } from "jwt-decode";

export function parseJWT(token) {
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
}

export function isExpired(token) {
    try {
        const { exp } = jwtDecode(token);
        return exp < Date.now() / 1000;
    } catch {
        return true;
    }
}

export function getUserId() {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.sub;
    } catch {
        return null;
    }
}

