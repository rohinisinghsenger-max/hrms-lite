// ✅ CHANGE THIS after backend deployment
// Example: https://your-backend.onrender.com
const BACKEND_BASE = "https://hrms-lite-backend-hmyy.onrender.com";
const API_BASE = `${BACKEND_BASE}/api`;



function show(el) { el.classList.remove("d-none"); }
function hide(el) { el.classList.add("d-none"); }

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && data.detail) ? data.detail : "Request failed";
    throw new Error(msg);
  }
  return data;
}
