package com.reonsoftware.possample.models;

import java.util.List;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
public class Order {

    private final int id;
    private final Integer orderNumber;
    private final List<Item> items;

    public Order(int id, Integer orderNumber, List<Item> items) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.items = items;
    }

    public int getId() {
        return id;
    }

    public Integer getOrderNumber() {
        return orderNumber;
    }

    public List<Item> getItems() {
        return items;
    }

}
