package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func main() {
	// 1. Запуск Node.js (Логика игры)
	go func() {
		log.Println("[Go] Запуск процесса Node.js (tsx)...")
		// Убедись, что путь server/index.ts верен относительно корня проекта
		cmd := exec.Command("npx", "tsx", "server/index.ts")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			log.Printf("[Go] Ошибка Node.js: %v", err)
		}
	}()

	// 2. Настройка прокси для API (/api/...)
	nodeURL, _ := url.Parse("http://127.0.0.1:3000")
	proxy := httputil.NewSingleHostReverseProxy(nodeURL)

	// 3. Единый обработчик для всего
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// А) Если запрос начинается с /api — отправляем в Node.js
		if strings.HasPrefix(r.URL.Path, "/api") {
			proxy.ServeHTTP(w, r)
			return
		}

		// Б) Обработка статических файлов (Vue)
		// Убираем начальный слэш и строим путь к файлу в папке dist
		path := filepath.Join("dist", filepath.Clean(r.URL.Path))

		// Проверяем, существует ли такой физический файл (картинка, js, css)
		info, err := os.Stat(path)
		
		// Если файла не существует или это папка (а не файл)
		if os.IsNotExist(err) || info.IsDir() {
			// Отдаем index.html (это нужно для работы маршрутизации Vue/SPA)
			http.ServeFile(w, r, filepath.Join("dist", "index.html"))
			return
		}

		// Если файл найден — отдаем его (браузер сам закэширует стили и скрипты)
		http.ServeFile(w, r, path)
	})

	// 4. Порт для Render
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("[Go] Оркестратор запущен на порту %s", port)
	log.Printf("[Go] Ссылка для Telegram: https://t.me/Mythic21gamebot/play")
	
	// Запуск сервера
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("[Go] Ошибка запуска сервера: ", err)
	}
}