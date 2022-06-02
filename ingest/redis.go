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
	Ingest(key string, val string, sample_prefix bool) error
	IngestSet(key string, val []string, sample_prefix bool) error
	IngestTS(key string, timestamp int64, val float64, sample_prefix bool) error
}

// redis struct to implement Ingester using redis
type redis struct {
	host   string
	sample int64
	client rueidis.Client
}

// Ingest Simple Value (SET)
func (r redis) Ingest(key string, val string, sample_prefix bool) (err error) {
	ctx := context.Background()
	if sample_prefix {
		key = fmt.Sprintf("sample:%d:%s", r.sample, key)
	}
	r.client.Do(ctx, r.client.B().Set().Key(key).Value(val).Build()).Error()
	return
}

// Ingest Set (SADD)
func (r redis) IngestSet(key string, val []string, sample_prefix bool) (err error) {
	ctx := context.Background()
	if sample_prefix {
		key = fmt.Sprintf("sample:%d:%s", r.sample, key)
	}
	r.client.Do(ctx, r.client.B().Sadd().Key(key).Member(val...).Build()).Error()
	return
}

// Ingest Time Series (TS.ADD)
func (r redis) IngestTS(key string, timestamp int64, val float64, sample_prefix bool) (err error) {
	ctx := context.Background()
	if sample_prefix {
		key = fmt.Sprintf("sample:%d:%s", r.sample, key)
	}
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

	result, err := client.Do(ctx, client.B().Incr().Key("samples").Build()).ToInt64()
	if err != nil {
		return
	}
	key := fmt.Sprintf("sample:%d", result)
	val := strconv.FormatInt(time.Now().Unix(), 10)

	client.Do(ctx, client.B().Set().Key(key).Value(val).Build()).Error()

	ing = redis{host: host, sample: result, client: client}
	return
}
