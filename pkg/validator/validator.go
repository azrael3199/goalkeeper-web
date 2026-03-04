package validator

import (
	"time"

	"github.com/go-playground/validator/v10"
)

var Validate *validator.Validate

func Init() {
	Validate = validator.New()

	// Register custom rules
	_ = Validate.RegisterValidation("future", func(fl validator.FieldLevel) bool {
		dateStr := fl.Field().String()
		// Try parsing as simple date
		t, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			// Try timestamp
			t, err = time.Parse(time.RFC3339, dateStr)
			if err != nil {
				return false
			}
		}
		// ensure it's at least today
		today := time.Now().Truncate(24 * time.Hour)
		return t.After(today) || t.Equal(today)
	})
}
