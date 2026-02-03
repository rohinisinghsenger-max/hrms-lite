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

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    console.log(employees,"===============================")
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
    setMsg(empError, err.message);
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
    setMsg(empError, err.message);
  } finally {
    btn.disabled = false;
  }
});

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  clearMsgs();

  const employee_id = document.getElementById("employee_id").value.trim();
  const full_name = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value.trim();

  if (!employee_id || !full_name || !email || !department) {
    return setMsg(empError, "All fields are required.");
  }
  if (!validateEmail(email)) {
    return setMsg(empError, "Please enter a valid email address.");
  }

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
    setMsg(empError, err.message);
  } finally {
    btnAdd.disabled = false;
    btnAdd.textContent = "Add Employee";
  }
});

btnRefresh.addEventListener("click", loadEmployees);
loadEmployees();
