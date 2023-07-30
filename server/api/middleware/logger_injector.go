package middleware

import (
	"audio-searcher/pkg/logger"
	"context"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/exp/slog"
)

type TraceIDCtxKey struct{}

// リクエスト情報を含めてログに出力するためのミドルウェア
func LoggerInjector(l logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		startedAt := time.Now()

		newLogger := l.With(
			slog.String("path", c.Request.URL.Path),
			slog.String("method", c.Request.Method),
			slog.String("remote_addr", c.Request.RemoteAddr),
			slog.String("user_agent", c.Request.UserAgent()),
			slog.String("referer", c.Request.Referer()),
			slog.String("protocol", c.Request.Proto),
		)

		ctx := loggerWith(c.Request.Context(), newLogger)
		c.Request = c.Request.WithContext(ctx)

		c.Next()

		switch {
		case c.Writer.Status() >= 500:
			newLogger.Error(
				"internal server error",
				nil,
				slog.Duration("elapsed_time", time.Since(startedAt)),
				slog.Int("status_code", c.Writer.Status()),
			)
		case c.Writer.Status() >= 400:
			newLogger.Warning(
				"client error",
				slog.Duration("elapsed_time", time.Since(startedAt)),
				slog.Int("status_code", c.Writer.Status()),
			)
		default:
			newLogger.Info(
				"ok",
				slog.Duration("elapsed_time", time.Since(startedAt)),
				slog.Int("status_code", c.Writer.Status()),
			)
		}
	}
}

type loggerCtxKey struct{}

func LoggerFrom(ctx context.Context) logger.Logger {
	l, ok := ctx.Value(loggerCtxKey{}).(logger.Logger)
	if !ok {
		return logger.New(logger.Opts{
			Level: slog.LevelDebug,
		})
	}

	return l
}

func loggerWith(ctx context.Context, l logger.Logger) context.Context {
	return context.WithValue(ctx, loggerCtxKey{}, l)
}
