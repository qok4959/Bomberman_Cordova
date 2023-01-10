import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAHrWZkuQ9RGQxXdUjdRUtb2g3ttisHnAo",
  authDomain: "bomberman-cordova.firebaseapp.com",
  projectId: "bomberman-cordova",
  storageBucket: "bomberman-cordova.appspot.com",
  messagingSenderId: "720528832712",
  appId: "1:720528832712:web:8099933cd2152a01298dfd",
};
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

async function saveScore(score, time) {
  try {
    const docRef = await addDoc(collection(db, "scores"), {
      gameResult: score,
      gameDuration: time,
      gameDate: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getScores() {
  const citiesCol = collection(db, "scores");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  console.log(cityList);
  return cityList;
}

window.saveScore = saveScore;
window.getScores = getScores;
