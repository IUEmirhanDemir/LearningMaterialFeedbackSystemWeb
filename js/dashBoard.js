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


        const sortedKeys = Object.keys(data).sort((a, b) => {
            // Sortiere zuerst nach Status (neu immer ganz oben)
            const statusOrder = { 'neu': 0, 'In Bearbeitung': 1, 'Umgesetzt': 2, 'Abgelehnt': 3 };
            if (statusOrder[data[a].status] !== statusOrder[data[b].status]) {
                return statusOrder[data[a].status] - statusOrder[data[b].status];
            }
            // Dann nach Bewertung, falls Status gleich ist
            return data[b].rating - data[a].rating;
        });

        const tableBody = document.querySelector('#reportsTable tbody');
        tableBody.innerHTML = '';

        sortedKeys.forEach(key => {
            const report = data[key];
            const row = tableBody.insertRow(-1);

            row.insertCell(0).textContent = report.reporter;
            row.insertCell(1).textContent = report.module;
            row.insertCell(2).textContent = report.type;
            row.insertCell(3).textContent = report.medium;
            row.insertCell(4).textContent = report.tutor;
            row.insertCell(5).textContent = report.text;
            const ratingCell = row.insertCell(6).appendChild(createPrioritySelect(report.rating, key));
            const statusCell = row.insertCell(7).appendChild(createStatusSelect(report.status, key));



            // farbanpassung an den Status //
            if (report.rating === 4 && report.status === 'neu') {
                row.style.backgroundColor = '#deecff ';
            }

            if (report.status === 'neu') {
                row.style.backgroundColor = '#deecff ';

                //Innerhalb der Prüfung, prüfen, ob alles andere als rating = 4 ist, wenn ja Button Farbe ändern.
                if (report.rating !== 4) {
                    statusCell.style.backgroundColor = '#ffcaca';
                }
            }

            // Wenn der status auf In Bearbeitung gestellt wird und keine rating vorhanden ist wird das Dropdown für Prio rot
            if (report.status === 'In Bearbeitung' && report.rating === 4) {
                ratingCell.style.backgroundColor = '#ffcaca';
            }

            if (report.status === 'Umgesetzt') {
                row.style.backgroundColor = '#e8ffde ';
                row.classList.add('grayed-out');
            } if (report.status === 'Abgelehnt') {
                row.style.backgroundColor = '#ffcaca';
                row.classList.add('grayed-out');
            }


        });
    });
}

function createPrioritySelect(rating, key) {
    const select = document.createElement('select');
    select.className = 'drop-down';
    select.innerHTML = `
        <option value="4" ${rating === 4 ? 'selected' : ''} disabled>Ohne Priorität</option>
        <option value="3" ${rating === 3 ? 'selected' : ''}>Hoch</option>
        <option value="2" ${rating === 2 ? 'selected' : ''}>Mittel</option>
        <option value="1" ${rating === 1 ? 'selected' : ''}>Niedrig</option>`;
    select.onchange = () => update(ref(db, 'realReports/' + key), { rating: parseInt(select.value) });
    return select;
}


function createStatusSelect(status, key) {
    const select = document.createElement('select');
    select.className = 'drop-down';
    select.innerHTML = `
        <option value="neu" ${status === 'neu' ? 'selected' : ''}disabled>Neu</option>
        <option value="In Bearbeitung" ${status === 'In Bearbeitung' ? 'selected' : ''}>In Bearbeitung</option>
        <option value="Umgesetzt" ${status === 'Umgesetzt' ? 'selected' : ''}>Umgesetzt</option>
        <option value="Abgelehnt" ${status === 'Abgelehnt' ? 'selected' : ''}>Abgelehnt</option>`;
    select.onchange = () => {
        /*   const prioritySelect = select.closest('tr').querySelector('select');
           const currentPriority = parseInt(prioritySelect.value);
           if (currentPriority === 4) { // Ohne Priorität
               prioritySelect.value = "1"; // Setze auf Niedrig
               update(ref(db, 'realReports/' + key), { rating: 1 });
           }*/
        update(ref(db, 'realReports/' + key), { status: select.value });
    };
    return select;
}


document.addEventListener('DOMContentLoaded', loadReports);

//Methode um den Header beim scrollen anzupassen
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function () {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop === 0) {
        // Ganz oben
        header.style.top = '0';
    } else if (scrollTop > lastScrollTop) {
        // Scroll nach unten
        header.style.top = '-100px'; // Höhe des Headers anpassen
    }
    lastScrollTop = scrollTop;
});
