package storage

import (
	"context"
	"io"
)

type StorageUploadRequest struct {
	Bucket      string
	Key         string
	Body        io.Reader
	ContentType string
}

type Provider interface {
	Upload(ctx context.Context, req StorageUploadRequest) (string, error)
}
