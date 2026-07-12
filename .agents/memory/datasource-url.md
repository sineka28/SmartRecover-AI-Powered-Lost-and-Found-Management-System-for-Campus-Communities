---
name: DataSource URL parsing
description: How to handle Replit's postgresql:// DATABASE_URL in Spring Boot
---

Replit's `DATABASE_URL` uses the format `postgresql://user:password@host/dbname?sslmode=disable`.

The PostgreSQL JDBC driver does NOT accept:
- `postgresql://user:password@host/db` (no jdbc: prefix)
- `jdbc:postgresql://user:password@host/db` (credentials embedded — HikariCP rejects this)

**Rule:** Use `DataSourceConfig.java` which manually parses the URI and calls `setJdbcUrl()`, `setUsername()`, `setPassword()` separately on HikariConfig.

**Why:** HikariCP 6.x validates the JDBC URL strictly and does not support embedded userinfo.

**How to apply:** See `src/main/java/com/smartrecover/config/DataSourceConfig.java` — also exclude `DataSourceAutoConfiguration` at `@SpringBootApplication`.
