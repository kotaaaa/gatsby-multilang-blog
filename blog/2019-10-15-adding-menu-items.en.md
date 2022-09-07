---
title: 'Adding menu itemssss'
date: '2019-10-16 15:41:34'
description: Add menu items in GraphQL to create a dynamic menu
category: Gatsby, Airflow
background: '#7d4cdb'
image: '/assets/img/01.jpg'
---

The menu items translations are located in `config/menu` and the `useMenu` custom hook pulls these translations (via GraphQL query) and inserts them into the pages.

<a href="http://www.google.com">Link to Google</a> <br/>
<a href="/about">Internal link</a>

```JS
{
  "menuItems": [
    { "name": "Home", "link": "/" },
    { "name": "About", "link": "/about-me" },
    { "name": "Blog", "link": "/blog" },
    { "name": "Contact", "link": "/contact" }
  ]
}
```
