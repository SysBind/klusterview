/*
Copyright 2016 The Kubernetes Authors.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Note: the example only works with the code within the same release/branch.
package main

import (
	"fmt"

	"github.com/sysbind/klusterview/ingest"
	"github.com/sysbind/klusterview/scan"
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

	nodes, pods := scanner.Start()

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
