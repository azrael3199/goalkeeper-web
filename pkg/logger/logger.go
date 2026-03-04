package logger

import (
	"context"
	"os"

	"github.com/rs/zerolog"
)

var Log zerolog.Logger

func Init(level string) {
	l, err := zerolog.ParseLevel(level)
	if err != nil {
		l = zerolog.InfoLevel
	}
	// Use zerolog global logger configuration
	Log = zerolog.New(os.Stdout).With().Timestamp().Logger().Level(l)
}

// WithCtx injects contextual info to log
func WithCtx(ctx context.Context) *zerolog.Event {
	// Extract from context e.g. trace_id, user_id
	// Will populate these in middleware
	event := Log.Info()

	if traceID, ok := ctx.Value("trace_id").(string); ok {
		event = event.Str("trace_id", traceID)
	}
	if spanID, ok := ctx.Value("span_id").(string); ok {
		event = event.Str("span_id", spanID)
	}
	if userID, ok := ctx.Value("user_id").(string); ok {
		event = event.Str("user_id", userID)
	}
	return event
}
