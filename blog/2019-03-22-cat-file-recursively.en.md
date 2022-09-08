---
title: Cat file recursively
date: '2019-03-22 18:46:37'
description: Linux, xargs
category: Markdown
background: '#353b48'
# image: '/assets/img/03.jpg'
---

```shell
$ find -type f -print0 | xargs -0 more | cat
```
