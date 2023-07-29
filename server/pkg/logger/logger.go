package logger

import (
	"context"
	"io"
	"os"

	"golang.org/x/exp/slog"
)

type Logger struct {
	logger  *slog.Logger
	onError ErrorHookFunc
}

type Opts struct {
	Level       slog.Level
	ReplaceAttr func(groups []string, a slog.Attr) slog.Attr
	OnError     ErrorHookFunc
}

type ErrorHookFunc func(ctx context.Context, msg string, err error, arg ...any)

func New(opts Opts) *Logger {

	return &Logger{
		logger: slog.New(
			slog.NewJSONHandler(
				os.Stdout,
				&slog.HandlerOptions{
					Level:       opts.Level,
					ReplaceAttr: opts.ReplaceAttr,
				},
			),
		),
		onError: opts.OnError,
	}
}

func (l *Logger) With(args ...any) *Logger {
	return &Logger{
		logger:  l.logger.With(args...),
		onError: l.onError,
	}
}

func (l *Logger) Debug(msg string, arg ...any) {
	l.logger.Debug(msg, arg...)
}

func (l *Logger) Info(msg string, arg ...any) {
	l.logger.Info(msg, arg...)
}

func (l *Logger) Warning(msg string, arg ...any) {
	l.logger.Warn(msg, arg...)
}

func (l *Logger) Error(ctx context.Context, msg string, err error, arg ...any) {
	l.logger.Error(msg, arg...)

	go func() {
		// エラーログ出力後なにかやりたい時 (sentry に送るとか) は OnError() を呼び元から渡す
		if l.onError != nil {
			l.onError(ctx, msg, err, arg...)
		}
	}()
}

type DebugWriter struct {
	logger *Logger
}

func NewDebugWriterFrom(l *Logger) io.Writer {
	return &DebugWriter{
		logger: l,
	}
}

func (w *DebugWriter) Write(p []byte) (int, error) {
	w.logger.Debug(string(p))

	return len(p), nil
}
