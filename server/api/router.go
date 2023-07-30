package api

import (
	"audio-searcher/api/graph/resolver"
	"audio-searcher/api/handler"
	"audio-searcher/api/middleware"
	"audio-searcher/pkg/config"
	"audio-searcher/pkg/elasticsearch"
	"audio-searcher/pkg/logger"
	"time"

	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/cockroachdb/errors"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/exp/slog"
)

type Option struct {
	Config config.Config
}

func NewRouter(o Option) (*gin.Engine, error) {
	l := logger.New(logger.Opts{
		Level: slog.LevelDebug,
	})

	esc, err := elasticsearch.NewClient(o.Config.Elasticsearch.User, o.Config.Elasticsearch.Pass)
	if err != nil {
		return nil, errors.Wrap(err, "failed to create elasticsearch client")
	}

	router := gin.Default()
	router.SetTrustedProxies([]string{"localhost", "127.0.0.1"})
	router.Use(
		cors.New(
			cors.Config{
				AllowOrigins: []string{"*"},
				AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
				AllowHeaders: []string{
					"Access-Control-Allow-Credentials",
					"Access-Control-Allow-Headers",
					"Content-Type",
					"Content-Length",
					"Accept-Encoding",
					"Authorization",
				},
				AllowCredentials: true,
				MaxAge:           24 * time.Hour,
			},
		),
		middleware.LoggerInjector(l),
	)

	// handler
	router.GET("/ping", handler.GetPing)
	v1Router := router.Group("/v1")
	v1Router.POST("/graphql", handler.PostV1GraphQL(
		resolver.DI{EsClient: esc},
	))
	v1Router.GET("/graphql/playground", func(ctx *gin.Context) {
		playground.Handler(
			"GraphQL playground",
			"/v1/graphql",
		).ServeHTTP(ctx.Writer, ctx.Request)
	})

	return router, nil
}
