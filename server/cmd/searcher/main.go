package main

import (
	"audio-searcher/api"
	"audio-searcher/pkg/config"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load() // nolint:errcheck

	cfg, err := config.New()
	if err != nil {
		panic(err)
	}

	r, err := api.NewRouter(api.Option{
		Config: cfg,
	})
	if err != nil {
		panic(err)
	}

	// Listen and Server in 0.0.0.0:8080
	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}
