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
	/*go*/
	func(metrics <-chan v1beta1.NodeMetrics) {
		for nodemetric := range metrics {
			//cpu := nodemetric.Usage.Cpu().String()
			fmt.Printf("cpu %d\n", nodemetric.Usage.Cpu().MilliValue())
		}
	}(nodemetrics)

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
