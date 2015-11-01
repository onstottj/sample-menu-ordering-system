package com.reonsoftware.possample.models;

import java.math.BigDecimal;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
public class Item {

    private final long id;
    private final String name;
    private final BigDecimal price;

    public Item(long id, String name, BigDecimal price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

}
