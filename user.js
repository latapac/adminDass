function loadUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; 

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.length === 0) {
        userTableBody.innerHTML = '<tr><td colspan="8">No users registered.</td></tr>';
        return;
    }

    users.forEach((user, index) => {
        const row = document.createElement('tr');

        const statusText = user.disabled ? 'Disabled' : 'Active';
        const buttonText = user.disabled ? 'Enable' : 'Disable';
        const buttonClass = user.disabled ? 'enable-btn' : 'disable-btn';

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.name || '-'}</td>
            <td>${user.email || '-'}</td>
            <td>${user.companyId || '-'}</td>
            <td>${statusText}</td>
            <td>${user.role || '-'}</td>
            <td>
                <button class="action-btn ${buttonClass}" onclick="toggleUserStatus(${index})">${buttonText}</button>
            </td>
        `;

        userTableBody.appendChild(row);
    });
}

function addNewUserRow() {
    const userTableBody = document.getElementById('userTableBody');

    if (document.getElementById('newUsername')) {
        alert("Finish adding the current user first.");
        return;
    }

    // Get companyId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId') || '';

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" id="newUsername" class="input-field" placeholder="Enter Username"></td>
        <td><input type="password" id="newPassword" class="input-field" placeholder="Password"></td>
        <td><input type="text" id="newName" class="input-field" placeholder="Name"></td>
        <td><input type="email" id="newEmail" class="input-field" placeholder="Email"></td>
        <td><input type="text" id="companyIdInput" class="input-field" value="${companyId}" readonly></td>
        <td>Active</td>
        <td><input type="text" id="newRole" class="input-field" placeholder="Role"></td>
        <td><button class="save-btn" onclick="saveNewUser()">Save</button></td>
    `;

    userTableBody.appendChild(newRow);
}

async function saveNewUser() {
    console.log("Saving user...");

    const username = document.getElementById('newUsername')?.value.trim();
    const password = document.getElementById('newPassword')?.value.trim();
    const name = document.getElementById('newName')?.value.trim();
    const email = document.getElementById('newEmail')?.value.trim();
    const companyId = document.getElementById('companyIdInput')?.value.trim();
    const role = document.getElementById('newRole')?.value.trim();

    if (!username || !password) {
        alert("Please fill the details first !");
        return;
    }

    try {
        const res = await fetch('http://64.227.139.217:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: companyId,
                username: username,
                password: password,
                name: name,
                email: email,
                status: true,
                role: role
            })
        });

        // ✅ Extract JSON data from the response
        const data = await res.json();
        console.log("Server Response:", data);

        if (res.ok) {
            alert("User registered successfully!");

            // Save to localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({ username, password, name, email, companyId, role, disabled: false });
            localStorage.setItem('users', JSON.stringify(users));

            // Reload user list
            loadUsers();
        } else {
            alert("Error: " + (data.message || "Something went wrong"));
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to save user. Please check your connection.");
    }
}

function toggleUserStatus(index) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users[index].disabled = !users[index].disabled;
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
}

window.onload = loadUsers;
