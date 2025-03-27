import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyDRKEOBtoHwCJs_my0verwwBGgVMt0FYZA",
    authDomain: "kine-e4175.firebaseapp.com",
    projectId: "kine-e4175",
    storageBucket: "kine-e4175.firebasestorage.app",
    messagingSenderId: "1017056457348",
    appId: "1:1017056457348:web:ccbfde1a2dd21d601408d1"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 匿名ログイン
signInAnonymously(auth).catch(console.error);

// ユーザー状態の監視
onAuthStateChanged(auth, user => {
    if (user) {
        console.log("ログインしました:", user.uid);
    } else {
        console.log("ログアウトしました");
    }
});

// メッセージ送信
const messageForm = document.getElementById("message-form");
messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
    messageInput.value = "";

    await addDoc(collection(db, "messages"), {
        text: message,
        createdAt: serverTimestamp(),
    });
});

// メッセージのリアルタイム取得
const messagesDiv = document.getElementById("messages");
const messagesQuery = query(collection(db, "messages"), orderBy("createdAt"));
onSnapshot(messagesQuery, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
        const message = doc.data();
        const div = document.createElement("div");
        div.textContent = message.text;
        messagesDiv.appendChild(div);
    });
});

// ログアウト
document.getElementById("logout").addEventListener("click", () => {
    signOut(auth).catch(console.error);
});
