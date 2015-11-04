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
    private final Boolean requireOrderNumber;
    /**
     * If null, we won't filter based on whether or not the order is tendered
     */
    private final Boolean requireIsTendered;

    @JsonCreator
    public OrderFilter(@JsonProperty("requireOrderNumber") Boolean requireOrderNumber,
                       @JsonProperty("requireIsTendered") Boolean requireIsTendered) {
        this.requireOrderNumber = requireOrderNumber;
        this.requireIsTendered = requireIsTendered;
    }

    public Boolean getRequireOrderNumber() {
        return requireOrderNumber;
    }

    public Boolean getRequireIsTendered() {
        return requireIsTendered;
    }

    public String getFilterSql() {
        List<String> filters = new ArrayList<>();

        if (requireIsTendered != null) {
            String existsSubquery = "(SELECT * FROM tender WHERE tender.order_id = orders.order_id)";
            if (requireIsTendered)
                filters.add("EXISTS " + existsSubquery);
            else
                filters.add("NOT EXISTS " + existsSubquery);
        }

        if (requireOrderNumber != null) {
            if (requireOrderNumber)
                filters.add("order_number IS NOT NULL");
            else
                filters.add("order_number IS NULL");
        }

        return String.join(" AND ", filters);
    }
}
