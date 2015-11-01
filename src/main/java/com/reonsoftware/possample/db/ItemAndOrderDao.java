package com.reonsoftware.possample.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
public class ItemAndOrderDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;


}
