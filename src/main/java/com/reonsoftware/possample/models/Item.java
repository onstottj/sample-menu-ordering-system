package com.reonsoftware.possample.models;

import java.math.BigDecimal;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
public class Item {

    /**
     * Can be null if this item hasn't been persisted yet
     */
    private final Long id;
    private final String name;
    private final BigDecimal price;

    public Item(Long id, String name, BigDecimal price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

}
