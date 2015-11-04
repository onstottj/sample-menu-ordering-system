package com.reonsoftware.possample.db;

import com.reonsoftware.possample.models.DetailedLineItem;
import com.reonsoftware.possample.models.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
@Component
public class ItemDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<DetailedLineItem> getDetailedLineItems(long orderId) {
        String lineItemSql = "SELECT item_id, quantity FROM order_line_items WHERE order_id = ?";
        return jdbcTemplate.query(lineItemSql, (itemRs, rowNum1) -> {
            long itemId = itemRs.getLong("item_id");
            Item item = getItem(itemId);
            int quantity = itemRs.getInt("quantity");
            return new DetailedLineItem(item, quantity);
        }, orderId);
    }

    private Item getItem(long itemId) {
        return jdbcTemplate.queryForObject("SELECT item_id, name, price FROM items WHERE item_id = ?", new ItemMapper(), itemId);
    }

    public List<Item> getItems() {
        return jdbcTemplate.query("SELECT item_id, name, price FROM items", new ItemMapper());
    }

    public void createItem(Item item) {
        jdbcTemplate.update("INSERT INTO items(name, price) VALUES (?,?)", item.getName(), item.getPrice());
    }

    private static class ItemMapper implements RowMapper<Item> {
        @Override
        public Item mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            return new Item(
                    resultSet.getLong("item_id"),
                    resultSet.getString("name"),
                    resultSet.getBigDecimal("price"));
        }
    }

}
