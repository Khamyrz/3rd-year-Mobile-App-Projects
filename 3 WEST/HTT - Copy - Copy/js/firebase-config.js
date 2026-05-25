// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRLs8bWTT9yJFOwpOE3z7NSSg2ltfVMGI",
    authDomain: "habal-habal-taxi.firebaseapp.com",
    databaseURL: "https://habal-habal-taxi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "habal-habal-taxi",
    storageBucket: "habal-habal-taxi.appspot.com",
    messagingSenderId: "285356417418",
    appId: "1:285356417418:web:804cac14c999a842b1a873",
    measurementId: "G-E51WWBV9QC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage(); 