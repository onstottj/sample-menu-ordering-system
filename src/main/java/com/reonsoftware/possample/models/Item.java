package com.reonsoftware.possample.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    @JsonCreator
    public Item(@JsonProperty("id") Long id,
                @JsonProperty("name") String name,
                @JsonProperty("price") BigDecimal price) {
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
