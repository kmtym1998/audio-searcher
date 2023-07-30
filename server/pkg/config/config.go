package config

import (
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Env  Platform `split_words:"true" default:"local"`
	Port string   `split_words:"true" default:"8080"`
	Elasticsearch
}

type Elasticsearch struct {
	User string `envconfig:"ELASTICSEARCH_USER" default:"elastic"`
	Pass string `envconfig:"ELASTICSEARCH_PASSWORD" default:""`
}

type Platform string

const (
	Local Platform = "local"
	Prod  Platform = "production"
)

func New() (c Config, err error) {
	err = envconfig.Process("", &c)

	return
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
