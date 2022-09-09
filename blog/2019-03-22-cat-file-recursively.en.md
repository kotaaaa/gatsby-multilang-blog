---
title: Cat file recursively Linux memo shell
date: '2019-03-22 18:46:37'
description: Linux, xargs
category: Linux
background: '#696969'
image: '/assets/img/05.jpg'
page: true
---

```shell
$ find -type f -print0 | xargs -0 more | cat
```
