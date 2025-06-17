package com.codewithaditya.blog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
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
    @ConditionalOnProperty(name = "DATABASE_URL")
    public DataSource dataSource() {
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            try {
                URI dbUri = new URI(databaseUrl);
                String username = dbUri.getUserInfo().split(":")[0];
                String password = dbUri.getUserInfo().split(":")[1];
                String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
                
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
        return null;
    }
} 