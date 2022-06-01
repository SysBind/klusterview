// ingest/redis.go

package ingest

import (
	"context"
	"fmt"
	"io"

	"github.com/rueian/rueidis"
)

type Ingester interface {
	io.Closer
	Ingest() error
}

type redis struct {
	host   string
	sample int
	client rueidis.Client
}

func (r redis) Ingest() (err error) {
	return
}

func (r redis) Close() (err error) {
	r.client.Close()
	return
}

func NewSample(host string) (ing Ingester, err error) {
	client, err := rueidis.NewClient(rueidis.ClientOption{
		InitAddress: []string{host},
	})
	if err != nil {
		return
	}

	ctx := context.Background()

	result, err := client.Do(ctx, client.B().Arbitrary("KEYS").Args("sample:*").Build()).ToMessage()
	if err != nil {
		return
	}

	samples, err := result.ToArray()
	if err != nil {
		return
	}

	// TODO: iterate through all samples and get actual highest id
	newSampleID := len(samples) + 1
	newSample := fmt.Sprintf("sample:%d", newSampleID)

	client.Do(ctx, client.B().Set().Key(newSample).Value("0").Build())

	ing = redis{host: host, sample: 0, client: client}
	return
}
