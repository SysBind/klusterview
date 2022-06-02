// scan/scanner.go

package scan

import "fmt"

type Scanner interface {
	Start()
}

type scanner struct{}

func (scanner) Start() {
	fmt.Println("Initiating Cluster Scan")
}

func NewScanner() (scan Scanner, err error) {
	scan = scanner{}
	return
}
