import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHrWZkuQ9RGQxXdUjdRUtb2g3ttisHnAo",
  authDomain: "bomberman-cordova.firebaseapp.com",
  projectId: "bomberman-cordova",
  storageBucket: "bomberman-cordova.appspot.com",
  messagingSenderId: "720528832712",
  appId: "1:720528832712:web:8099933cd2152a01298dfd",
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function saveScore(res, difficulty) {
  try {
    const docRef = await addDoc(collection(db, "scores"), {
      result: res,
      difficulty: difficulty,
      gameDate: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getScores() {
  const col = collection(db, "scores");
  const citySnapshot = await getDocs(col);
  const list = citySnapshot.docs.map((doc) => doc.data());
  console.log(list);
  return list;
}

window.saveScore = saveScore;
window.getScores = getScores;
