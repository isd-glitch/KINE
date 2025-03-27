import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
    // ...existing Firebase config...
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ログインフォームの処理
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Firestoreでユーザーを検索
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username), where("password", "==", password));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // ユーザーが存在する場合
            alert("ログイン成功！");
            window.location.href = "index.html"; // メイン画面へ遷移
        } else {
            // ユーザーが存在しない場合、新規作成
            await addDoc(usersRef, { username, password });
            alert("新しいアカウントが作成されました！");
            window.location.href = "index.html"; // メイン画面へ遷移
        }
    } catch (error) {
        console.error("ログインエラー:", error);
    }
});
