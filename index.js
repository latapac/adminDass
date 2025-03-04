
function getCompanyIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('companyId') || "";
}

// Auto-fill company ID when page loads
window.onload = function () {
    loadMachines(); // Load existing machines
    document.getElementById("companyIdInput").value = getCompanyIdFromURL();
};

document.querySelector(".companyadd").addEventListener("click", () => {
    loadPage("company.html")
    setTimeout(loadCompanies, 500)

})
document.querySelector(".machineadd").addEventListener("click", () => {
    window.location.href = `machine.html?companyId=${companyId} `;
    console.log("Adding user to company ID:", companyId);
})

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("main-content").innerHTML = data;


        })
        .catch(error => {
            console.error("Error loading page:", error);
        });
}

function attachAddCompanyListeners() {
    document.querySelector("#main-content").addEventListener("click", function (event) {
        if (event.target.id === "generateCompanyIdBtn") {
            generateCompanyId();
        } else if (event.target.id === "addCompanyBtn") {
            addCompany();
        }
    });
}

function generateCompanyId() {
    let now = new Date();
    let id = 'CMP-' + now.getSeconds()

    let companyIdField = document.getElementById('companyId');
    if (companyIdField) {
        companyIdField.value = id;
    }
}
function addMachine(companyId) {
    window.location.href = `machine.html?cid=${companyId}`;
    console.log("Adding machine to company ID:", companyId);
}
function addUser(companyId) {

    window.location.href = `user.html?companyId=${companyId} `;
    console.log("Adding user to company ID:", companyId);

}

function addCompany() {
    const companyName = document.getElementById('companyName')?.value;
    const companyId = document.getElementById('companyId')?.value;

    if (!companyName || !companyId) {
        alert("Please enter a company name and generate an ID!");
        return;
    }

    let now = new Date();
    let createdAt = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, '0') + "-" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0') + ":" +
        String(now.getSeconds()).padStart(2, '0');

    const companyData = { name: companyName, company_id: companyId, createdAt, disabled: false };

    fetch('http://64.227.139.217:3000/getcompany/11', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
    })
        .then(response => response.json())
        .then(data => {
            alert("Company added successfully!");

            let companies = JSON.parse(localStorage.getItem('companies')) || [];
            companies.push(companyData);
            localStorage.setItem('companies', JSON.stringify(companies));

            loadPage("view_companies.html");
        })
        .catch(error => {
            alert("Error adding company.");
            console.error('Error:', error);
        });
}

async function loadCompanies() {
    try {
        // Fetch data from the API
        const response = await fetch("http://64.227.139.217:3000/getAllCompany");
        const data = await response.json();
        // Get the table body element to populate with company data
        const companyTableBody = document.querySelector("#companyTableBody");  // Assuming this is the correct table body element
        
        companyTableBody.innerHTML = ''; // Clear table before reloading

        const companies = data.data || []; // Use the data fetched from API


        if (companies.length === 0) {
            companyTableBody.innerHTML = '<tr><td colspan="4">No companies registered.</td></tr>';
            return;
        }

        companies.forEach((company, index) => {
            const row = document.createElement('tr');
            row.dataset.index = index;

            const statusText = company.disabled ? 'Disabled' : 'Active';
            const buttonText = company.disabled ? 'Enable' : 'Disable';
            const buttonClass = company.disabled ? 'enable-btn' : 'disable-btn';           

            row.innerHTML = `
                <td>${company.name}</td>
                <td>${company.company_id}</td>
                <td class="status">${statusText}</td>
                <td>
                    <button class="action-btn ${buttonClass}" onclick="toggleCompanyStatus(${index})">${buttonText}</button>
                    <button class="action-btn machine-btn" onclick="addMachine('${company.company_id}')">View Machine</button>
                    <button class="action-btn user-btn" style="background-color:grey;" onclick="addUser('${company.company_id}')">Add User</button>
                </td>
            `;

            companyTableBody.appendChild(row);
        });
    } catch (error) {
        console.log('Error fetching companies:', error);
    }
}

// Example: Adding event listener for your "companyadd" button
document.querySelector(".companyadd").addEventListener("click", () => {
    loadPage("company.html");
    setTimeout(loadCompanies, 500);
});


