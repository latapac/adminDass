const queryString = window.location.search;

console.log(queryString);

const urlParams = new URLSearchParams(queryString);

const companyId = urlParams.get("cid")

console.log(companyId);

async function loadMachines() {
    const machineTableBody = document.getElementById('machineTableBody');
    machineTableBody.innerHTML = '';


    const result = await fetch("http://64.227.139.217:3000/getMachine/" + companyId)

    const data = await result.json()

    const machines = data.data

    console.log(machines);
    

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
            <td>${machine.serial_number}</td>
            <td>${machine.company_id}</td>
            <td>${machine.purchase_date || '-'}</td>
            <td>${machine.activation_date || '-'}</td>
            <td class="status">${statusText}</td>
           
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

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams.get("cid"));
    
    const companyId = urlParams.get("cid")

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
<td><input type="text" id="newMachineSerial" class="input-field" placeholder="Enter Machine Serial No."></td>

<td><input type="text" id="companyIdInput" class="input-field" value="${companyId}" readonly></td>
<td><input type="date" id="purchaseDate" class="input-field"></td>
<td><input type="date" id="activationDate" class="input-field"></td>
<td>Active</td>
<td><button class="save-btn" onclick="saveNewMachine()">Save</button></td>
`;

    machineTableBody.appendChild(newRow);
}




async function saveNewMachine() {
    const serialNo = document.getElementById('newMachineSerial')?.value.trim();

    const companyId = document.getElementById('companyIdInput')?.value.trim();
    const purchaseDate = document.getElementById('purchaseDate')?.value;
    const activationDate = document.getElementById('activationDate')?.value;

    if (!serialNo || !companyId) {
        alert("Please enter machine details and generate an ID!");
        return;
    }
    try {

        const res = await fetch('http://64.227.139.217:3000/addMachine/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_id: companyId,
                serial_number: serialNo,
                purchase_date: purchaseDate,
                activation_date: activationDate,
                status: true,
            })
        })
        console.log(res);


    } catch (error) {
        console.log(error);

    }
   

    loadMachines();
}

function toggleMachineStatus(index) {
    let machines = JSON.parse(localStorage.getItem('machines')) || [];
    machines[index].disabled = !machines[index].disabled;
    localStorage.setItem('machines', JSON.stringify(machines));
    loadMachines();
}

window.onload = loadMachines;