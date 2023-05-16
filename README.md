![license-MIT](https://img.shields.io/badge/license-MIT-blue)

# Blog site with gatsby

hosted by Netlify

## How to run

```
$ cd your-project-name
$ yarn install
# avoid "error:0308010C:digital envelope routines::unsupported"
$ export NODE_OPTIONS=--openssl-legacy-provider 
$ gatsby develop
```

Running `gatsby develop` you will see the following URLs:

```
http://localhost:8000
http://localhost:8000/___graphql
# Netlify CMS page
http://localhost:8000/admin
```
