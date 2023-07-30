package api

import (
	"audio-searcher/api/handler"
	"audio-searcher/api/middleware"
	"audio-searcher/pkg/config"
	"audio-searcher/pkg/logger"

	"github.com/gin-gonic/gin"
)

type Option struct {
	Config config.Config
	Logger logger.Logger
}

func NewRouter(o Option) *gin.Engine {
	r := gin.Default()
	r.GET("/ping", handler.GetPing)

	v1Router := r.Group("/v1")
	v1Router.Use(middleware.LoggerInjector(o.Logger))

	v1Router.GET("/audio_files", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "search",
		})
	})

	return r
}
