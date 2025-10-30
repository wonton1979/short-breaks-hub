import { useEffect } from "react";
import { isExpired } from "../utils/jwtParser";

export default function useTokenCountdown(onAlmostExpired, onExpired) {

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token===null) return;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (!payload.exp) return;

            const expMs = payload.exp * 1000;

            const timer = setInterval(() => {
                const left = expMs - Date.now();
                if (left <= 0) {
                    clearInterval(timer);
                    onExpired?.(); // token fully expired
                } else if (left <= 2 * 60 * 1000) {
                    onAlmostExpired?.(Math.floor(left / 1000));
                }
            }, 1000);

            return () => clearInterval(timer);
        } catch (err) {
            console.error("Bad token:", err);
        }
    }, );
}
