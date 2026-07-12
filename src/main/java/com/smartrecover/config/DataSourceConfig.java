package com.smartrecover.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Converts Replit's postgres:// DATABASE_URL to a proper JDBC datasource.
 * Replit provides:  postgresql://user:password@host/dbname?sslmode=disable
 * JDBC needs:        jdbc:postgresql://host/dbname  with separate user/password props.
 */
@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        if (databaseUrl != null && !databaseUrl.isBlank()) {
            try {
                // Strip the scheme prefix so java.net.URI can parse it
                String uriStr = databaseUrl
                        .replaceFirst("^postgresql://", "//")
                        .replaceFirst("^postgres://", "//");

                URI uri = new URI(uriStr);

                String host = uri.getHost();
                int    port = uri.getPort() > 0 ? uri.getPort() : 5432;
                // path starts with '/'
                String db   = uri.getPath().replaceFirst("^/", "");

                // Build proper JDBC URL (no credentials embedded)
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, db);

                // Append any query params except user/password
                String rawQuery = uri.getRawQuery();
                if (rawQuery != null && !rawQuery.isBlank()) {
                    // pass everything through; JDBC driver handles sslmode, etc.
                    jdbcUrl += "?" + rawQuery;
                }

                config.setJdbcUrl(jdbcUrl);
                config.setDriverClassName("org.postgresql.Driver");

                // Extract credentials from userinfo
                String userInfo = uri.getUserInfo();
                if (userInfo != null) {
                    String[] parts = userInfo.split(":", 2);
                    config.setUsername(parts[0]);
                    if (parts.length > 1) {
                        config.setPassword(parts[1]);
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse DATABASE_URL: " + databaseUrl, e);
            }
        } else {
            // Fallback for local dev without DATABASE_URL set
            config.setJdbcUrl("jdbc:postgresql://localhost:5432/smartrecover");
            config.setUsername("postgres");
            config.setPassword("postgres");
        }

        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(20000);
        config.setIdleTimeout(300000);
        config.setMaxLifetime(1200000);

        return new HikariDataSource(config);
    }
}
