---
name: Java version GraalVM
description: GraalVM CE 22.3.1 ships Java 19, not Java 21
---

The Replit module `java-graalvm22.3` installs GraalVM CE 22.3.1 which is Java 19 (`openjdk version "19.0.2"`).

**Rule:** `pom.xml` must use `<java.version>17</java.version>` (not 21).

**Why:** `--release 21` fails on a Java 19 JDK; `--release 17` compiles fine since Java 17 LTS is compatible with Spring Boot 3.x.
