---
name: Spring Boot datasource autoconfigure exclusion
description: Must exclude DataSourceAutoConfiguration when supplying a custom DataSource bean
---

When providing a custom `@Bean DataSource`, Spring Boot's `DataSourceAutoConfiguration` still runs and errors with "url attribute is not specified" unless excluded.

**Rule:** Add to `@SpringBootApplication`:
```java
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
```

**Why:** Auto-config validates `spring.datasource.url` at startup before custom beans are registered.
