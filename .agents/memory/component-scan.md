---
name: Component scan packages
description: Main app package vs config package mismatch requires explicit ComponentScan
---

The main application class lives in `com.smartrecover.smartrecover` but configs/services/controllers are in `com.smartrecover.*`.

**Rule:** Always add `@ComponentScan(basePackages = { "com.smartrecover" })` to `SmartRecoverApplication.java`.

**Why:** Default scan only covers the package of the annotated class and its sub-packages; the sibling `com.smartrecover.config` package is not a sub-package of `com.smartrecover.smartrecover`.
