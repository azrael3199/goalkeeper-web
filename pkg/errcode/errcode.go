package errcode

import (
	"fmt"
	"net/http"
)

type ErrorCode string

const (
	ErrUnknown           ErrorCode = "unknown_error"
	ErrNotFound          ErrorCode = "not_found"
	ErrBadRequest        ErrorCode = "bad_request"
	ErrUnauthorized      ErrorCode = "unauthorized"
	ErrForbidden         ErrorCode = "forbidden"
	ErrTokenExpired      ErrorCode = "token_expired"
	ErrTokenRevoked      ErrorCode = "token_revoked"
	ErrInvalidTransition ErrorCode = "invalid_transition"
	ErrAlreadyReviewed   ErrorCode = "already_reviewed"
	ErrOutOfStock        ErrorCode = "out_of_stock"
	ErrItemNotAvailable  ErrorCode = "item_not_available"
	ErrInsufficientCoins ErrorCode = "insufficient_coins"
	ErrRateLimited       ErrorCode = "rate_limited"
)

type AppError struct {
	Type     ErrorCode `json:"type"`
	Title    string    `json:"title"`
	Status   int       `json:"status"`
	Detail   string    `json:"detail"`
	Instance string    `json:"instance,omitempty"`
	Err      error     `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Detail, e.Err)
	}
	return e.Detail
}

func New(code ErrorCode, title string, status int, detail string) *AppError {
	return &AppError{
		Type:   code,
		Title:  title,
		Status: status,
		Detail: detail,
	}
}

var StatusMap = map[ErrorCode]int{
	ErrUnknown:           http.StatusInternalServerError,
	ErrNotFound:          http.StatusNotFound,
	ErrBadRequest:        http.StatusBadRequest,
	ErrUnauthorized:      http.StatusUnauthorized,
	ErrForbidden:         http.StatusForbidden,
	ErrTokenExpired:      http.StatusUnauthorized,
	ErrTokenRevoked:      http.StatusUnauthorized,
	ErrInvalidTransition: http.StatusConflict,
	ErrAlreadyReviewed:   http.StatusConflict,
	ErrOutOfStock:        http.StatusConflict,
	ErrItemNotAvailable:  http.StatusFailedDependency,
	ErrInsufficientCoins: http.StatusPaymentRequired,
	ErrRateLimited:       http.StatusTooManyRequests,
}
