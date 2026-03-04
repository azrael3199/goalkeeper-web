package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserIDKeyType string

const UserIDKey UserIDKeyType = "app.user_id"

type DB struct {
	Pool *pgxpool.Pool
}

func Connect(ctx context.Context, defaultURL string) (*DB, error) {
	config, err := pgxpool.ParseConfig(defaultURL)
	if err != nil {
		return nil, err
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, err
	}

	return &DB{Pool: pool}, nil
}

// WithTx handles transactions and applies RLS context correctly
func (db *DB) WithTx(ctx context.Context, fn func(pgx.Tx) error) error {
	tx, err := db.Pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Apply RLS
	userID, ok := ctx.Value(UserIDKey).(string)
	if ok && userID != "" {
		_, err := tx.Exec(ctx, "SET LOCAL app.user_id = $1", userID)
		if err != nil {
			return fmt.Errorf("failed to set RLS user_id: %w", err)
		}
	}

	if err := fn(tx); err != nil {
		return err
	}

	return tx.Commit(ctx)
}
