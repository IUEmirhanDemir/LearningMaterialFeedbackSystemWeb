import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, onValue, update } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyB6zy51t1vNmO7kc4UMttKULROzFXMwHtk",
    authDomain: "cloud-2659a.firebaseapp.com",
    databaseURL: "https://cloud-2659a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cloud-2659a",
    storageBucket: "cloud-2659a.appspot.com",
    messagingSenderId: "729378152618",
    appId: "1:729378152618:web:f00a104b8e7c8c8e9570d3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function loadReports() {
    const reportsRef = ref(db, 'realReports');
    onValue(reportsRef, snapshot => {
        const data = snapshot.val();
        const tableBody = document.querySelector('#reportsTable tbody');
        tableBody.innerHTML = ''; 
        
        Object.keys(data).forEach(key => {
            const report = data[key];
            const row = tableBody.insertRow(-1);
            row.insertCell(0).textContent = report.module;
            row.insertCell(1).textContent = report.type;
            row.insertCell(2).textContent = report.medium;
            row.insertCell(3).textContent = report.tutor;
            row.insertCell(4).textContent = report.text;
            row.insertCell(5).appendChild(createPrioritySelect(report.rating, key));
            row.insertCell(6).appendChild(createStatusSelect(report.status, key));
            const actionCell = row.insertCell(7);
            const updateButton = createUpdateButton(key);
            actionCell.appendChild(updateButton);
        });
    });
}

function createPrioritySelect(rating, key) {
    const select = document.createElement('select');
    select.className = 'drop-down'; 
    select.innerHTML = `
        <option value="1" ${rating === 1 ? 'selected' : ''}>Niedrig</option>
        <option value="2" ${rating === 2 ? 'selected' : ''}>Mittel</option>
        <option value="3" ${rating === 3 ? 'selected' : ''}>Hoch</option>`;
    select.onchange = () => update(ref(db, 'realReports/' + key), { rating: parseInt(select.value) });
    return select;
}

function createStatusSelect(status, key) {
    const select = document.createElement('select');
    select.className = 'drop-down';
    select.innerHTML = `
        <option value="neu" ${status === 'neu' ? 'selected' : ''}>Neu</option>
        <option value="In Bearbeitung" ${status === 'In Bearbeitung' ? 'selected' : ''}>In Bearbeitung</option>
        <option value="Umgesetzt" ${status === 'Umgesetzt' ? 'selected' : ''}>Umgesetzt</option>
        <option value="Abgelehnt" ${status === 'Abgelehnt' ? 'selected' : ''}>Abgelehnt</option>`;
    select.onchange = () => update(ref(db, 'realReports/' + key), { status: select.value });
    return select;
}

function createUpdateButton(key) {
    const button = document.createElement('button');
    button.textContent = 'Update';
    button.className = 'btn-update'; 
    button.onclick = () => {
        updateReport(key); 
        alert('Wurde geupdatet'); 
    };    return button;
}


function updateReport(key) {
    console.log('Updating report with key:', key);
}

document.addEventListener('DOMContentLoaded', loadReports);
