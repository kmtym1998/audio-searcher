package resolver

import "audio-searcher/pkg/elasticsearch"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	esClient elasticsearch.Client
}

type DI struct {
	EsClient elasticsearch.Client
}

func New(
	di DI,
) *Resolver {
	return &Resolver{
		esClient: di.EsClient,
	}
}
