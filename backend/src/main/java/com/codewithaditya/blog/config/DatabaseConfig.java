package com.codewithaditya.blog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        // If DATABASE_URL is provided (like on Render), parse it
        if (databaseUrl != null && !databaseUrl.isEmpty() && !databaseUrl.startsWith("jdbc:")) {
            try {
                URI dbUri = new URI(databaseUrl);
                String username = dbUri.getUserInfo().split(":")[0];
                String password = dbUri.getUserInfo().split(":")[1];
                
                // Handle port properly
                int port = dbUri.getPort();
                if (port == -1) {
                    port = 5432;
                }
                
                String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + port + dbUri.getPath();
                
                org.springframework.boot.jdbc.DataSourceBuilder dataSourceBuilder = org.springframework.boot.jdbc.DataSourceBuilder.create();
                dataSourceBuilder.url(dbUrl);
                dataSourceBuilder.username(username);
                dataSourceBuilder.password(password);
                dataSourceBuilder.driverClassName("org.postgresql.Driver");
                
                return dataSourceBuilder.build();
            } catch (Exception e) {
                throw new RuntimeException("Error parsing DATABASE_URL: " + databaseUrl, e);
            }
        }
        
        // Otherwise, return null to let Spring Boot use the default configuration
        return null;
    }
} 