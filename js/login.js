import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

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

function checkCredentials(refPath, username, password) {
    return new Promise((resolve, reject) => {
        console.log(`Überprüfung der Anmeldedaten gestartet für Benutzer: ${username}`); // Log beim Start der Funktion

        const userRef = ref(db, refPath);
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            console.log('Benutzerdaten aus der Datenbank abgerufen:', users); // Log der abgerufenen Benutzerdaten
            for (let key in users) {
                console.log(`Überprüfe Benutzer: ${users[key].username}`); // Log für jeden Benutzer in der Schleife
                if (users[key].username === username && users[key].password === password) {
                    console.log('Anmeldedaten korrekt. Zugriff gewährt.'); // Log bei erfolgreicher Überprüfung
                    resolve(true);
                    return;
                }
            }
            console.log('Anmeldedaten falsch. Zugriff verweigert.'); // Log bei fehlgeschlagener Überprüfung
            resolve(false);
        }, { onlyOnce: true });
    });
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Login gestartet'); // Log beim Start der Funktion

    if (!username || !password) {
        alert('Bitte alle Felder ausfüllen!');
        console.log('Login abgebrochen: Benutzername oder Passwort fehlen'); // Log bei fehlenden Eingabefeldern
        return;
    }
    console.log(`Überprüfe Anmeldedaten für Benutzer: ${username}`); // Log vor der Überprüfung

    const isProfessor = await checkCredentials('loginData/professors', username, password);
    if (isProfessor) {
        console.log('Benutzer ist Professor. Weiterleitung zum Dashboard.'); // Log bei erfolgreicher Professor-Authentifizierung
        localStorage.setItem('username', username);
        window.location.href = '/LearningMaterialFeedbackSystemWeb/dashBoard.html';
        return;
    }

    const isStudent = await checkCredentials('loginData/students', username, password);
    if (isStudent) {
        console.log('Benutzer ist Student. Weiterleitung zu Reports-Seite.'); // Log bei erfolgreicher Studenten-Authentifizierung
        localStorage.setItem('username', username);
        window.location.href = '/LearningMaterialFeedbackSystemWeb/reportsStudent.html';
        return;
    }

    alert('Benutzername oder Passwort falsch!');
    console.log('Anmeldung fehlgeschlagen: Benutzername oder Passwort falsch'); // Log bei fehlerhaften Anmeldedaten
}

document.getElementById('loginButton').addEventListener('click', (event) => {
    event.preventDefault();
    console.log('Login-Button geklickt'); // Log beim Klicken des Login-Buttons
    login();
});

document.getElementById('password').addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        console.log('Enter-Taste bei Passwortfeld gedrückt'); // Log beim Drücken der Enter-Taste
        login();
    }
});

