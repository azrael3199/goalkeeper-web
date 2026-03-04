package auth

import (
	"context"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"github.com/lestrrat-go/jwx/v2/jwk"
)

type Verifier struct {
	issuer   string
	audience string
	keySet   jwk.Set
}

func NewVerifier(ctx context.Context, jwksURL string, issuer string, audience string) (*Verifier, error) {
	set, err := jwk.Fetch(ctx, jwksURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch JWKS: %w", err)
	}
	return &Verifier{
		issuer:   issuer,
		audience: audience,
		keySet:   set,
	}, nil
}

type Claims struct {
	jwt.RegisteredClaims
}

func (v *Verifier) Verify(tokenStr string) (*Claims, error) {
	var parserOpts []jwt.ParserOption
	if v.issuer != "" {
		parserOpts = append(parserOpts, jwt.WithIssuer(v.issuer))
	}
	if v.audience != "" {
		parserOpts = append(parserOpts, jwt.WithAudience(v.audience))
	}

	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, fmt.Errorf("missing kid in token header")
		}
		key, ok := v.keySet.LookupKeyID(kid)
		if !ok {
			return nil, fmt.Errorf("key %v not found", kid)
		}
		var rawKey interface{}
		if err := key.Raw(&rawKey); err != nil {
			return nil, err
		}
		return rawKey, nil
	}, parserOpts...)

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, fmt.Errorf("invalid token")
}

func (v *Verifier) IsRevoked(ctx context.Context, jti string) bool {
	// Abstracted to pass redis client in real usage, return false for now
	return false
}
