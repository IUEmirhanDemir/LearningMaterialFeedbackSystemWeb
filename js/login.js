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
        const userRef = ref(db, refPath);
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            for (let key in users) {
                if (users[key].username === username && users[key].password === password) {
                    resolve(true);
                    return;
                }
            }
            resolve(false);
        }, { onlyOnce: true });
    });
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Bitte alle Felder ausfüllen!');
        return;
    }

    const isProfessor = await checkCredentials('loginData/professors', username, password);
    if (isProfessor) {
        localStorage.setItem('username', username);
        window.location.href = '/LearningMaterialFeedbackSystemWeb/dashBoard.html';
        return;
    }

    const isStudent = await checkCredentials('loginData/students', username, password);
    if (isStudent) {
        localStorage.setItem('username', username);
        window.location.href = '/LearningMaterialFeedbackSystemWeb/reportsStudent.html';
        return;
    }

    alert('Benutzername oder Passwort falsch!');
}

document.getElementById('loginButton').addEventListener('click', (event) => {
    event.preventDefault(); 
    login();
});

document.getElementById('password').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        login();
    }
});

