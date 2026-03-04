package pagination

import (
	"encoding/base64"
	"encoding/json"
	"time"
)

type Cursor struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
}

func Encode(cursor Cursor) string {
	b, _ := json.Marshal(cursor)
	return base64.URLEncoding.EncodeToString(b)
}

func Decode(encoded string) (Cursor, error) {
	var c Cursor
	b, err := base64.URLEncoding.DecodeString(encoded)
	if err != nil {
		return c, err
	}
	err = json.Unmarshal(b, &c)
	return c, err
}
