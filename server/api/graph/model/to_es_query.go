package model

import (
	"audio-searcher/pkg/elasticsearch"
)

func (q *AudioFileNodeQueryInput) ToQueryList() *[]elasticsearch.Query {
	var results []elasticsearch.Query

	if q.FilePath != nil {
		results = append(results, elasticsearch.Query{
			Match: &elasticsearch.Match{
				"filePath": q.FilePath,
			},
		})
	}

	if q.FileName != nil {
		results = append(results, elasticsearch.Query{
			Match: &elasticsearch.Match{
				"fileName": q.FileName,
			},
		})
	}

	for _, a := range q.Artists {
		results = append(results, elasticsearch.Query{
			Term: &elasticsearch.Term{
				"artists.keyword": elasticsearch.Value{
					Value: a,
				},
			},
		})
	}

	if q.Album != nil {
		results = append(results, elasticsearch.Query{
			Match: &elasticsearch.Match{
				"album": q.Album,
			},
		})
	}

	if q.AlbumArtist != nil {
		results = append(results, elasticsearch.Query{
			Match: &elasticsearch.Match{
				"albumArtist": q.AlbumArtist,
			},
		})
	}

	if q.Title != nil {
		results = append(results, elasticsearch.Query{
			Match: &elasticsearch.Match{
				"title": q.Title,
			},
		})
	}

	for _, t := range q.Tags {
		results = append(results, elasticsearch.Query{
			Term: &elasticsearch.Term{
				"tags.keyword": elasticsearch.Value{
					Value: t,
				},
			},
		})
	}

	for _, t := range q.Tracks {
		results = append(results, elasticsearch.Query{
			Term: &elasticsearch.Term{
				"tracks.keyword": elasticsearch.Value{
					Value: t,
				},
			},
		})
	}

	return &results
}
