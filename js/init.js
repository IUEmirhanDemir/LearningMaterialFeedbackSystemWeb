// Importieren der Firebase-Module
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, set, update, remove, onValue } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

// Firebase Konfiguration

const firebaseConfig = {
    apiKey: "AIzaSyB6zy51t1vNmO7kc4UMttKULROzFXMwHtk",
    authDomain: "cloud-2659a.firebaseapp.com",
    databaseURL: "https://cloud-2659a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cloud-2659a",
    storageBucket: "cloud-2659a.appspot.com",
    messagingSenderId: "729378152618",
    appId: "1:729378152618:web:f00a104b8e7c8c8e9570d3"
};

// Initialisieren von Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// CRUD Operationen
function createData() {
    set(ref(db, 'dashboardData/reports/report4'), {
        assignment: "Prof. Neumann",
        medium: "Vorlesung",
        module: "Physik",
        rating: "3",
        reporter: "Erik Beispiel",
        status: "neu",
        text: "Gut strukturiert, aber schnelles Tempo",
        type: "Feedback"
    }).then(() => console.log('Create Operation: Data Created'));
}

function readData() {
    onValue(ref(db), (snapshot) => {
        console.log('Read Operation: All Data', snapshot.val());
    }, {
        onlyOnce: true
    });
}

function updateData() {
    update(ref(db, 'dashboardData/reports/report1'), {
        status: "überprüft"
    }).then(() => console.log('Update Operation: Data Updated'));
}

function deleteData() {
    remove(ref(db, 'dashboardData/reports/report4'))
    .then(() => console.log('Delete Operation: Data Deleted'));
}

// Ausführen der CRUD-Tests
createData();
setTimeout(readData, 1000); // Lesevorgang nach dem Erstellen
setTimeout(updateData, 2000); // Update nach dem Lesen
setTimeout(deleteData, 3000); // Löschen nach dem Update
setTimeout(readData, 4000); // Erneutes Lesen, um das Löschen zu überprüfen

