package nats

import (
	"github.com/nats-io/nats.go"
)

type Client struct {
	Conn *nats.Conn
	JS   nats.JetStreamContext
}

func Connect(url string) (*Client, error) {
	nc, err := nats.Connect(url)
	if err != nil {
		return nil, err
	}
	js, err := nc.JetStream()
	if err != nil {
		nc.Close()
		return nil, err
	}
	return &Client{Conn: nc, JS: js}, nil
}

func (c *Client) Close() {
	if c.Conn != nil {
		c.Conn.Close()
	}
}
