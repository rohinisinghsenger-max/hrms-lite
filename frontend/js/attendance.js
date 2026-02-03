const employeeSelect = document.getElementById("employeeSelect");
const attendanceForm = document.getElementById("attendanceForm");

const attError = document.getElementById("attError");
const attSuccess = document.getElementById("attSuccess");

const btnMark = document.getElementById("btnMark");
const btnRefresh = document.getElementById("btnRefresh");

const tbody = document.getElementById("attendanceTbody");
const emptyAttendance = document.getElementById("emptyAttendance");
const recordsState = document.getElementById("recordsState");

const summaryText = document.getElementById("summaryText");

const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const btnApplyFilter = document.getElementById("btnApplyFilter");

function setMsg(el, msg) { el.textContent = msg; show(el); }
function clearMsgs() {
  hide(attError); attError.textContent = "";
  hide(attSuccess); attSuccess.textContent = "";
}

async function loadEmployeesDropdown() {
  employeeSelect.innerHTML = "";
  const employees = await apiGet("/employees/");

  if (!employees || employees.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No employees found - add employees first";
    employeeSelect.appendChild(opt);
    employeeSelect.disabled = true;
    return;
  }

  employeeSelect.disabled = false;
  for (const e of employees) {
    const opt = document.createElement("option");
    opt.value = e.id; // employee PK
    opt.textContent = `${e.employee_id} - ${e.full_name}`;
    employeeSelect.appendChild(opt);
  }
}

function getFilterQuery() {
  const f = fromDate.value;
  const t = toDate.value;
  const params = [];
  if (f) params.push(`from=${encodeURIComponent(f)}`);
  if (t) params.push(`to=${encodeURIComponent(t)}`);
  return params.length ? `?${params.join("&")}` : "";
}

async function loadSummary(employeeId) {
  try {
    const s = await apiGet(`/employees/${employeeId}/attendance/summary/`);
    summaryText.textContent = `Present: ${s.total_present} | Absent: ${s.total_absent}`;
  } catch {
    summaryText.textContent = "";
  }
}

async function loadAttendanceRecords() {
  clearMsgs();
  tbody.innerHTML = "";
  hide(emptyAttendance);

  const employeeId = employeeSelect.value;
  if (!employeeId) {
    recordsState.textContent = "";
    show(emptyAttendance);
    return;
  }

  recordsState.textContent = "Loading records...";

  try {
    const q = getFilterQuery();
    const records = await apiGet(`/employees/${employeeId}/attendance/${q}`);
    await loadSummary(employeeId);

    if (!records || records.length === 0) {
      recordsState.textContent = "";
      show(emptyAttendance);
      return;
    }

    recordsState.textContent = "";
    for (const r of records) {
      const tr = document.createElement("tr");
      const badge = r.status === "PRESENT"
        ? `<span class="badge text-bg-success">PRESENT</span>`
        : `<span class="badge text-bg-danger">ABSENT</span>`;
      tr.innerHTML = `<td>${r.date}</td><td>${badge}</td>`;
      tbody.appendChild(tr);
    }
  } catch (err) {
    recordsState.textContent = "";
    setMsg(attError, err.message);
  }
}

attendanceForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  clearMsgs();

  const employeeId = employeeSelect.value;
  const date = document.getElementById("attDate").value;
  const statusVal = document.getElementById("attStatus").value;

  if (!employeeId || !date || !statusVal) {
    return setMsg(attError, "Employee, date, and status are required.");
  }

  btnMark.disabled = true;
  btnMark.textContent = "Saving...";

  try {
    await apiGet("/attendance/", {
      method: "POST",
      body: JSON.stringify({
        employee: Number(employeeId),
        date,
        status: statusVal
      })
    });

    setMsg(attSuccess, "Attendance marked successfully.");
    await loadAttendanceRecords();
  } catch (err) {
    setMsg(attError, err.message);
  } finally {
    btnMark.disabled = false;
    btnMark.textContent = "Mark Attendance";
  }
});

employeeSelect.addEventListener("change", loadAttendanceRecords);
btnApplyFilter.addEventListener("click", loadAttendanceRecords);
btnRefresh.addEventListener("click", async () => {
  await loadEmployeesDropdown();
  await loadAttendanceRecords();
});

(async function init() {
  await loadEmployeesDropdown();
  await loadAttendanceRecords();
})();
