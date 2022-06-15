// klusterview.go

package main

import (
	"fmt"

	"github.com/sysbind/klusterview/ingest"
	"github.com/sysbind/klusterview/scan"
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
)

func main() {
	// Initiate Scanner
	scanner, err := scan.NewScanner()
	if err != nil {
		panic(err.Error())
	}
	// Initiate Ingester
	ing, err := ingest.NewSample("localhost:6379")
	if err != nil {
		panic(err.Error())
	}
	defer ing.Close()

	nodes, pods, nodemetrics := scanner.Start()

	// Utilization
	go func(metrics <-chan v1beta1.NodeMetrics, ing ingest.Ingester) {
		for nodemetric := range metrics {
			timestamp := nodemetric.Timestamp.UnixNano()
			cpu := float64(nodemetric.Usage.Cpu().MilliValue())
			mem := float64(nodemetric.Usage.Memory().MilliValue() / 1000 / 1000)
			ing.IngestTS(fmt.Sprintf("node:%s:util_cpu", nodemetric.Name), timestamp, cpu, false)
			ing.IngestTS(fmt.Sprintf("node:%s:util_mem", nodemetric.Name), timestamp, mem, false)
		}
	}(nodemetrics, ing)

	// Capacity
	for node := range nodes {
		cpu := node.Status.Allocatable.Cpu().String()
		mem := node.Status.Allocatable.Memory().String()
		ing.Ingest(fmt.Sprintf("node:%s:alloc_cpu", node.Name), cpu, false)
		ing.Ingest(fmt.Sprintf("node:%s:alloc_mem", node.Name), mem, false)
		// add to sample's nodes list
		ing.IngestSet("nodes", []string{node.Name}, true)
	}

	for pod := range pods {
		fmt.Println(pod)
	}
	fmt.Println("done")
}
