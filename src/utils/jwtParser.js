export function isExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.exp) return false;
        const now = Date.now() / 1000;
        return payload.exp < now;
    } catch (err) {
        return true;
    }
}


export function parseJWT(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}


export function getExpiryMs(token) {
    const p = parseJWT(token);
    return p?.exp ? p.exp * 1000 : null;
}


export function msUntilExpiry(token) {
    const expMs = getExpiryMs(token);
    if (!expMs) return 0;
    return expMs - Date.now();
}
