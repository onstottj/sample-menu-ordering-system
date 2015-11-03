package com.reonsoftware.possample;

import com.mysql.jdbc.Driver;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;

/**
 * @author Jon Onstott
 * @since 10/31/2015
 */
@SpringBootApplication
public class Application {

    @Bean
    JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(createDataSource());
    }

    @Bean
    NamedParameterJdbcTemplate getNamedParameterJdbcTemplate() {
        return new NamedParameterJdbcTemplate(createDataSource());
    }

    private SimpleDriverDataSource createDataSource() {
        SimpleDriverDataSource dataSource = new SimpleDriverDataSource();
        dataSource.setDriverClass(Driver.class);
        dataSource.setUrl("jdbc:mysql://localhost:3306/pos");
        dataSource.setUsername("pos");
        dataSource.setPassword("pos");
        return dataSource;
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
