// Configuración de Firebase
//const firebaseConfig = {
//    apiKey: "870490705034",
//    authDomain: "TU_AUTH_DOMAIN",
//    projectId: "hoja-de-vida-on-line",
//    storageBucket: "TU_STORAGE_BUCKET",
//    messagingSenderId: "870490705034",
//    appId: "TU_APP_ID"
//};

// Inicializar Firebase
//const app = firebase.initializeApp(firebaseConfig);
//const db = firebase.firestore();

  // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyDLd8ykIxEt4Z_VN1tmDNZZPsq6oCbso8w",
    authDomain: "hoja-de-vida-on-line.firebaseapp.com",
    projectId: "hoja-de-vida-on-line",
    storageBucket: "hoja-de-vida-on-line.firebasestorage.app",
    messagingSenderId: "870490705034",
    appId: "1:870490705034:web:a86b4bd9e606467738b173",
    measurementId: "G-8KPYEJTB23"
    };

  // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const cvSection = document.getElementById('cv-section');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    const editImageBtn = document.getElementById('edit-image-btn');
    const profileImage = document.getElementById('profile-image');
    const editPersonalDataBtn = document.getElementById('edit-personal-data-btn');
    const editAcademicHistoryBtn = document.getElementById('edit-academic-history-btn');
    const editEmploymentHistoryBtn = document.getElementById('edit-employment-history-btn');
    const editCoursesBtn = document.getElementById('edit-courses-btn');

    const nameSpan = document.getElementById('name');
    const emailSpan = document.getElementById('email');
    const phoneSpan = document.getElementById('phone');
    const academicHistoryList = document.getElementById('academic-history');
    const employmentHistoryList = document.getElementById('employment-history');
    const coursesList = document.getElementById('courses');

    let currentUser = null;

    // Función para cargar datos desde Firebase
    async function loadUserData(username) {
        const userDoc = await db.collection('users').doc(username).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            profileImage.src = userData.image || 'https://via.placeholder.com/150';
            nameSpan.textContent = userData.name || '';
            emailSpan.textContent = userData.email || '';
            phoneSpan.textContent = userData.phone || '';

            academicHistoryList.innerHTML = '';
            (userData.academicHistory || []).forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                academicHistoryList.appendChild(li);
            });

            employmentHistoryList.innerHTML = '';
            (userData.employmentHistory || []).forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                employmentHistoryList.appendChild(li);
            });

            coursesList.innerHTML = '';
            (userData.courses || []).forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                coursesList.appendChild(li);
            });
        }
    }

    // Manejo del inicio de sesión
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const userDoc = await db.collection('users').doc(username).get();
        if (userDoc.exists && userDoc.data().password === password) {
            currentUser = username;
            loginSection.style.display = 'none';
            cvSection.style.display = 'block';
            loadUserData(currentUser);
        } else {
            alert('Credenciales incorrectas');
        }
    });

    // Manejo del registro
    registerBtn.addEventListener('click', async () => {
        const username = prompt('Ingrese un nombre de usuario:');
        const password = prompt('Ingrese una contraseña:');
        if (username && password) {
            await db.collection('users').doc(username).set({
                password: password,
                image: 'https://via.placeholder.com/150',
                name: '',
                email: '',
                phone: '',
                academicHistory: [],
                employmentHistory: [],
                courses: []
            });
            alert('Registro exitoso');
        }
    });

    // Manejo del cierre de sesión
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        loginSection.style.display = 'block';
        cvSection.style.display = 'none';
    });

    // Editar imagen
    editImageBtn.addEventListener('click', async () => {
        const newImageUrl = prompt('Ingrese la URL de la nueva imagen:');
        if (newImageUrl) {
            profileImage.src = newImageUrl;
            await db.collection('users').doc(currentUser).update({ image: newImageUrl });
        }
    });

    // Editar datos personales
    editPersonalDataBtn.addEventListener('click', async () => {
        const newName = prompt('Ingrese su nombre:', nameSpan.textContent);
        const newEmail = prompt('Ingrese su email:', emailSpan.textContent);
        const newPhone = prompt('Ingrese su teléfono:', phoneSpan.textContent);

        if (newName !== null && newEmail !== null && newPhone !== null) {
            nameSpan.textContent = newName;
            emailSpan.textContent = newEmail;
            phoneSpan.textContent = newPhone;

            await db.collection('users').doc(currentUser).update({
                name: newName,
                email: newEmail,
                phone: newPhone
            });
        }
    });

    // Editar historial académico
    editAcademicHistoryBtn.addEventListener('click', async () => {
        const currentHistory = Array.from(academicHistoryList.children).map(li => li.textContent).join(', ');
        const newHistory = prompt('Ingrese su historial académico (separado por comas):', currentHistory);

        if (newHistory !== null) {
            academicHistoryList.innerHTML = '';
            newHistory.split(',').forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.trim();
                academicHistoryList.appendChild(li);
            });

            await db.collection('users').doc(currentUser).update({
                academicHistory: newHistory.split(',').map(item => item.trim())
            });
        }
    });

    // Editar historial de empleo
    editEmploymentHistoryBtn.addEventListener('click', async () => {
        const currentHistory = Array.from(employmentHistoryList.children).map(li => li.textContent).join(', ');
        const newHistory = prompt('Ingrese su historial de empleo (separado por comas):', currentHistory);

        if (newHistory !== null) {
            employmentHistoryList.innerHTML = '';
            newHistory.split(',').forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.trim();
                employmentHistoryList.appendChild(li);
            });

            await db.collection('users').doc(currentUser).update({
                employmentHistory: newHistory.split(',').map(item => item.trim())
            });
        }
    });

    // Editar cursos realizados
    editCoursesBtn.addEventListener('click', async () => {
        const currentCourses = Array.from(coursesList.children).map(li => li.textContent).join(', ');
        const newCourses = prompt('Ingrese sus cursos realizados (separado por comas):', currentCourses);

        if (newCourses !== null) {
            coursesList.innerHTML = '';
            newCourses.split(',').forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.trim();
                coursesList.appendChild(li);
            });

            await db.collection('users').doc(currentUser).update({
                courses: newCourses.split(',').map(item => item.trim())
            });
        }
    });
});