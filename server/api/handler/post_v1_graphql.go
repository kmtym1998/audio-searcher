package handler

import (
	"audio-searcher/api/graph/generated"
	"audio-searcher/api/graph/resolver"
	"audio-searcher/api/middleware"
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/cockroachdb/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"golang.org/x/exp/slog"

	"github.com/gin-gonic/gin"
)

func PostV1GraphQL(di resolver.DI) func(c *gin.Context) {
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(
		generated.Config{
			Resolvers: resolver.New(di),
		},
	))

	srv.SetErrorPresenter(func(ctx context.Context, e error) *gqlerror.Error {
		l := middleware.LoggerFrom(ctx)
		l.Error("graphql error", e)

		return graphql.DefaultErrorPresenter(ctx, e)
	})

	srv.SetRecoverFunc(func(ctx context.Context, v interface{}) error {
		err, ok := v.(error)
		if !ok {
			return errors.Newf("unknown panic: %v", v)
		}

		return errors.Wrap(err, "graphql panic")
	})

	srv.AroundResponses(func(ctx context.Context, next graphql.ResponseHandler) *graphql.Response {
		resp := next(ctx)
		l := middleware.LoggerFrom(ctx)

		if oc := graphql.GetOperationContext(ctx); oc != nil {
			l = l.With(
				slog.String("query", oc.RawQuery),
				slog.String("operation_name", oc.OperationName),
				slog.Group("stats",
					slog.Duration("read", oc.Stats.Read.End.Sub(oc.Stats.Read.Start)),
					slog.Duration("validation", oc.Stats.Validation.End.Sub(oc.Stats.Validation.Start)),
					slog.Duration("parsing", oc.Stats.Parsing.End.Sub(oc.Stats.Parsing.Start)),
				),
			)
		}

		l.Info("graphql request finished")

		return resp
	})

	return func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	}
}
