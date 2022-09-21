---
title: SOLID Principles explanation
date: '2020-10-09T00:00:00'
description: RESTful
category: Application Design
background: '#4169e1'
---

# What is SOLID Principles

SOLID Principles are guildlines to follow when building a software so that it is easier to scale and maintain.

# The SOLID Principles

## S — Single Responsibility

-   A class should have a single responsibility

Class should have just one responsibility not more than two. keep your class simple.

## O — Open-Closed

-   Classes should be open for extension, but closed for modification

Class's Responsibility should not be changed many times, but modification should be easily allowed.

## L — Liskov Substitution

-   If S is a subtype of T, then objects of type T in a program may be replaced with objects of type S without altering any of the desirable properties of that program.

Should be consistent so that parent classes and their children classes can be used in the same way without error

## I — Interface Segregation

-   Clients should not be forced to depend on methods that they do not use.

Trying to get a class to perform behavior it does not use is wasteful and can lead to unexpected bugs if the class does not have the ability to perform that behavior.

A class should only perform the behavior necessary to fulfill its role. Other behaviors should be removed completely or moved elsewhere if they may be used in other classes in the future.

## D — Dependency Inversion

-   High-level modules should not depend on low-level modules. Both should depend on the abstraction.

-   Abstractions should not depend on details. Details should depend on abstractions.

Detailed process should not depend on the processing of the original parent class.

[Reference](https://medium.com/backticks-tildes/the-s-o-l-i-d-principles-in-pictures-b34ce2f1e898)
