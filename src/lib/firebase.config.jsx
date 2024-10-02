// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAOc-DrrqcyguSYNiom8V7SedEowxqKRog",
    authDomain: "ai-trip-planner-3c886.firebaseapp.com",
    projectId: "ai-trip-planner-3c886",
    storageBucket: "ai-trip-planner-3c886.appspot.com",
    messagingSenderId: "812928010572",
    appId: "1:812928010572:web:a24d0c2ec3d24137b7e7e9",
    measurementId: "G-FX8DC6DJ02"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);