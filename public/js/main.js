                const searchInput = document.getElementById('searchInput');
                const tbody = document.getElementById('employeeTableBody');
                let debounceTimeout;

                if (searchInput && tbody) {
                    searchInput.addEventListener('input', (e) => {
                        clearTimeout(debounceTimeout);
                        debounceTimeout = setTimeout(() => {
                            const query = e.target.value;
                            fetch(`/employees?ajax=true&search=${encodeURIComponent(query)}`)
                                .then(res => res.json())
                                .then(data => {
                                    tbody.innerHTML = ''; 
                                    if (data.length === 0) {
                                        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No Employees Found!</td></tr>';
                                    } else {
                                        data.forEach(emp => {
                                            const tr = document.createElement('tr');
                                            tr.innerHTML = `
                                                <td>${escapeHtml(emp.name)}</td>
                                                <td>${escapeHtml(emp.email)}</td>
                                                <td>${escapeHtml(emp.status)}</td>
                                                <td>
                                                    <a href="/employees/edit-employee/${emp.id}" class="btn">Edit</a>
                                                    <form action="/employees/delete-employee" method="POST" style="display:inline;">
                                                        <input type="hidden" value="${emp.id}" name="employeeId">
                                                        <button class="btn danger" type="submit">Delete</button>
                                                    </form>
                                                </td>
                                            `;
                                            tbody.appendChild(tr);
                                        });
                                    }
                                })
                                .catch(err => console.error(err));
                        }, 300);
                    });
                }

                function escapeHtml(unsafe) {
                    if (!unsafe) return '';
                    return unsafe
                        .toString()
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
                }