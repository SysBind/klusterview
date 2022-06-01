// ingest/redis.go

package ingest

import (
	"context"
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/rueian/rueidis"
)

// Ingester handles storing key/value pairs in a data store
type Ingester interface {
	io.Closer
	Ingest(key string, val string) error
	IngestSet(key string, val []string) error
	IngestTS(key string, timestamp int64, val float64) error
}

// redis struct to implement Ingester using redis
type redis struct {
	host   string
	sample int
	client rueidis.Client
}

// Ingest Simple Value (SET)
func (r redis) Ingest(key string, val string) (err error) {
	ctx := context.Background()
	r.client.Do(ctx, r.client.B().Set().Key(key).Value(val).Build()).Error()
	return
}

// Ingest Set (SADD)
func (r redis) IngestSet(key string, val []string) (err error) {
	ctx := context.Background()
	r.client.Do(ctx, r.client.B().Sadd().Key(key).Member(val...).Build()).Error()
	return
}

// Ingest Time Series (TS.ADD)
func (r redis) IngestTS(key string, timestamp int64, val float64) (err error) {
	ctx := context.Background()
	r.client.Do(ctx, r.client.B().TsAdd().Key(key).Timestamp(timestamp).Value(val).Build()).Error()
	return
}

// Implement io.Closer - close the redis client
func (r redis) Close() (err error) {
	r.client.Close()
	return
}

// Create new Ingester for starting a sample writing down start time
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
	key := fmt.Sprintf("sample:%d", newSampleID)
	val := strconv.FormatInt(time.Now().Unix(), 10)

	client.Do(ctx, client.B().Set().Key(key).Value(val).Build()).Error()

	ing = redis{host: host, sample: newSampleID, client: client}
	return
}
