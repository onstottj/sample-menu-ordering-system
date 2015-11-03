package com.reonsoftware.possample.db;

import com.reonsoftware.possample.models.Tender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
@Component
public class TenderDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void createTenderRecord(Tender tender, long orderId) {
        jdbcTemplate.update("INSERT INTO tender(order_id, amount_tendered, change_due) VALUES (?,?,?)",
                orderId,
                tender.getAmountTendered(),
                tender.getChangeDue());
    }

}
