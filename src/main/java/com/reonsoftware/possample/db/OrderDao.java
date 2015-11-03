package com.reonsoftware.possample.db;

import com.reonsoftware.possample.models.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
@Component
public class OrderDao {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderDao.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public long createOrder(Order order) {
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        namedParameterJdbcTemplate.update("INSERT INTO orders(order_number) VALUES (:orderNumber)", new BeanPropertySqlParameterSource(order), keyHolder);
        LOGGER.info("Created a new Order: " + order);
        return keyHolder.getKey().longValue();
    }

    public void addItemToOrder(long orderId, long itemId) {
        jdbcTemplate.update("INSERT INTO order_line_items(order_id, item_id) VALUES (?,?)", orderId, itemId);
        LOGGER.info("Added item " + itemId + " to order " + orderId);
    }

}
