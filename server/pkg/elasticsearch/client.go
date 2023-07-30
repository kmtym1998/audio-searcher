package elasticsearch

import (
	"bytes"
	"context"
	"encoding/json"

	"github.com/elastic/go-elasticsearch/v8"
)

type Client interface {
	Search(ctx context.Context, index string, q QueryRoot) (map[string]interface{}, error)
}

type client struct {
	esClient *elasticsearch.Client
}

func NewClient(user, pass string) (*client, error) {
	esClient, err := elasticsearch.NewClient(elasticsearch.Config{
		Username: user,
		Password: pass,
	})
	if err != nil {
		return nil, err
	}

	return &client{
		esClient: esClient,
	}, nil
}

func (c *client) Search(ctx context.Context, index string, q QueryRoot) (map[string]interface{}, error) {
	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(q); err != nil {
		return nil, err
	}

	res, err := c.esClient.Search(
		c.esClient.Search.WithContext(ctx),
		c.esClient.Search.WithIndex(index),
		c.esClient.Search.WithBody(&buf),
		c.esClient.Search.WithTrackTotalHits(true),
		c.esClient.Search.WithPretty(),
	)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.IsError() {
		var e map[string]interface{}
		if err := json.NewDecoder(res.Body).Decode(&e); err != nil {
			return nil, err
		}

		return nil, err
	}

	var result map[string]interface{}
	if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}
