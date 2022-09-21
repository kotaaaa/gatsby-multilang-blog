---
title: RESTful design principle explanation
date: '2021-05-01T18:46:37.121Z'
description: RESTful
category: Application
background: '#4169e1'
---

# What is RESTful

REST (Representational State Transfer) is a design model for web services.
REST is a concept for handling resources (content such as blog posts, photos, etc.), and REST web services send and receive data by accessing the URI of the service with the HTTP method.

# REST Design Principles

When designing REST, it is recommended that the following items be used as design principles.
Web services that adhere to these principles are called RESTful services.

-   Addressability
-   Stateless
-   Connectability
-   Uniform Interface

## Addressability

The first principle is that the information is published under an addressable URI.
All information provided has a unique address expressed as a URI.

Ex) [Shopify Retrive a single product API](https://shopify.dev/api/admin-rest/2022-07/resources/product#get-products-product-id)

-   /admin/api/2022-07/products/{product_id}.json

You can access item detail infomation from this url that has a directory structure.

## Stateless

Being stateless means that the information exchanged is complete and interpretable on its own, without session or other state management.
It means that the request contains all the information necessary for processing and is self-contained.
The opposite is stateful.
Server does not make response from any state information.
The same results are returned no matter who makes the request.

## Connectability

Connectivity is the ability to include inside information another piece of information or a link to that information.
The server guides the client's path by providing hypermedia (links and forms within hypertext representations).
Actually, API response seldom have another URL, but the important point is you can put the URL in response whenever you want.

## Uniform Interface

This means that the interfaces (use of HTTP methods) are unified. All information operations are to use HTTP methods (GET, POST, PUT, DELETE)
