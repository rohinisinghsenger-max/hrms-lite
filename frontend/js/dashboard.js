// frontend/js/dashboard.js
// Dashboard summary: Total employees, Present/Absent today, and per-employee summary table

(function () {
  const elLoading = document.getElementById("dashLoading");
  const elError = document.getElementById("dashError");
  const elCards = document.getElementById("dashCards");
  const elTableWrap = document.getElementById("dashTableWrap");
  const elEmpty = document.getElementById("emptyState");

  const elTotalEmployees = document.getElementById("totalEmployees");
  const elPresentToday = document.getElementById("presentToday");
  const elAbsentToday = document.getElementById("absentToday");

  const tbody = document.getElementById("summaryTbody");

  function showError(msg) {
    elError.textContent = msg;
    elError.classList.remove("hidden");
  }

  function hideError() {
    elError.classList.add("hidden");
    elError.textContent = "";
  }

  function todayISO() {
    // Local date in YYYY-MM-DD
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setLoading(isLoading) {
    if (isLoading) {
      elLoading.classList.remove("hidden");
      elCards.classList.add("hidden");
      elTableWrap.classList.add("hidden");
    } else {
      elLoading.classList.add("hidden");
      elCards.classList.remove("hidden");
      elTableWrap.classList.remove("hidden");
    }
  }

  async function loadDashboard() {
    hideError();
    setLoading(true);

    try {
      // 1) Fetch employees
      const employees = await apiGet("/employees/");

      elTotalEmployees.textContent = employees.length;

      if (!employees.length) {
        elPresentToday.textContent = "0";
        elAbsentToday.textContent = "0";
        tbody.innerHTML = "";
        elEmpty.classList.remove("hidden");
        setLoading(false);
        return;
      }

      elEmpty.classList.add("hidden");

      // 2) Compute today's Present/Absent by checking attendance of each employee for today
      const today = todayISO();

      const todayCalls = employees.map((e) =>
        apiGet(`/employees/${e.id}/attendance/?from=${today}&to=${today}`)
          .then((records) => ({ id: e.id, records }))
          .catch(() => ({ id: e.id, records: [] })) // if any error, treat as no record
      );

      const todayResults = await Promise.all(todayCalls);

      let present = 0;
      let absent = 0;

      // If no record for today => we don't count it as present/absent (neutral)
      // If you want "no record = absent", tell me and I’ll adjust.
      for (const r of todayResults) {
        if (r.records && r.records.length) {
          const st = r.records[0].status;
          if (st === "PRESENT") present += 1;
          else if (st === "ABSENT") absent += 1;
        }
      }

      elPresentToday.textContent = present;
      elAbsentToday.textContent = absent;

      // 3) Table: summary per employee (present/absent total)
      const summaryCalls = employees.map((e) =>
        apiGet(`/employees/${e.id}/attendance/summary/`)
          .then((sum) => ({ emp: e, sum }))
          .catch(() => ({ emp: e, sum: { total_present: 0, total_absent: 0 } }))
      );

      const summaryResults = await Promise.all(summaryCalls);

      // render
      tbody.innerHTML = summaryResults
        .map(({ emp, sum }) => {
          return `
            <tr>
              <td>${esc(emp.employee_id)}</td>
              <td>${esc(emp.full_name)}</td>
              <td>${esc(emp.department)}</td>
              <td>${esc(sum.total_present)}</td>
              <td>${esc(sum.total_absent)}</td>
            </tr>
          `;
        })
        .join("");

      setLoading(false);
    } catch (err) {
      setLoading(false);
      showError(err?.message || "Failed to load dashboard. Please check backend URL / CORS.");
      console.error(err);
    }
  }

  document.addEventListener("DOMContentLoaded", loadDashboard);
})();
