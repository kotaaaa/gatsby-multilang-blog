---
title: Template of Extracting API response data to BigQuery with Terraform
date: '2022-08-30 00:00:00'
description: Python, GCP, BigQuery, Terraform, Cloud PubSub, Cloud Functions
category: Cloud Computing
background: '#ffa500'
---

# Overview

This article shows the template source code of the data pipeline of extracting data from external API to BigQuery table regularly.

In many cases for analytical purpose or application integration with 3rd party data source, there are needs that we would like to transfer data from API to internal DB or in BigQuery.

So I created the repository with GCP(Google Cloud Platform) and Terraform based to achieve this simple workflow.

By adopting terraform as Iac(Infrasturucture as code), we can easily recreate the environment and verifiable.

In this ariticle, I used [tmbd movie API data](https://www.themoviedb.org/documentation/api) so if you want to re-use this repogitory entirely, please create API key to access tmdb api resource.

Even if the API that we use change, all we have to do is to change the API endpoint and BigQuery table schema to match the API response data.

This case is suitable for smaller projects, where there is no need to manage complex workflows. If the application is Mid-Size and above, it is better to use [Airflow](https://airflow.apache.org/) or [Argo CI](https://argoproj.github.io/) so that we can easily manage whole workflow with addtional convenient functions.

# Entire Source Code

-   [api-to-bigquery-template](https://github.com/kotaaaa/api-to-bigquery-template)

# Technologys

-   [Cloud Function (Python3.7)](https://cloud.google.com/functions): to write Python code to write API client and BigQuery client.
-   [BigQuery](https://cloud.google.com/bigquery): save API raw data to BigQuery Table
-   [Cloud Pub/Sub](https://cloud.google.com/pubsub): Queues used as data relay points
-   [Cloud Scheduler](https://cloud.google.com/scheduler): set to run process regularly.
-   [Google Cloud Storage](https://cloud.google.com/storage): bucket to save tf state file.

# Data source

-   [tmdb api document](https://www.themoviedb.org/documentation/api)

In this sample, I am using [trending endpoint](https://developers.themoviedb.org/3/trending/get-trending), please check this response json schema, as I am pre-define BigQuery table schema in below's tf config files.
and add TMDB_KEY environment variable in `.env` file.

# Architecture

![diagram.svg](https://raw.githubusercontent.com/kotaaaa/api-to-bigquery-template/main/diagram.drawio.svg)

The process itself is written in Cloud Function. The API described in Cloud Function is invoked, and the response data is inserted into BigQuery via Publish to Pub/Sub topics.

In addition, terraform state file have to be saved in somewhere.
In this sample, I created gcs bucket called "collecting-tf-state". then I save tf state file in this gcs bucket.

# Before we do

-   GCP project is required. If you does not have, please create it.

# Terraform setting files

Replace \$GCP_PROJECT_NAME with the name of your GCP project.

#### bigquery.tf

```hcl
# BigQuery Database
resource "google_bigquery_dataset" "collecting_db" {
  dataset_id = "collecting_db"
  access {
    role          = "OWNER"
    user_by_email = data.google_service_account.terraform_service_account.email
  }
}

# BigQuery Table
resource "google_bigquery_table" "tmdb_trending" {
  dataset_id = google_bigquery_dataset.collecting_db.dataset_id
  table_id   = "tmdb_trending"
  time_partitioning {
    type = "DAY"
  }
  deletion_protection = false
  schema              = <<EOF
[
  {
    "name": "adult",
    "type": "BOOLEAN",
    "mode": "NULLABLE"
  },
  {
    "name": "backdrop_path",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "id",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "title",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "original_language",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "original_name",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "name",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "original_title",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "overview",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "poster_path",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "media_type",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "genre_ids",
    "type": "INTEGER",
    "mode": "REPEATED"
  },
  {
    "name": "popularity",
    "type": "FLOAT",
    "mode": "NULLABLE"
  },
  {
    "name": "release_date",
    "type": "DATE",
    "mode": "NULLABLE"
  },
  {
    "name": "first_air_date",
    "type": "DATE",
    "mode": "NULLABLE"
  },
  {
    "name": "video",
    "type": "BOOLEAN",
    "mode": "NULLABLE"
  },
  {
    "name": "vote_average",
    "type": "FLOAT",
    "mode": "NULLABLE"
  },
  {
    "name": "vote_count",
    "type": "INTEGER",
    "mode": "NULLABLE"
  },
  {
    "name": "origin_country",
    "type": "STRING",
    "mode": "REPEATED"
  }
]
EOF
}

```

#### cloudfunction.tf

```hcl
resource "google_storage_bucket" "bucket" {
  name     = "collecting-tf"
  location = "asia-northeast1"
}

data "archive_file" "function_archive" {
  type        = "zip"
  source_dir  = "../src"       # directory for main.py,requirement.txt
  output_path = "../index.zip" # zipped file name
}

resource "google_storage_bucket_object" "archive" {
  name   = "../index.zip"
  bucket = google_storage_bucket.bucket.name
  source = data.archive_file.function_archive.output_path
}

resource "google_cloudfunctions_function" "function" {
  name        = "function-tdmb"
  description = "Digest tmdb data"
  runtime     = "python37"

  available_memory_mb   = 256
  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.archive.name
  service_account_email = "terraform-service-account@gcp-compute-engine-343613.iam.gserviceaccount.com"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = "projects/gcp-compute-engine-343613/topics/streaming-topic"
  }
  entry_point = "insert_bq_tmdb_data"
}

```

#### pubsub.tf

```hcl
resource "google_pubsub_topic" "topic" {
  name = "streaming-topic"

  labels = {
    purpose = "tmdb"
  }
}
```

#### scheduler.tf

In this sample, I am calling API every 12 o'clock to get daily trend of movies.

```hcl
resource "google_cloud_scheduler_job" "job" {
  name        = "cron-job"
  description = "cron job"
  schedule    = "0 12 * * *" // Every 12 o'clock
  time_zone   = "Asia/Tokyo"

  pubsub_target {
    # topic.id is the topic's full resource name.
    topic_name = google_pubsub_topic.topic.id
    data       = base64encode("test")
  }
}

```

#### variables.tf

```hcl
variable "stages" {
  default = {
    collecting-dev  = "dev"
  }
}

variable "region" {
  default = "asia-northeast1"
}

variable "zone" {
  default = "asia-northeast1-a"
}


```

#### main.tf

```hcl
terraform {
  required_version = "~> 0.13.5"
  backend "gcs" {
    bucket = "collecting-tf-state"
  }
}

provider "google" {
  region  = var.region
  version = "~> 3.49"
  project = {$GCP_PROJECT_NAME}
}

data "google_project" "collecting" {
  project_id = {$GCP_PROJECT_NAME}
}

output "workspace" {
  value = terraform.workspace
}

output "gcp_project" {
  value = data.google_project.collecting
}

output "gcp_region" {
  value = var.region
}

output "gcp_zone" {
  value = var.zone
}

data "google_service_account" "terraform_service_account" {
  account_id = "terraform-service-account"
}


```

# Terraform Command

```shell

# Initialize terraform environment

$ terraform init

# See what change will be made

$ terraform plan

# execute terraform function

$ terraform apply

```

# Result

You can execute this sample SQL.
This SQL is to retrieve the movie with the highest daily user review score. Run this in BigQuery Console.

```sql
WITH data AS (
  SELECT
      original_title,
      vote_average,
      _PARTITIONTIME as pt,
      ROW_NUMBER() OVER (PARTITION BY _PARTITIONTIME ORDER BY vote_average DESC) AS row_number
  FROM `{$GCP_PROJECT_NAME}.collecting_db.tmdb_trending`
  ORDER BY _PARTITIONTIME DESC, vote_average DESC
)
SELECT
    *
FROM
    data
WHERE
    row_number = 1
```

#### SQL Result

```
original_title	vote_average	pt	row_number
Top Gun: Maverick	8.371	2022-08-29T00:00:00Z	1
Top Gun: Maverick	8.371	2022-08-28T00:00:00Z	1
Top Gun: Maverick	8.383	2022-08-27T00:00:00Z	1
Top Gun: Maverick	8.384	2022-08-26T00:00:00Z	1
Top Gun: Maverick	8.365	2022-08-25T00:00:00Z	1
Top Gun: Maverick	8.344	2022-08-24T00:00:00Z	1
Top Gun: Maverick	8.328	2022-08-23T00:00:00Z	1
Top Gun: Maverick	8.325	2022-08-22T00:00:00Z	1
Top Gun: Maverick	8.325	2022-08-21T00:00:00Z	1
Top Gun: Maverick	8.331	2022-08-20T00:00:00Z	1
Top Gun: Maverick	8.325	2022-08-19T00:00:00Z	1
Top Gun: Maverick	8.335	2022-08-18T00:00:00Z	1
Top Gun: Maverick	8.339	2022-08-17T00:00:00Z	1
Top Gun: Maverick	8.338	2022-08-16T00:00:00Z	1
Purple Hearts	8.543	2022-08-15T00:00:00Z	1
Luck	8.229	2022-08-14T00:00:00Z	1
Top Gun: Maverick	8.339	2022-08-13T00:00:00Z	1
Purple Hearts	8.559	2022-08-12T00:00:00Z	1
Groot's Pursuit	8.821	2022-08-11T00:00:00Z	1
Purple Hearts	8.556	2022-08-10T00:00:00Z	1
Purple Hearts	8.557	2022-08-09T00:00:00Z	1
Purple Hearts	8.56	2022-08-08T00:00:00Z	1
Purple Hearts	8.539	2022-08-07T00:00:00Z	1
```

It seemes that "Top Gun Maverick" is very popular these days.:)
