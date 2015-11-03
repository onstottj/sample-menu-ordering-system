package com.reonsoftware.possample.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
public class Order {

    private final Long id;
    private final Integer orderNumber;
    private final List<Item> items;

    @JsonCreator
    public Order(@JsonProperty("id") Long id,
                 @JsonProperty("orderNumber") Integer orderNumber,
                 @JsonProperty("items") List<Item> items) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public Integer getOrderNumber() {
        return orderNumber;
    }

    public List<Item> getItems() {
        return items;
    }

}
