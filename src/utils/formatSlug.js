export function formatSlug(s) {
    return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}