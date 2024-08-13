import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, push } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

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
console.log('Firebase initialisiert', app); // Log Firebase Initialisierung

// Mapping (Zuordnung von Modul <=> Tutor)
const tutorAssignments = {
    "IMT102-01 Mathematik Grundlagen II": "Annika Denkert",
    "IREN01 Requirements Engineering": "Bettina Maucher",
    "ISSE01 Seminar Software Engineering": "Carsten Skerra",
    "sonstiges": "Kein Tutor zugeordnet"
};

function submitReport() {
    const username = localStorage.getItem('username');
    const reportType = document.getElementById('reportType').value;
    const medium = document.getElementById('medium').value;
    const module = document.getElementById('module').value;
    const message = document.getElementById('message').value;
    console.log('Reportdaten:', { username, reportType, medium, module, message }); // Log der eingegebenen Daten

    if (!reportType || !medium || !module || !message) {
        alert('Bitte füllen Sie alle Felder aus.');
        console.log('Meldung abgebrochen: Nicht alle Felder ausgefüllt'); // Log bei unvollständiger Eingabe
        return;
    }

    const tutor = tutorAssignments[module] || "Kein Tutor zugeordnet";
    const newReport = {
        reporter: username,
        type: reportType,
        medium: medium,
        module: module,
        text: message,
        tutor: tutor,
        status: "neu",
        rating: 4
    };
    console.log('Neuer Report:', newReport); // Log des neuen Reports

    saveReportToFirebase(newReport);
}

function saveReportToFirebase(report) {
    const reportsRef = ref(db, 'realReports');
    console.log('Speichern des Reports in Firebase:', report); // Log bevor der Report gespeichert wird
    push(reportsRef, report)
        .then(() => {
            console.log('Report erfolgreich in Firebase gespeichert'); // Log bei erfolgreichem Speichern
            alert('Meldung erfolgreich übermittelt!');
            document.getElementById('korrekturForm').reset(); // Formular zurücksetzen
        })
        .catch(error => console.error('Fehler beim Übermitteln der Meldung:', error))
}

document.getElementById('submit').addEventListener('click', submitReport);
console.log('Submit-Button Event-Listener hinzugefügt'); // Log für Event-Listener Initialisierung

//Logout
const logoutBtn = document.querySelector(".logout-btn")
logoutBtn.addEventListener("click", () => {
    console.log('Logout-Button geklickt, Weiterleitung zur Login-Seite'); // Log beim Klicken auf den Logout-Button
    window.location.href = 'index.html'; //user wird auf login-Seite geleitet
})