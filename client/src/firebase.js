import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAZunezIrbWYmo1sVFNR8_vJoQC42dc0q4",
  authDomain: "cbc-conversations-community.firebaseapp.com",
  databaseURL: "https://cbc-conversations-community-default-rtdb.firebaseio.com",
  projectId: "cbc-conversations-community",
  storageBucket: "cbc-conversations-community.firebasestorage.app",
  messagingSenderId: "212684196262",
  appId: "1:212684196242:web:ba03450971289b17eb6767",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);