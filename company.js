function loadCompanies() {
    const companyTableBody = document.getElementById('companyTableBody');
    companyTableBody.innerHTML = '';

    const companies = JSON.parse(localStorage.getItem('companies')) || [];

    if (companies.length === 0) {
        companyTableBody.innerHTML = '<tr><td colspan="4">No companies registered.</td></tr>';
        return;
    }

    companies.forEach((company, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${company.name}</td>
            <td>${company.id}</td>
            <td>${company.active ? 'Active' : 'Disabled'}</td>
            <td>
                <button class="disable-btn" onclick="toggleCompanyStatus(${index})">${company.active ? 'Disable' : 'Enable'}</button>
            </td>
        `;
        companyTableBody.appendChild(row);
    });
}

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
        <td><input type="text" id="newCompanyId" class="input-field" placeholder="Enter Company ID"></td>
        <td>Active</td>
        <td>
            <button class="save-btn" onclick="saveNewCompany()">Save</button>
            <button class="cancel-btn" onclick="removeNewCompanyRow()">Cancel</button>
        </td>
    `;
    
    companyTableBody.appendChild(newRow);
}

// async function removeNewCompanyRow() {
//     const newRow = document.getElementById('newCompanyName')?.closest('tr');
//     if (newRow) newRow.remove();
// }

async function saveNewCompany() {
    const name = document.getElementById('newCompanyName')?.value.trim();
    const company_id = document.getElementById('newCompanyId')?.value.trim();

    if (!name || !id) {
        alert("Please enter company details.");
        return;
    }

    try {
        const res = await fetch('http://64.227.139.217:3000/addcompany', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, company_id, active: true })
        });
        
        const data = await res.json();
        console.log("Server Response:", data);

        if (res.ok) {
            alert("Company added successfully!");
            const companies = JSON.parse(localStorage.getItem('companies')) || [];
            companies.push({ name, company_id, active: true });
            localStorage.setItem('companies', JSON.stringify(companies));
            loadCompanies();
        } else {
            alert("Error: " + (data.message || "Something went wrong"));
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to save company. Please check your connection.");
    }
}

function toggleCompanyStatus(index) {
    let companies = JSON.parse(localStorage.getItem('companies')) || [];
    companies[index].active = !companies[index].active;
    localStorage.setItem('companies', JSON.stringify(companies));
    loadCompanies();
}

window.onload = loadCompanies;
