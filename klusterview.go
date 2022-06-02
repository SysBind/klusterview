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
	"time"

	"github.com/sysbind/klusterview/ingest"
	"github.com/sysbind/klusterview/scan"
)

func main() {
	// Initiate Scanner
	scanner, err := scan.NewScanner()
	if err != nil {
		panic(err.Error())
	}
	scanner.Start()

	// Initiate Sample
	ing, err := ingest.NewSample("localhost:6379")
	if err != nil {
		panic(err.Error())
	}
	defer ing.Close()

	ing.Ingest("kkey", "vval", true)
	ing.IngestSet("setkey", []string{"XXX", "NODE2", "NODY"}, false)
	ing.IngestTS("tskey", time.Now().Unix(), 3.14159265, false)
}
