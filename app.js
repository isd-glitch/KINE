import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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
const db = getFirestore(app);

// ユーザー状態の監視（Firestoreベースのログインに対応）
const currentUser = localStorage.getItem("currentUser");
if (currentUser) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    document.getElementById("logout").style.display = "block";
} else {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("chat-container").style.display = "none";
    document.getElementById("logout").style.display = "none";
}

// ログアウト
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
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

// トークルーム作成
const roomForm = document.getElementById("room-form");
roomForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const roomName = document.getElementById("room-name").value;

    try {
        await addDoc(collection(db, "rooms"), {
            name: roomName,
            createdAt: serverTimestamp(),
        });
        alert("トークルームが作成されました！");
    } catch (error) {
        console.error("トークルーム作成エラー:", error);
    }
});

// 友達追加
const friendForm = document.getElementById("friend-form");
friendForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const friendUsername = document.getElementById("friend-username").value;

    try {
        const userRef = collection(db, "users");
        const friendQuery = query(userRef, where("username", "==", friendUsername));
        const friendSnapshot = await getDocs(friendQuery);

        if (!friendSnapshot.empty) {
            await addDoc(collection(db, "friends"), {
                userId: auth.currentUser.uid,
                friendUsername: friendUsername,
            });
            alert("友達が追加されました！");
        } else {
            alert("ユーザーが見つかりませんでした。");
        }
    } catch (error) {
        console.error("友達追加エラー:", error);
    }
});
