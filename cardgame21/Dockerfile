# --- ЭТАП 1: Сборка фронтенда (Vue) ---
FROM node:20-alpine AS build-stage
WORKDIR /app
# Используем корневой package.json для сборки Vue
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 

# --- ЭТАП 2: Финальный образ (Go + Node.js + Frontend) ---
FROM golang:1.21-alpine

# Устанавливаем Node.js и npm в образ с Go
RUN apk add --no-cache nodejs npm

WORKDIR /app

# 1. Копируем результат сборки Vue
COPY --from=build-stage /app/dist ./dist

# 2. Копируем папку сервера
COPY server ./server

# 3. !!! ВАЖНО !!! Устанавливаем зависимости именно для СЕРВЕРА
# Переходим в папку server, копируем её package.json и устанавливаем библиотеки
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
WORKDIR /app

# 4. Копируем корневой package.json (на всякий случай) и инструменты
COPY package*.json ./
RUN npm install -g tsx typescript

# 5. Копируем и собираем Go
COPY main.go go.mod ./
RUN go mod tidy
RUN go build -o main-server main.go

# Открываем порт
EXPOSE 8080

# Запускаем Go-сервер
CMD ["./main-server"]