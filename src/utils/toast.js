export function showToast(message, { variant = 'success', duration = 2200 } = {}) {
    const root = document.getElementById('toast-root');
    const wrap = document.createElement('div');

    const base = "pointer-events-auto rounded border px-4 py-2 shadow-sm flex items-center gap-2";
    const styles = variant === 'success'
        ? "bg-white border-emerald-200"
        : variant === 'error'
            ? "bg-white border-red-200"
            : "bg-white border-slate-200";

    wrap.className = `${base} ${styles}`;
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-live', 'polite');

    wrap.innerHTML = `
    <span class="text-lg ${variant==='error' ? 'text-red-700' : 'text-emerald-700'}">${message}</span>
    <button class="ml-2 text-slate-500 hover:text-slate-700 text-xs">Dismiss</button>
  `;

    const btn = wrap.querySelector('button');
    btn.onclick = () => root.removeChild(wrap);

    root.appendChild(wrap);
    setTimeout(() => { if (root.contains(wrap)) root.removeChild(wrap); }, duration);
}
