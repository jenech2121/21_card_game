# --- ЭТАП 1: Сборка фронтенда (Vue) ---
FROM node:20-alpine AS build-stage
WORKDIR /app

# Копируем конфиги и устанавливаем зависимости фронтенда
COPY package*.json ./
RUN npm install

# Копируем всё остальное и собираем статику
COPY . .
# ОБЯЗАТЕЛЬНО build, а не dev, чтобы Docker мог завершить сборку
RUN npm run build 

# --- ЭТАП 2: Финальный образ (Go + Node.js + Frontend) ---
FROM golang:1.21-alpine

# Устанавливаем Node.js и npm в образ с Go
RUN apk add --no-cache nodejs npm

WORKDIR /app

# 1. Копируем результат сборки Vue (папку dist)
COPY --from=build-stage /app/dist ./dist

# 2. Копируем папку с логикой сервера Node.js
COPY server ./server

# 3. Копируем package.json в корень и устанавливаем зависимости сервера
COPY package*.json ./
RUN npm install --production

# 4. Устанавливаем tsx и typescript глобально для запуска npx tsx
RUN npm install -g tsx typescript

# 5. Копируем оркестратор Go
COPY main.go go.mod ./
# Собираем бинарник (убрал лишний дефис в названии)
RUN go build -o main-server main.go

# Открываем порт для Render
EXPOSE 8080

# Запускаем Go-сервер
CMD ["./main-server"]