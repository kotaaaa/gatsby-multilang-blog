---
title: Type of NoSQL Categories Summarization
date: '2022-10-15 00:00:00'
description: SQL, NoSQL
category: Data-Engineering
background: '#ff00cc'
---

# Overview

Recently, NoSQL Database is getting more and more focused, as the amount of data to handle get huge. I would like to summarize the difference and features for each representative Database types of NoSQL in this article.

![db-types](https://raw.githubusercontent.com/kotaaaa/gatsby-multilang-blog/master/static/assets/img/nosql-categories/db-types.svg)

# Row-oriented data source

In row-oriented data source, the data is stored in rows on the disk in contiguous locations or blocks.
On running a query, it is easy to fetch entire row of data for a particuler customer since it resides in the same block.
It is also easy to update customer data since all the data for a certain customer is stored in a single row. Even in the case of partition table, the rows are partitioned horizontally. The columns containing a data of a particular customer always stay together on the disk.

![row-oriented](https://raw.githubusercontent.com/kotaaaa/gatsby-multilang-blog/master/static/assets/img/nosql-categories/row-oriented.svg)

# Column-oriented databases

Column oriented databases, on the other hands, store data in columns as opposed rows.
In this scenario, CustomerIDs are located on the same disk at a certain location in one column,
customer names in another columns, customer city and country will be in respective columns, and so on.

![column-oriented](https://raw.githubusercontent.com/kotaaaa/gatsby-multilang-blog/master/static/assets/img/nosql-categories/column-oriented.svg)

These database is suited for OLAP(Online Analytical Processing) use cases. They provide the best performance when similar data is stored in columns on the disk. Example of Column-oriented databases are Google BigQuery and Amazon Redshift.

But why do we need to store data in columns in opposed to rows.
Imagine the above customer data table having billions of records and the business needs to run analytical query on the table. Say it needs to caluculate the mean age for every city.
If the data is stored in rows on the disk, the query would have to traverse a large number of disk blocks. (accross machine, since data would be partitioned) to figure out the results, processing unnecessary data.

On the other hands, on saving columns on the disk, the query only process the city column, neglecting other customer data, providing high-throughput reads. It would not have to scan through all the records of customer data. Also, similar data in columns can be compressed by using techniques such as run-length encoding(RLE), requiring less storage space than row-based data.

Column-oriented databases are suited for analytical use cases where the business has to make sense of large volumnes of data. However, in this scenario, if we need to add a new row of customer data, this would prove to be resource-intensive since we have to access all the columns to add a new record to them.

For writing a customer data, a row-oriented database would suit the best.
Both data storage model have cons and prods

# NoSQL DataBase Category

## Key-Value

The most simplest archetecture in NoSQL is Key-Value database. Thanks for this simplicity, this is most scalable, allowing horizontal scaling of large amount of data.
There Key-Value Databases has a dictionary data structure that consists of a set of objects that represent fields of data. Each object has a unique key. To retrive the data stored in a particular object, you need to use a specific key, then, in return, you get tha value assigned to the key.
Unlike traditional relational databases, key-value database do not require predefined sturucture. when the data is loaded, type prediction is done. They offer more flexibility when storing data and have faster performance.
Without having to rely on placeholders, key-value database are lighter solution as they require fewer resource.

Such functionality are suitable for large databases that deal with simple data. Therefore, they are commonly used for caching, managing user session, ad servicing, and recommendations

![key-value](https://raw.githubusercontent.com/kotaaaa/gatsby-multilang-blog/master/static/assets/img/nosql-categories/key-value.svg)

## Culumn-Family

In column-oriented NoSQL databases, data is stored in cells grouped in columns of data rather than as rows of data. Columns are logically grouped into column families. Column families can contain a virtually unlimited number of columns that can be created at runtime or while defining the schema. Read and write is done using columns rather than rows. Column families are groups of similar data that is usually accessed together. As a example, we often access customer's city and country at the same time, but not the information on their age.

![column-family](https://raw.githubusercontent.com/kotaaaa/gatsby-multilang-blog/master/static/assets/img/nosql-categories/column-family.svg)

## Document

A feature of Document-based database compared to Key-Value is that value type is json format. In a broad sense, we would say Document-based database is one of the Key-Value database, but Key-Value store has simpler archtecuture. Document-based database is needed if you save a more complicated object for each value.

![document-oriented](https://raw.githubusercontent.com/kotaaaa/gatsby-multilang-blog/master/static/assets/img/nosql-categories/document-oriented.svg)

## Graph

A graph type database stores entities as well the relations amongst those entities. The entity is stored as a node with the relationship as edges. An edge gives a relationship between nodes. Every node and edge has a unique identifier.

Compared to a relational database where tables are loosely connected, a Graph database is a multi-relational in nature. Traversing relationship is fast as they are already captured into the DB, and there is no need to calculate them.

Graph base database mostly used for social networks, logistics, spatial data.

![graph-data](https://raw.githubusercontent.com/kotaaaa/gatsby-multilang-blog/master/static/assets/img/nosql-categories/graph-data.svg)
