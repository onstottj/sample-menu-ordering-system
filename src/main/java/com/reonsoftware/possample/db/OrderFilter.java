package com.reonsoftware.possample.db;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
public class OrderFilter {
    /**
     * If null, we won't filter based on the order number
     */
    private final Boolean hasOrderNumber;
    /**
     * If null, we won't filter based on whether or not the order is tendered
     */
    private final Boolean isTendered;

    @JsonCreator
    public OrderFilter(@JsonProperty("hasOrderNumber") Boolean hasOrderNumber,
                       @JsonProperty("isTendered") Boolean isTendered) {
        this.hasOrderNumber = hasOrderNumber;
        this.isTendered = isTendered;
    }

    public Boolean getHasOrderNumber() {
        return hasOrderNumber;
    }

    public Boolean getIsTendered() {
        return isTendered;
    }

    public String getFilterSql() {
        List<String> filters = new ArrayList<>();

        if (isTendered != null) {
            String existsSubquery = "(SELECT * FROM tender WHERE tender.order_id = orders.order_id)";
            if (isTendered)
                filters.add("EXISTS " + existsSubquery);
            else
                filters.add("NOT EXISTS " + existsSubquery);
        }

        if (hasOrderNumber != null) {
            if (hasOrderNumber)
                filters.add("order_number IS NOT NULL");
            else
                filters.add("order_number IS NULL");
        }

        return String.join(" AND ", filters);
    }
}
