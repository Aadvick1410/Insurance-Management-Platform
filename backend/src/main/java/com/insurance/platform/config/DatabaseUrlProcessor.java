package com.insurance.platform.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Converts Render's DATABASE_URL (postgres://user:pass@host:port/db)
 * into Spring Boot datasource properties before any beans are created.
 * This avoids the bean-conflict issues of a custom DataSource @Bean.
 */
public class DatabaseUrlProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            System.out.println("[DatabaseUrlProcessor] No DATABASE_URL found, using defaults.");
            return; // No DATABASE_URL set, use defaults from application.properties
        }
        System.out.println("[DatabaseUrlProcessor] Found DATABASE_URL, parsing...");

        // If it's already a JDBC URL, just set it directly
        if (databaseUrl.startsWith("jdbc:")) {
            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", databaseUrl);
            environment.getPropertySources().addFirst(new MapPropertySource("renderDb", props));
            return;
        }

        try {
            // Normalize: postgres:// -> postgresql:// for URI parsing
            String normalized = databaseUrl;
            if (normalized.startsWith("postgres://")) {
                normalized = "postgresql" + normalized.substring("postgres".length());
            }

            URI uri = new URI(normalized);
            String host = uri.getHost();
            int port = uri.getPort() == -1 ? 5432 : uri.getPort();
            String path = uri.getPath(); // e.g. /insurance_db
            String query = uri.getQuery();

            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
            if (query != null && !query.isBlank()) {
                jdbcUrl += "?" + query;
            }

            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", jdbcUrl);

            if (uri.getUserInfo() != null) {
                String[] userInfo = uri.getUserInfo().split(":", 2);
                props.put("spring.datasource.username", userInfo[0]);
                if (userInfo.length > 1) {
                    props.put("spring.datasource.password", userInfo[1]);
                }
            }

            // Add as highest-priority property source
            environment.getPropertySources().addFirst(new MapPropertySource("renderDb", props));
            System.out.println("[DatabaseUrlProcessor] Successfully set spring.datasource.url=" + jdbcUrl);
        } catch (Exception e) {
            System.err.println("WARNING: Failed to parse DATABASE_URL: " + e.getMessage());
        }
    }
}
