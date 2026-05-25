// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvfRMsSrwdh86sjOgEyTbIVeKgWc_u2lY",
    authDomain: "biome-46040.firebaseapp.com",
    projectId: "biome-46040",
    storageBucket: "biome-46040.firebasestorage.app",
    messagingSenderId: "846157761068",
    appId: "1:846157761068:web:28670139a31b8f34055f89",
    measurementId: "G-16YR77FWC7"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics(); 