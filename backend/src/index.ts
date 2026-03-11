import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./routes/profile";
import { testConnection } from "./db/connection";
import { runMigrations } from "./db/migrate";
import { ensureUploadsDir, UPLOADS_DIR } from "./utils/uploads";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (업로드된 이미지)
ensureUploadsDir();
app.use("/uploads", express.static(UPLOADS_DIR));

// API 라우트
app.use("/api/profile", profileRoutes);

// 헬스 체크
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 서버 시작
const startServer = async () => {
  try {
    await testConnection();
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error("서버 시작 실패:", error);
    process.exit(1);
  }
};

startServer();
