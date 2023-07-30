package api

import (
	"audio-searcher/api/graph/resolver"
	"audio-searcher/api/handler"
	"audio-searcher/api/middleware"
	"audio-searcher/pkg/config"
	"audio-searcher/pkg/elasticsearch"
	"audio-searcher/pkg/logger"

	"github.com/cockroachdb/errors"
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

	r := gin.Default()
	r.GET("/ping", handler.GetPing)

	v1Router := r.Group("/v1")
	v1Router.Use(middleware.LoggerInjector(l))

	v1Router.GET("/audio_files", handler.GetAudioFiles(
		resolver.DI{EsClient: esc},
	))

	return r, nil
}