function addNewCompanyRow() {
    const companyTableBody = document.getElementById('companyTableBody');

    // Prevent multiple input rows
    if (document.getElementById('newCompanyName')) {
        alert("Finish adding the current company first.");
        return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" id="newCompanyName" class="input-field" placeholder="Enter Company Name"></td>
        <td>
            <input type="text" id="newCompanyId" class="input-field" readonly>
            <button class="generate-id-btn" onclick="generateCompanyId()">Generate ID</button>
        </td>
        <td>Active</td>
        <td><button class="save-btn" onclick="saveNewCompany()">Save</button></td>
    `;

    companyTableBody.appendChild(newRow);
}

function generateCompanyId() {
    let now = new Date();
    let id = `CMP - ${now.getFullYear()}${now.getMonth() + 1}${now.getDate()} -${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()} `;
    document.getElementById('newCompanyId').value = id;
}

async function saveNewCompany() {
    const name = document.getElementById('newCompanyName')?.value.trim();
    const company_id = document.getElementById('newCompanyId')?.value;

    if (!name || !company_id) {
        alert("Please enter a company name and generate an ID!");
        return;
    }

    const res = await fetch('http://64.227.139.217:3000/addcompany', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company_id, createdAt: Date.now() })
    });

    console.log(await res.json());


    loadCompanies(); // Refresh table with new company added
}

function toggleCompanyStatus(index) {
    let companies = JSON.parse(localStorage.getItem('companies')) || [];
    companies[index].disabled = !companies[index].disabled;
    localStorage.setItem('companies', JSON.stringify(companies));
    loadCompanies(); // Refresh the table
}

window.onload = loadCompanies;
function loadMachines() {
    const machineTableBody = document.getElementById('machineTableBody');
    machineTableBody.innerHTML = '';

    const machines = fetch("http://64.227.139.217:3000/getMachine")

    if (machines.length === 0) {
        machineTableBody.innerHTML = '<tr><td colspan="7">No machines registered.</td></tr>';
        return;
    }

    machines.forEach((machine, index) => {
        const row = document.createElement('tr');

        const statusText = machine.disabled ? 'Disabled' : 'Active';
        const buttonText = machine.disabled ? 'Enable' : 'Disable';
        const buttonClass = machine.disabled ? 'enable-btn' : 'disable-btn';

        row.innerHTML = `
        <td> ${machine.serialNo}</td>
            <td>${machine.companyId}</td>
            <td>${machine.purchaseDate || '-'}</td>
            <td>${machine.activationDate || '-'}</td>
            <td class="status">${statusText}</td>
            <td>
                <button class="action-btn ${buttonClass}" onclick="toggleMachineStatus(${index})">${buttonText}</button>
            </td>
    `;

        machineTableBody.appendChild(row);
    });
}

function addNewMachineRow() {
    const machineTableBody = document.getElementById('machineTableBody');

    if (document.getElementById('newMachineSerial')) {
        alert("Finish adding the current machine first.");
        return;
    }

    // Get companyId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId') || '';

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" id="newMachineSerial" class="input-field" placeholder="Enter Machine Serial No."></td>

<td><input type="text" id="companyIdInput" class="input-field" value="${companyId}" readonly></td>
<td><input type="date" id="purchaseDate" class="input-field"></td>
<td><input type="date" id="activationDate" class="input-field"></td>
<td id="status">Active</td>
<td><button class="save-btn" onclick="saveNewMachine()">Save</button></td>
    `;

    machineTableBody.appendChild(newRow);
}




async function saveNewMachine() {
    const serialNo = document.getElementById('newMachineSerial')?.value.trim();
    const stat = document.getElementById('status')?.value === "Active" ? true : false;
    const companyId = document.getElementById('companyIdInput')?.value.trim();
    const purchaseDate = document.getElementById('purchaseDate')?.value;
    const activationDate = document.getElementById('activationDate')?.value;

    if (!serialNo || !machineId || !companyId) {
        alert("Please enter machine details and generate an ID!");
        return;
    }

    await fetch('http://64.227.139.217:3000/addMachine/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            company_id: companyId,
            serial_number: serialNo,
            purchase_date: purchaseDate,
            activation_date: activationDate,
            status: stat,

        })
    })

    const machines = JSON.parse(localStorage.getItem('machines')) || [];
    machines.push({ serialNo, machineId, companyId, purchaseDate, activationDate, disabled: false });
    localStorage.setItem('machines', JSON.stringify(machines));

    loadMachines();
}

function toggleMachineStatus(index) {
    let machines = JSON.parse(localStorage.getItem('machines')) || [];
    machines[index].disabled = !machines[index].disabled;
    localStorage.setItem('machines', JSON.stringify(machines));
    loadMachines();
}

window.onload = loadMachines;
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
        <td> ${user.username}</td>
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
    console.log("fun");

    const username = document.getElementById('newUsername')?.value.trim();
    const password = document.getElementById('newPassword')?.value.trim();
    const name = document.getElementById('newName')?.value.trim();
    const email = document.getElementById('newEmail')?.value.trim();
    const companyId = document.getElementById('companyIdInput')?.value.trim();
    const role = document.getElementById('newRole')?.value.trim();

    if (!username || !password) {
        alert("Please enter user details");
        return;
    }
    try {

        const res = await fetch('http://64.227.139.217:3000/signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: companyId,
                username: username,
                password: password,
                name: name,
                email: email,
                status: stat,

            })
        })


    } catch (error) {
        console.log("add");

    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username, password, name, email, companyId, role, disabled: false });
    localStorage.setItem('users', JSON.stringify(users));

    loadUsers();
}

function toggleUserStatus(index) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users[index].disabled = !users[index].disabled;
    localStorage.setItem('users', JSON.stringify(users));
    loadUsers();
}

window.onload = loadUsers;