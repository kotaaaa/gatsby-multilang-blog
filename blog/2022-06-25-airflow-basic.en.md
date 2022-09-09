---
title: Airflow and Cloud Composer Basic
date: '2022-06-25 18:46:37'
description: Airflow, Cloud Composer, GCP
category: Python
background: '#4169e1'
---

# What is Airflow

OSS workflow management tool built in Python
Able to programmatically define workflows using directed acyclic graphs called DAGs.
Active development and community is quite active.
Often used to create data pipelines for building data infrastructure.
Sometimes used for training and inference of machine learning models.

-   Web server
    -   Provide UI with Flask server by Gunicorn.
-   Scheduler
    -   Manage workflow scheduling
-   Metastore
    -   Storing Metadata
    -   Metadata on environment settings, permissions, and past/current DAG execution
-   Executor
    -   Class that defines how tasks are executed
-   Worker
    -   Process/sub-process to execute the task

# Airflow's Architecture

[Reference](https://airflow.apache.org/docs/apache-airflow/2.2.3/concepts/overview.html)

![airflow_architecture](/assets/img/airflow-basic/airflow_architecture.png)

# Airflow Competitive Tools

|                          | Airflow                                          | Argo pipeline                                   | Kubeflow Pipeline                                                            | Jenkin                               |
| ------------------------ | ------------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------ |
| **Purpose**              | Data pipeline construction Workflow engine       | Workflow engine for parallel jobs on Kubernetes | Machine Learning Pipeline Construction                                       | CI/CD pipeline development           |
| **UI**                   | Intuitive. Easy to understand task dependencies. | Simple                                          | easy to see                                                                  | Easy to see Hard to see dependencies |
| **Programming Language** | Python                                           | yaml                                            | Python                                                                       | groovy                               |
| **Full-managed Service** | ・Cloud Composer ・MWAA                          | nothing special                                 | ・GCP AI platform <br> ・ Amazon SageMaker Components for Kubeflow Pipelines | JenkinsX                             |
| **Affinity with k8s**    | Average (KuberbetesOperator)                     | Good                                            | Good                                                                         | Average                              |

# My Impression to Airflow

-   Python is easy to use and popular programming language.

    -   Easy to attract developers

-   Lots of information on the Internet
-   Frequent version upgrades
    -   If there is bugs, the problem can be solved quickly by OSS community.
    -   A little difficult to develop by multiple people
-   Workflow is deployed by placing Python scripts with DAG definitions in a specific directory.
    -   Conflicts tend to occur when multiple people tinker with the DEV environment.

# As for Cloud Composer

-   Fully Managed Service by GCP for Airflow
    -   GCP provides all infrastructure resources for the OSS Airflow.
    -   For AWS, there is [Amazon managed workflows for apache airflow (MWAA)](https://aws.amazon.com/jp/managed-workflows-for-apache-airflow/).
-   **Advantages**
    -   Prevents vendor lock-in.
        -   As long as you have the environment, all you have to do is move the DAG file.
    -   No need to spend time and effort on infrastructure maintenance.
-   **Disadvantages**
    -   Relatively expensive.
-   See also the following opinions [Reference](https://note.com/jdsc/n/n3657da5d8206)
    > I think it is effective when the DAG developers are very small, such as one or two people, the development is fixed to some extent, and the person in charge of operation is a non-engineer, etc.

# I am reading this book and it says...

[Thank You for Being Late | Thomas L. Friedman](https://www.youtube.com/watch?v=nuF2JKeM2CY)

"Astro Teller's Graph"
Astro Teller, CEO of Google R&D Organization X

> "The time window is getting shorter and shorter as technology builds on the past, and it only takes 5-7 years from the time something is announced until it becomes ubiquitous enough to be seen everywhere and change the world in unsettling ways." Our ability to understand just one of these areas (surgical robotics, genome editing, cloning, AI, etc.) in depth is all we can do. The sum of human knowledge far exceeds the learning capacity of any one individual. Moreover, even experts in these fields cannot predict what will happen in the next decade or the next century."

-   GCP and AWS managed services are packed with multiple technologies
    -   → I think they have a point in their policy to reduce learning costs by adopting easy (manageable) services.

# Advantages of Airflow 2.x over 1.x

-   Sophisticated UI -> Simply, I like it.
-   Auto-refresh in the upper right corner is unobtrusive.
    -   No more reloading to check the progress of the DAG one by one.
-   The past execution flow can now be viewed as a Graph view.
    -   In 1.x, only the Graph view of the most recent execution could be viewed, so it is now easier to operate.
-   No longer having to define custom_plugin.py
    -   In 1.x, it was necessary to import an operator created independently from CustomPlugin.- When developing with multiple developers, it was cumbersome because the same file was handled. Conflicts often occur.
-   Faster execution of tasks due to improvements in the Scheduler
    -   Throughput increased due to improved scheduler.
-   To make it simpler to write DAGs & to allow variables to be passed between Tasks by method return values.
    -   This will be useful in the future if there are any necessary cases.
    -   Sample code is below.

###### Airflow 1.x

```python
import json
import pendulum, datetime
from airflow.decorators import dag, task
from airflow import models
from airflow.utils.dates import days_ago
from airflow.operators.python_operator import PythonOperator


default_args = {}
with models.DAG(
    "test_v1", default_args=default_args, schedule_interval=None, start_date=days_ago(2)
) as dag:

    def test1(**kwargs):
        ti = kwargs["ti"]
        message = "HelloWorld"
        print(message)
        ti.xcom_push("message", message)

    def test2(**kwargs):
        ti = kwargs["ti"]
        message = ti.xcom_pull(task_ids="test1", key="message")
        ti.xcom_push("length", len(message))

    def test3(**kwargs):
        ti = kwargs["ti"]
        l = ti.xcom_pull(task_ids="test2", key="length")
        print(l)

    task1 = PythonOperator(
        task_id="test1",
        python_callable=test1,
    )

    task2 = PythonOperator(
        task_id="test2",
        python_callable=test2,
    )

    task3 = PythonOperator(
        task_id="test3",
        python_callable=test3,
    )

    task1 >> task2 >> task3
```

###### Airflow 2.x

```python
import json
import pendulum, datetime
from airflow.decorators import dag, task
from airflow import models
from airflow.utils.dates import days_ago


default_args = {}
with models.DAG(
    "test_v2",
    default_args=default_args,
    schedule_interval=None,
    start_date=days_ago(2),
) as dag:

    @task
    def test1(message: str) -> str:
        print(message)
        return message

    @task
    def test2(message: str) -> int:
        return len(message)

    @task
    def test3(l: int) -> int:
        return l * 2

    test3(test2(test1("HelloWorld")))
```

Source code will be much more visible and clear, right? :)

# Feature of Composer version of 2.0.9

-   GKE Autopilot is GA. no longer needs to manage nodes > Happy and room for improvement?
    -   GKE Autopilot: A mechanism that allows users to set the minimum and maximum number of Airflow worker nodes and automatically adjusts the number of worker nodes according to the load.
-   According to Scaling Environments
-   Cloud Composer auto-scaling uses three different auto-scalers provided by GKE
    -   Horizontal Pod Autoscaler (HPA): automatically increases or decreases the number of Pods
    -   Cluster autoscaler (CA): automatically change the number of nodes in a specific node pool
    -   Node Auto Provisioning (NAP): Scaling a node pool
    -   Node pool: one large chunk of multiple nodes
-   The number of workers is adjusted based on a target metric of scaling factors. This metric is calculated based on the following criteria
-   Current number of workers
-   Number of tasks in the queue that are not assigned to workers
-   Number of idle workers

> Number of nodes not adjusted for worker CPU and memory usage... (next page)
> And since it takes a few minutes to start the pod & assign tasks, there could be a pattern where tasks are finished when the pod starts up.
> Looking forward to future updates.

-   According to [Scaling the Environment](https://cloud.google.com/composer/docs/composer-2/environment-scaling)
    -   Horizontal Pod autoscaling (HPA): automatic increase/decrease in number of Pods > Number of nodes is not adjusted according to worker CPU and memory usage
    -   Autoscaling/v1 does not seem to be able to automatically adjust Worker Nodes by memory utilization Link
        [Reference](https://docs.openshift.com/container-platform/4.9/nodes/pods/nodes-pods-autoscaling.html)

![metrics](/assets/img/airflow-basic/metrics.png)

# Cloud Composer architecture

-   Easy to understand official architecture diagram; [Getting Started with Cloud Composer](https://cloud.google.com/composer/docs/composer-2/environment-architecture)

# Kubernetes objects used in Cloud Composer

-   [Job](https://kubernetes.io/docs/concepts/workloads/controllers/job/): A task object that creates a Pod, executes it once, and then terminates. It is guaranteed to execute successfully.
    -   Airflow InitDB, an operation on environment changes by the Composer agent.
-   [Statefulset](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/): An object that handles stateful data that remains persistent.
    -   Redis Queue
-   [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/): object used to launch pods on all or some of the nodes one at a time
    -   FluentD, Cloud Storage FUSE
-   [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/): Manage the state of a Pod by managing replica sets.
    -   Airflow Scheduler, Airflow Worker, Airflow Web Server, Airflow Monitoring, Cloud SQL
    -   Proxy, Customer Metrics Stackdriver Adapter, Airflow Worker Set Controller

![composer](/assets/img/airflow-basic/composer.png)

# Each Cloud Composer's component introduction

-   Airflow worker set controller: Deployment of Kubernetes. automatically scales the environment based on Customer Metrics Stackdriver Adapter metrics
-   Customer Metrics Stackdriver Adapter: Kubernetes Deployment. Reports environment metrics for auto-scaling.
-   Airflow Web Server: Airflow web server
-   Airflow Schedulers: parses DAGs and breaks them down into tasks and stores data in Redis queue
-   Airflow init DB: Creates Cloud SQL instance and initial database schema.
-   Redis queue: a queue containing task instances
-   Airflow workers: Nodes that perform the actual tasks
-   GCS FUSE: Kubernetes DaemonSet: Airflow worker, scheduler, and web server that [mounts the environment bucket as a file system](https://cloud.google.com/storage/docs/gcs-fuse) so that these components can access the bucket's data.
-   Composer Agent: a Kubernetes Job. role that performs environment operations such as creating, updating, upgrading, and deleting environments.
-   FluentD: DaemonSet for Kubernetes. collects logs from all environment components and uploads the collected logs to Cloud Logging.
-   Airflow Monitoring: Kubernetes Deployment. reports environment metrics to [Cloud Monitoring](https://cloud.google.com/composer/docs/composer-2/environment-architecture#integration-logging-monitoring) and triggers the airflow_monitoring DAG. airflow_monitoring DAG reports environment health data. The airflow_monitoring DAG reports environmental health data.
-   Environment's bucket: Bucket for the environment, where DAG files, plugin files, and files generated by the DAG are stored.
-   Interact w. Composer service (Cloud Pub/Sub): The environment communicates with the GKE service agent via a Pub/Sub [subscription](https://cloud.google.com/pubsub/docs/subscriber). This depends on the default behavior of Pub/Sub managing messages.
-   Images for env. Components (Artifact Registry)
-   Airflow and Composer logs (Cloud logging)
-   Airflow and Composer metrics (Cloud Monitoring)
-   Airflow database (Cloud SQL):
-   CloudSQL Storage: Backup of Airflow database
