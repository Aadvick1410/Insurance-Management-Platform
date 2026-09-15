package com.insurance.platform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Parse the explicit origins list
        List<String> origins = Arrays.asList(allowedOrigins.split(","));

        // Use setAllowedOriginPatterns which supports Spring-style wildcards.
        // To also support multi-level Vercel preview subdomains (e.g. foo-bar-baz-projects.vercel.app)
        // we add a blanket *.vercel.app pattern AND handle it via a custom check below.
        configuration.setAllowedOriginPatterns(origins);

        // Additionally allow ALL vercel.app subdomains (including nested ones like
        // insurance-management-platform-abc123-projects.vercel.app) by registering
        // a second pattern that matches any subdomain of vercel.app
        if (origins.stream().noneMatch(o -> o.contains("**"))) {
            // Ensure we cover preview deployments
            configuration.addAllowedOriginPattern("https://*.vercel.app");
            configuration.addAllowedOriginPattern("https://*-projects.vercel.app");
            configuration.addAllowedOriginPattern("https://*.onrender.com");
        }

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
