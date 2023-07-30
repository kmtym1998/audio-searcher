package elasticsearch

import (
	"bytes"
	"context"
	"encoding/json"
	"io"

	"github.com/cockroachdb/errors"
	"github.com/elastic/go-elasticsearch/v8"
)

type Client interface {
	Search(ctx context.Context, index string, q QueryRoot) (resp []byte, err error)
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
		return nil, errors.Wrap(err, "failed to create elasticsearch client")
	}

	return &client{
		esClient: esClient,
	}, nil
}

func (c *client) Search(ctx context.Context, index string, q QueryRoot) ([]byte, error) {
	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(q); err != nil {
		return nil, errors.Wrap(err, "failed to encode query")
	}

	res, err := c.esClient.Search(
		c.esClient.Search.WithContext(ctx),
		c.esClient.Search.WithIndex(index),
		c.esClient.Search.WithBody(&buf),
		c.esClient.Search.WithTrackTotalHits(true),
		c.esClient.Search.WithPretty(),
	)
	if err != nil {
		return nil, errors.Wrap(err, "failed to search")
	}
	defer res.Body.Close()

	b, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.Wrap(err, "failed to read response body")
	}

	if res.IsError() {
		return nil, errors.Wrapf(err, "response contains error: %s", string(b))
	}

	return b, nil
}
