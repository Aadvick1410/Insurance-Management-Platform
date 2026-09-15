package com.insurance.platform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/insurance_db}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:postgres}")
    private String username;

    @Value("${spring.datasource.password:password}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String finalUrl = datasourceUrl;
        boolean isDefaultUrl = finalUrl.equals("jdbc:postgresql://localhost:5432/insurance_db");

        // If the user explicitly provided SPRING_DATASOURCE_URL, use it (giving it priority).
        if (!isDefaultUrl) {
            if (finalUrl.startsWith("postgres://")) {
                finalUrl = "jdbc:" + finalUrl;
            } else if (finalUrl.startsWith("postgresql://") && !finalUrl.startsWith("jdbc:")) {
                finalUrl = "jdbc:" + finalUrl;
            }
            return DataSourceBuilder.create()
                    .url(finalUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        }

        // Fallback to Render standard DATABASE_URL environment variable if present
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl != null && !envDbUrl.isBlank()) {
            if (envDbUrl.startsWith("jdbc:")) {
                finalUrl = envDbUrl;
            } else {
                try {
                    URI uri = new URI(envDbUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    String query = uri.getQuery();
                    
                    String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                    if (query != null && !query.isBlank()) {
                        jdbcUrl += "?" + query;
                    }

                    String dbUser = username;
                    String dbPass = password;
                    if (uri.getUserInfo() != null) {
                        String[] parts = uri.getUserInfo().split(":");
                        dbUser = parts[0];
                        if (parts.length > 1) {
                            dbPass = parts[1];
                        }
                    }

                    return DataSourceBuilder.create()
                            .url(jdbcUrl)
                            .username(dbUser)
                            .password(dbPass)
                            .driverClassName("org.postgresql.Driver")
                            .build();
                } catch (Exception ignored) {
                }
            }
        }

        // Final fallback to the default (will likely fail if DB is not on localhost)
        return DataSourceBuilder.create()
                .url(finalUrl)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
