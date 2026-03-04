package cache

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type Cache struct {
	client *redis.Client
}

func Connect(url string) (*Cache, error) {
	opts, err := redis.ParseURL(url)
	if err != nil {
		return nil, err
	}
	client := redis.NewClient(opts)
	if err := client.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}
	return &Cache{client: client}, nil
}

func (c *Cache) Client() *redis.Client {
	return c.client
}
