package elasticsearch

import (
	"github.com/kmtym1998/es-indexer/elasticsearch"
)

type ResponseRoot[T elasticsearch.DocumentNode] struct {
	Took     int     `json:"took"`
	TimedOut bool    `json:"timed_out"`
	Shards   Shards  `json:"_shards"`
	Hits     Hits[T] `json:"hits"`
}

type Shards struct {
	Total      int `json:"total"`
	Successful int `json:"successful"`
	Skipped    int `json:"skipped"`
	Failed     int `json:"failed"`
}

type Total struct {
	Value    int    `json:"value"`
	Relation string `json:"relation"`
}

type Hits[T elasticsearch.DocumentNode] struct {
	Total    Total     `json:"total"`
	MaxScore float64   `json:"max_score"`
	Items    []Item[T] `json:"hits"`
}

type Item[T elasticsearch.DocumentNode] struct {
	Index  string  `json:"_index"`
	Type   string  `json:"_type"`
	ID     string  `json:"_id"`
	Score  float64 `json:"_score"`
	Source T       `json:"_source"`
}
