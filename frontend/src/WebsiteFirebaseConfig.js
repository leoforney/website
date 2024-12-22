// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD1iNf3RCd3eOyLv-03RLrzTECLfy_GCVw",
    authDomain: "website-5e8d6.firebaseapp.com",
    projectId: "website-5e8d6",
    storageBucket: "website-5e8d6.appspot.com",
    messagingSenderId: "551232671623",
    appId: "1:551232671623:web:923308c1d6f18edf070d22",
    measurementId: "G-R2R04KCQYZ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export {
    firebaseApp
}
