# C-Mate

매칭 서비스 마이페이지 프로젝트 — 프로필 보기/수정, 사진 관리 기능

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js (App Router, TypeScript) |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL 8.0 |

## 실행 방법


```bash
# 실행
docker-compose up --build

# 접속
http://localhost:3000
```

종료: `Ctrl+C` 또는 `docker-compose down`

DB 데이터 포함 완전 초기화: `docker-compose down -v`


## 프로젝트 구조

```
c-mate/
├── docker-compose.yml
├── frontend/                # Next.js
│   ├── src/app/             # 페이지
│   ├── src/components/      # 컴포넌트
│   └── next.config.ts       # API 프록시 설정
├── backend/                 # Express
│   └── src/
│       ├── controllers/     # 비즈니스 로직
│       ├── routes/          # API 라우트
│       ├── db/              # MySQL 연결 + 초기화 스크립트
│       ├── middleware/      # multer (이미지 업로드)
│       └── uploads/         # 이미지 저장소 (유저별 폴더)
└── docs/                    # 설계 히스토리
```
