---
title: Kubectl version returns dial tcp timeout
date: '2020-05-17T00:00:00.000Z'
description: Kubectl, tcp
category: Kubernetes
background: '#008000'
---

# Kubectl version returns dial tcp timeout

## Problem

```shell
$ kubectl version
WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.  Use --output=yaml|json to get the full version.
Client Version: version.Info{Major:"1", Minor:"24", GitVersion:"v1.24.0", GitCommit:"4ce5a8954017644c5420bae81d72b09b735c21f0", GitTreeState:"clean", BuildDate:"2022-05-03T13:36:49Z", GoVersion:"go1.18.2", Compiler:"gc", Platform:"darwin/amd64"}
Kustomize Version: v4.5.4
Unable to connect to the server: dial tcp 192.168.99.104:8443: i/o timeout
```

## Solution

```shell
$ brew update && brew upgrade
$ brew reinstall kubernetes-cli
$ brew install minikube
Warning: minikube 1.25.2 is already installed, it's just not linked.
To link this version, run:
  brew link minikube
$ brew link minikube
Linking /usr/local/Cellar/minikube/1.25.2...
Error: Could not symlink bin/minikube
Target /usr/local/bin/minikube
already exists. You may want to remove it:
  rm '/usr/local/bin/minikube'
To force the link and overwrite all conflicting files:
  brew link --overwrite minikube
To list all files that would be deleted:
  brew link --overwrite --dry-run minikube
$ rm '/usr/local/bin/minikube'
$ brew link minikube
$ minikube delete
$ minikube start
```

## Result

```shell
$ kubectl version
WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.  Use --output=yaml|json to get the full version.
Client Version: version.Info{Major:"1", Minor:"24", GitVersion:"v1.24.0", GitCommit:"4ce5a8954017644c5420bae81d72b09b735c21f0", GitTreeState:"clean", BuildDate:"2022-05-03T13:36:49Z", GoVersion:"go1.18.2", Compiler:"gc", Platform:"darwin/amd64"}
Kustomize Version: v4.5.4
Server Version: version.Info{Major:"1", Minor:"23", GitVersion:"v1.23.3", GitCommit:"816c97ab8cff8a1c72eccca1026f7820e93e0d25", GitTreeState:"clean", BuildDate:"2022-01-25T21:19:12Z", GoVersion:"go1.17.6", Compiler:"gc", Platform:"linux/amd64"}
```

Enjoy!
