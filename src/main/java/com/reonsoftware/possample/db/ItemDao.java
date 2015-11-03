package com.reonsoftware.possample.db;

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
