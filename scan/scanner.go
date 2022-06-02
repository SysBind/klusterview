// scan/scanner.go

package scan

import (
	"context"
	"path/filepath"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	_ "k8s.io/client-go/plugin/pkg/client/auth"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

type Scanner interface {
	Start() (<-chan corev1.Node, <-chan corev1.Pod)
}

type scanner struct {
	client *kubernetes.Clientset
	nodes  chan corev1.Node
	pods   chan corev1.Pod
}

func (scan scanner) Start() (<-chan corev1.Node, <-chan corev1.Pod) {
	// create channels for output
	scan.nodes = make(chan corev1.Node)
	scan.pods = make(chan corev1.Pod)

	go scan.getNodes()
	go scan.getPods()

	return scan.nodes, scan.pods
}

func (scan scanner) getNodes() {
	list, _ := scan.client.CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	for _, node := range list.Items {
		scan.nodes <- node
	}
	close(scan.nodes)
}

func (scan scanner) getPods() {
	close(scan.pods)
}

func NewScanner() (Scanner, error) {
	var kubeconfig string = filepath.Join(homedir.HomeDir(), ".kube", "config")

	// use the current context in kubeconfig
	config, _ := clientcmd.BuildConfigFromFlags("", kubeconfig)

	// create the clientset
	client, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, err
	}

	return scanner{client: client}, nil
}
