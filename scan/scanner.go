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
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
	metricsv "k8s.io/metrics/pkg/client/clientset/versioned"
)

type Scanner interface {
	Start() (<-chan corev1.Node, <-chan corev1.Pod, <-chan v1beta1.NodeMetrics)
}

type scanner struct {
	client        *kubernetes.Clientset
	metricsClient *metricsv.Clientset
	nodes         chan corev1.Node
	pods          chan corev1.Pod
	nodesMetrics  chan v1beta1.NodeMetrics
}

func (scan scanner) Start() (<-chan corev1.Node, <-chan corev1.Pod, <-chan v1beta1.NodeMetrics) {
	// create channels for output
	scan.nodes = make(chan corev1.Node)
	scan.pods = make(chan corev1.Pod)
	scan.nodesMetrics = make(chan v1beta1.NodeMetrics)

	go scan.getNodes()
	go scan.getPods()
	go scan.getNodesMetrics()

	return scan.nodes, scan.pods, scan.nodesMetrics
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

func (scan scanner) getNodesMetrics() {
	list, _ := scan.metricsClient.MetricsV1beta1().NodeMetricses().List(context.TODO(),
		metav1.ListOptions{})
	for _, node := range list.Items {
		scan.nodesMetrics <- node
	}
	close(scan.nodesMetrics)
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

	metricsClient, err := metricsv.NewForConfig(config)
	if err != nil {
		return nil, err
	}

	return scanner{client: client, metricsClient: metricsClient}, nil
}
