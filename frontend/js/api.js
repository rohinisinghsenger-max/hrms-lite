// ✅ CHANGE THIS after backend deployment
// Example: https://your-backend.onrender.com
const BACKEND_BASE = "https://hrms-lite-backend-hmyy.onrender.com";
const API_BASE = `${BACKEND_BASE}/api`;


// Generic API helpers
async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    // Django/DRF errors often come as {detail: "..."} or field errors
    const msg =
      (data && data.detail) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

function apiGet(path) {
  return apiRequest(path, { method: "GET" });
}

function apiPost(path, payload) {
  return apiRequest(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function apiDelete(path) {
  return apiRequest(path, { method: "DELETE" });
}

// UI helpers (used by attendance.js / employees.js)
function show(el) {
  if (!el) return;
  el.classList.remove("hidden");
}

function hide(el) {
  if (!el) return;
  el.classList.add("hidden");
}
