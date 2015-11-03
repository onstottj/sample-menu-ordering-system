package com.reonsoftware.possample.db;

import com.reonsoftware.possample.models.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
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
        Integer existingQuantity = countQuantityOfItemForOrder(orderId, itemId);
        if (existingQuantity == 0)
            createOrderLineItem(orderId, itemId);
        else
            updateOrderLineItem(orderId, itemId, existingQuantity + 1);
        LOGGER.info("Added item " + itemId + " to order " + orderId);
    }

    public void updateItemQuantity(long orderId, long itemId, int quantity) {
        jdbcTemplate.update("UPDATE order_line_items SET quantity = ? WHERE order_id = ? AND item_id = ?", quantity, orderId, itemId);
    }

    /**
     * Removes all occurrences of the item from the order
     */
    public void deleteItemFromOrder(long orderId, long itemId) {
        jdbcTemplate.update("DELETE FROM order_line_items WHERE order_id = ? AND item_id = ?", orderId, itemId);
    }

    private int countQuantityOfItemForOrder(long orderId, long itemId) {
        try {
            return jdbcTemplate.queryForObject("SELECT quantity FROM order_line_items WHERE order_id = ? AND item_id = ?", Integer.class, orderId, itemId);
        } catch (EmptyResultDataAccessException e) {
            // TODO: it would be nice if catching exceptions wasn't part of normal operation...
            return 0;
        }
    }

    private void createOrderLineItem(long orderId, long itemId) {
        jdbcTemplate.update("INSERT INTO order_line_items(order_id, item_id, quantity) VALUES (?,?,1)", orderId, itemId);
    }

    private void updateOrderLineItem(long orderId, long itemId, int newQuantity) {
        jdbcTemplate.update("UPDATE order_line_items SET quantity = ? WHERE order_id = ? AND item_id = ?", newQuantity, orderId, itemId);
    }

}
