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
	"context"
	"flag"
	"fmt"
	"path/filepath"

	"github.com/go-redis/redis/v8"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"

	_ "k8s.io/client-go/plugin/pkg/client/auth"
)

func main() {
	var kubeconfig *string
	if home := homedir.HomeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}
	flag.Parse()

	// use the current context in kubeconfig
	fmt.Printf("kube config is %s\n", *kubeconfig)
	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err.Error())
	}

	// create the clientset
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}

	nodes, err := clientset.CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	fmt.Printf("There are %d nodes in the cluster\n", len(nodes.Items))
	for _, node := range nodes.Items {
		fmt.Printf("%s\n----------------------------------------------------------\n", node.Name)
		fmt.Printf("\tALLOCATABLE CPU: %v\n  \tMEM: %v \n\n", node.Status.Allocatable.Cpu(), node.Status.Allocatable.Memory())
		fmt.Printf("\tCAPACITY CPU: %v\n  \tMEM: %v \n\n", node.Status.Capacity.Cpu(), node.Status.Capacity.Memory())
	}

	metricsClientset, err := metricsv.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}

	namespace := "acid"
	podMetricsList, err := metricsClientset.MetricsV1beta1().PodMetricses(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		panic(err.Error())
	}

	for _, v := range podMetricsList.Items {
		fmt.Printf("%s %s\n", v.GetName(), v.GetNamespace())
		fmt.Printf("%vm / %vm \n", v.Containers[0].Usage.Cpu().MilliValue(), v.Containers[0].Usage.Cpu().MilliValue())
		fmt.Printf("%vMi\n", v.Containers[0].Usage.Memory().Value()/(1024*1024))
	}

	ctx := context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	err = rdb.Set(ctx, "key", "value", 0).Err()
	if err != nil {
		panic(err)
	}

	val, err := rdb.Get(ctx, "key").Result()
	if err != nil {
		panic(err)
	}
	fmt.Println("key", val)

	val2, err := rdb.Get(ctx, "key2").Result()
	if err == redis.Nil {
		fmt.Println("key2 does not exist")
	} else if err != nil {
		panic(err)
	} else {
		fmt.Println("key2", val2)
	}
}
