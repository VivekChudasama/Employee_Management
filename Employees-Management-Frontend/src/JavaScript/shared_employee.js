const BASE_EMPLOYEES_API = "http://localhost:3001/employees";
const BASE_ROLES_API = "http://localhost:3001/roles";

let allRoles = [];

// ── Fetch all roles from backend ──────────────
const fetchRoles = async () => {
  try {
    const res = await fetch(BASE_ROLES_API);
    if (!res.ok) throw new Error("Failed to fetch roles");
    const json = await res.json();
    allRoles = json.data || [];
  } catch (err) {
    console.error("Fetch Roles Error:", err);
    allRoles = [];
  }
};

// ── Build unique departments from roles list ──
const populateDepartments = (selectedDeptId = null) => {
  const deptSelect = document.getElementById("department_id");
  if (!deptSelect) return;

  deptSelect.innerHTML = '<option value="">-- Select Department --</option>';

  const seen = new Map();
  allRoles.forEach((r) => {
    const d = r.department;
    if (d && !seen.has(d.id)) seen.set(d.id, d.departmentName);
  });

  seen.forEach((name, id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = name;
    if (selectedDeptId && String(id) === String(selectedDeptId))
      opt.selected = true;
    deptSelect.appendChild(opt);
  });
};

// ── Fill role dropdown (optionally pre-select) ─
const populateRoles = (departmentId = null, selectedRoleId = null) => {
  const roleMenu = document.getElementById("roleDropdownMenu");
  const roleBtn = document.getElementById("roleDropdownBtn");
  const roleInput = document.getElementById("role_id");
  const salaryDisplay = document.getElementById("salary_display");

  if (!roleMenu) return;
  roleMenu.innerHTML = "";

  const list = departmentId
    ? allRoles.filter((r) => r.department?.id == departmentId)
    : allRoles;

  if (!list.length) {
    roleMenu.innerHTML =
      '<li><span class="dropdown-item text-muted">No roles available</span></li>';
    return;
  }

  list.forEach((role) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <a class="dropdown-item d-flex justify-content-between align-items-center role-option"
               href="#" data-id="${role.id}" data-salary="${role.salary}" data-name="${role.role}">
                <span>${role.role}</span>
                <span class="badge ms-2" style="background:var(--secondary-grey)">$${role.salary}</span>
            </a>`;
    roleMenu.appendChild(li);

    // Pre-select for edit mode
    if (selectedRoleId && String(role.id) === String(selectedRoleId)) {
      roleBtn.textContent = role.role;
      roleInput.value = role.id;
      salaryDisplay.value = `$${role.salary}`;
    }
  });

  // Single delegated click handler on the menu
  roleMenu.addEventListener(
    "click",
    (e) => {
      const item = e.target.closest(".role-option");
      if (!item) return;
      e.preventDefault();
      roleBtn.textContent = item.dataset.name;
      roleInput.value = item.dataset.id;
      salaryDisplay.value = `$${item.dataset.salary}`;
    },
    { once: true }
  ); // rebind each time populateRoles is called
};

// ── Reset the role picker ──────────────────────
const resetRolePicker = () => {
  const roleBtn = document.getElementById("roleDropdownBtn");
  const roleInput = document.getElementById("role_id");
  const salaryDisplay = document.getElementById("salary_display");
  if (roleBtn) roleBtn.textContent = "Select a role";
  if (roleInput) roleInput.value = "";
  if (salaryDisplay) salaryDisplay.value = "";
};

// ── Department filter → refresh role list ──────
const setupDepartmentFilter = () => {
  const deptSelect = document.getElementById("department_id");
  if (!deptSelect) return;
  deptSelect.addEventListener("change", () => {
    resetRolePicker();
    populateRoles(deptSelect.value || null);
  });
};

// ── Quick-add a new role card ──────────────────
const setupAddRole = () => {
  const saveBtn = document.getElementById("saveRoleBtn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", async () => {
    const roleName = document.getElementById("newRoleName")?.value.trim();
    const roleSalary = document.getElementById("newRoleSalary")?.value.trim();
    const deptId = document.getElementById("department_id")?.value;

    if (!roleName || !roleSalary || !deptId) {
      showToast(
        "Fill in Role Name, Salary, and select a Department first.",
        "warning"
      );
      return;
    }

    try {
      const res = await fetch(`${BASE_ROLES_API}/add-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleName,
          salary: Number(roleSalary),
          department_id: Number(deptId),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to add role.", "danger");
        return;
      }

      showToast("Role added!", "success");
      document.getElementById("newRoleName").value = "";
      document.getElementById("newRoleSalary").value = "";

      await fetchRoles();
      populateDepartments(deptId);
      populateRoles(deptId);
    } catch (err) {
      console.error("Add Role Error:", err);
      showToast("An error occurred while adding the role.", "danger");
    }
  });
};

// ── Toast notification ─────────────────────────
const showToast = (message, type = "success") => {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.cssText =
      "position:fixed;top:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `alert alert-${type} alert-dismissible fade show shadow`;
  toast.style.minWidth = "280px";
  toast.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};
