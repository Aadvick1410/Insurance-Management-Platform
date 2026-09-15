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
        // Check Render standard DATABASE_URL environment variable
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl != null && !envDbUrl.isBlank() && !envDbUrl.startsWith("jdbc:")) {
            try {
                URI uri = new URI(envDbUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;

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

        String finalUrl = datasourceUrl;
        if (finalUrl != null && finalUrl.startsWith("postgres://")) {
            finalUrl = "jdbc:" + finalUrl;
        } else if (finalUrl != null && finalUrl.startsWith("postgresql://") && !finalUrl.startsWith("jdbc:")) {
            finalUrl = "jdbc:" + finalUrl;
        }

        return DataSourceBuilder.create()
                .url(finalUrl)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
