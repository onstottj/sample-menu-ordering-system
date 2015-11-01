package com.reonsoftware.possample.models;

import java.math.BigDecimal;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
public class Item {
    private final int id;
    private final String name;
    private final BigDecimal price;

    public Item(int id, String name, BigDecimal price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }
}
