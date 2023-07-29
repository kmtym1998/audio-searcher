package config

import (
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Env  Platform `split_words:"true" default:"local"`
	Port string   `split_words:"true" default:"8080"`
}

type Platform string

const (
	Local Platform = "local"
	Prod  Platform = "production"
)

func New() (*Config, error) {
	c := &Config{}
	if err := envconfig.Process("", c); err != nil {
		return nil, err
	}

	return c, nil
}

func (r Config) Is(p Platform) bool {
	return r.Env == p
}

func (r Config) IsNot(p Platform) bool {
	return r.Env != p
}

func (p Platform) String() string {
	return string(p)
}
