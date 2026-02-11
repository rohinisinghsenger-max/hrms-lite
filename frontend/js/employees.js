const form = document.getElementById("employeeForm");
const btnAdd = document.getElementById("btnAdd");
const btnRefresh = document.getElementById("btnRefresh");

const empError = document.getElementById("empError");
const empSuccess = document.getElementById("empSuccess");

const tbody = document.getElementById("employeesTbody");
const emptyState = document.getElementById("emptyState");
const listState = document.getElementById("listState");

function setMsg(el, msg) { el.textContent = msg; show(el); }

function clearMsgs() {
  hide(empError); empError.textContent = "";
  hide(empSuccess); empSuccess.textContent = "";
}

function show(el) { el.classList.remove("d-none"); }
function hide(el) { el.classList.add("d-none"); }

// Better email validation (still simple)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function normalizeEmployeeId(v) {
  return (v || "").trim().toUpperCase();
}

function validateEmployee({ employee_id, full_name, email, department }) {
  const errors = [];

  // Employee ID
  if (!employee_id) errors.push("Employee ID is required.");
  else {
    if (employee_id.length < 3) errors.push("Employee ID must be at least 3 characters.");
    if (employee_id.length > 20) errors.push("Employee ID must be at most 20 characters.");
    if (!/^[A-Z0-9_-]+$/.test(employee_id)) {
      errors.push("Employee ID can contain only letters, numbers, underscore (_) or hyphen (-).");
    }
    // Optional strict EMP pattern:
    // if (!/^EMP\d{3,}$/.test(employee_id)) errors.push("Employee ID should look like EMP001.");
  }

  // Full name
  if (!full_name) errors.push("Full Name is required.");
  else {
    if (full_name.length < 2) errors.push("Full Name must be at least 2 characters.");
    if (full_name.length > 60) errors.push("Full Name must be at most 60 characters.");
  }

  // Email
  if (!email) errors.push("Email is required.");
  else if (!validateEmail(email)) errors.push("Please enter a valid email address.");

  // Department
  if (!department) errors.push("Department is required.");
  else {
    if (department.length < 2) errors.push("Department must be at least 2 characters.");
    if (department.length > 40) errors.push("Department must be at most 40 characters.");
  }

  return errors;
}

// Helper: try to show nicer server error messages
function getNiceErrorMessage(err) {
  const status = err?.status;
  const msg = err?.message || "Something went wrong. Please try again.";

  if (status === 409) return "Employee ID already exists. Please use a different Employee ID.";
  // Some backends return 400 with duplicate message
  if (status === 400 && /duplicate|already/i.test(msg)) {
    return "Employee ID already exists. Please use a different Employee ID.";
  }
  return msg;
}

async function loadEmployees() {
  clearMsgs();
  listState.textContent = "Loading employees...";
  tbody.innerHTML = "";
  hide(emptyState);

  try {
    const employees = await apiRequest("/employees/");
    if (!employees || employees.length === 0) {
      listState.textContent = "";
      show(emptyState);
      return;
    }

    listState.textContent = "";

    for (const e of employees) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="fw-semibold">${e.employee_id}</td>
        <td>${e.full_name}</td>
        <td>${e.email}</td>
        <td>${e.department}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" data-id="${e.id}">
            Delete
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  } catch (err) {
    listState.textContent = "";
    setMsg(empError, getNiceErrorMessage(err));
  }
}

tbody.addEventListener("click", async (ev) => {
  const btn = ev.target.closest("button[data-id]");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  clearMsgs();
  btn.disabled = true;

  try {
    await apiRequest(`/employees/${id}/`, { method: "DELETE" });
    await loadEmployees();
    setMsg(empSuccess, "Employee deleted successfully.");
  } catch (err) {
    setMsg(empError, getNiceErrorMessage(err));
  } finally {
    btn.disabled = false;
  }
});

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  clearMsgs();

  // Normalize & trim
  const employee_id = normalizeEmployeeId(document.getElementById("employee_id").value);
  const full_name = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const department = document.getElementById("department").value.trim();

  // Validation
  const errors = validateEmployee({ employee_id, full_name, email, department });
  if (errors.length) return setMsg(empError, errors.join(" "));

  btnAdd.disabled = true;
  btnAdd.textContent = "Adding...";

  try {
    await apiRequest("/employees/", {
      method: "POST",
      body: JSON.stringify({ employee_id, full_name, email, department }),
    });
    form.reset();
    await loadEmployees();
    setMsg(empSuccess, "Employee added successfully.");
  } catch (err) {
    setMsg(empError, getNiceErrorMessage(err));
  } finally {
    btnAdd.disabled = false;
    btnAdd.textContent = "Add Employee";
  }
});

btnRefresh.addEventListener("click", loadEmployees);
loadEmployees();
