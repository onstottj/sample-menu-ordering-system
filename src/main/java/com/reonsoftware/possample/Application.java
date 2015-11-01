package com.reonsoftware.possample;

import com.mysql.jdbc.Driver;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;

/**
 * @author Jon Onstott
 * @since 10/31/2015
 */
@SpringBootApplication
public class Application {

    @Bean
    JdbcTemplate getJdbcTemplate() {
        SimpleDriverDataSource dataSource = new SimpleDriverDataSource();
        dataSource.setDriverClass(Driver.class);
        dataSource.setUrl("jdbc:mysql://localhost:3306/pos");
        dataSource.setUsername("pos");
        dataSource.setPassword("pos");
        return new JdbcTemplate(dataSource);
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
