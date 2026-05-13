package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/exec"
)

func main()  {
		go func()  {
			log.Println("Starting Node.js game logic...")
			cmd := exec.Command("npx", "tsx", "server/index.ts")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
			log.Printf("Node.js process error: %v", err)
			}
		
	}()
		nodeURL, _ := url.Parse("http://127.0.0.1:3000")
		proxy := httputil.NewSingleHostReverseProxy(nodeURL)

		http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	})

	fs := http.FileServer(http.Dir("./dist"))
	http.Handle("/", fs)

	// 4. Порт для Render
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Magic happens on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))


}