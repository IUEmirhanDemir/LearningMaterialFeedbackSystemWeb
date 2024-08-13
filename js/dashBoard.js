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

            // Differnzieren zwischen Spalte und Button(DropDown)
            const ratingCell = row.insertCell(6);
            const ratingSelect = createPrioritySelect(report.rating, key);
            ratingCell.appendChild(ratingSelect);

            const statusCell = row.insertCell(7);
            const statusSelect = createStatusSelect(report.status, key);
            statusCell.appendChild(statusSelect);

            //Wenn Status 'Umgesetzt' oder 'Abgelehnt' => DropDown deaktivieren
            if (report.status === 'Umgesetzt' || report.status === 'Abgelehnt') {
                console.log('Status ist "Umgesetzt" oder "Abgelehnt". Dropdowns werden deaktiviert.');
                ratingSelect.disabled = true;
                statusSelect.disabled = true;
            }

            // farbanpassung an den Status //
            if (report.status === 'In Bearbeitung') {
                row.style.backgroundColor = '#ffffff';
            }
            if (report.rating === 4 && report.status === 'neu') {
                row.style.backgroundColor = '#deecff ';
            }

            if (report.status === 'neu') {
                row.style.backgroundColor = '#deecff ';

                //Innerhalb der Prüfung, prüfen, ob alles andere als rating = 4 ist, wenn ja Button Farbe ändern.
                if (report.rating !== 4) {
                    statusSelect.style.backgroundColor = '#ffcaca';
                }
            }

            // Wenn der status auf In Bearbeitung gestellt wird und keine rating vorhanden ist wird das Dropdown für Prio rot
            if (report.status === 'In Bearbeitung' && report.rating === 4) {
                console.log('Status ist "In Bearbeitung" und Rating ist nicht 4. Rating-Dropdown wird rot hervorgehoben.');
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
        const prioritySelect = select.closest('tr').querySelector('select');
        const currentPriority = parseInt(prioritySelect.value);
        if (currentPriority === 4) { // => Prüfe, ob ein Rating festgelegt ist, bevor der Status geändert werden darf
            alert('Bitte zuerst die Priorisierung einstellen.');
            select.value = status; // => Setze den alten Wert zurück
        } else {
            update(ref(db, 'realReports/' + key), { status: select.value });
        }
    };

    return select;
}

//Logout
const logoutBtn = document.querySelector(".logout-btn")
logoutBtn.addEventListener("click", () => {
    console.log("Logout button clicked"); // Überprüfen, ob der Button-Klick registriert wird
    window.location.replace("index.html"); //user wird auf login-Seite geleitet
    console.log("Redirecting to index.html"); // Überprüfen, ob die Weiterleitung erfolgt
})


document.addEventListener('DOMContentLoaded', loadReports);

//Methode um den Header beim scrollen anzupassen
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function () {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    console.log(`ScrollTop: ${scrollTop}, LastScrollTop: ${lastScrollTop}`); // Scroll-Positionen
    if (scrollTop === 0) {
        // Ganz oben
        header.style.top = '0';
    } else if (scrollTop > lastScrollTop) {
        // Scroll nach unten
        header.style.top = '-100px'; // Höhe des Headers anpassen
        console.log('Scrolling down, hiding header');
    }
    lastScrollTop = scrollTop;
});
