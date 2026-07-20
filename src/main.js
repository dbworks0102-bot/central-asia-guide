// アプリ初期化・ルーター起動
import "./styles.css";
import { createRouter } from "./router.js";

const root = document.getElementById("app");
const router = createRouter(root);
router.start();
