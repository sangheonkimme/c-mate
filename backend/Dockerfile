# Backend Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# 업로드 폴더 생성
RUN mkdir -p uploads

EXPOSE 4000

CMD ["node", "dist/index.js"]
