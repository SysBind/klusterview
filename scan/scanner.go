// scan/scanner.go

package scan

import (
	"context"
	"fmt"
	"path/filepath"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	_ "k8s.io/client-go/plugin/pkg/client/auth"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

type Scanner interface {
	Start() error
}

type scanner struct {
	client *kubernetes.Clientset
}

func (scan scanner) Start() (err error) {
	var kubeconfig string = filepath.Join(homedir.HomeDir(), ".kube", "config")

	// use the current context in kubeconfig
	config, err := clientcmd.BuildConfigFromFlags("", kubeconfig)

	// create the clientset
	scan.client, err = kubernetes.NewForConfig(config)

	if err != nil {
		return
	}
	go scan.getNodes()
	return
}

func (scan scanner) getNodes() {
	nodes, _ := scan.client.CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	fmt.Printf("There are %d nodes in the cluster\n", len(nodes.Items))
}

func NewScanner() (scan Scanner, err error) {
	scan = scanner{}
	return
}
