# Klusterview

Klusterview scans Kubernetes cluster to visualize resources & utilization


## Compiling
```go build .```

## Running

- first have Redis with Time Series module enabled, e.g:
  ```docker run -d --name redis -p 6379:6379 redis/redis-stack```

- run a sample:
  ```./klusterview```
  This will populate Redis with the sample data.

- run [Webdis](https://webd.is) to expose Redis on HTTP port (7379).

- open index.html


## Data Model

Hybrid data model - Basic Redis data types + Time Series keys

_Keys:_
- samples - total samples count in db (int)
- sample:i - timestamp of beginning of cluster scan (int)
- sample:i:nodes -  node names existing at time of scan (set)
- sample:i:pods - pod names existing at time of scan (set)
- node:node_name:alloc_cpu - allocatable cpu for specific node (int)
- node:node_name:alloc_mem - allocatable memory for specific node (int)
- node:node_name:util_cpu  - utilization of cpu (Time Series)
- node:node_name:util_mem  - utilization of memory (Time Series)
- pod:pod_name             - pod meta data (dictionary)
- pod:pod_name:containers  - containers (set)
- pod:pod_name:container_name:req_cpu     - requested cpu (int)
- pod:pod_name:container_name:req_mem     - requested memory (int)
- pod:pod_name:container_name:util_cpu   - utilization of cpu (Time Series)
- pod:pod_name:container_name:util_mem    - utilization of memory (Time Series)


## Pipeline Stages

- Scan - Scan cluster Nodes & Pods to extract resource requests & utilization
- Ingest - Write data to Redis


