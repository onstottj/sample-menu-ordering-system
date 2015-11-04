package com.reonsoftware.possample.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
public class Order {

    private final Long id;
    private final Integer orderNumber;
    /**
     * This is a formatted date & time
     */
    private final String numberAssignDate;

    @JsonCreator
    public Order(@JsonProperty("id") Long id,
                 @JsonProperty("orderNumber") Integer orderNumber,
                 @JsonProperty("numberAssignDate") String numberAssignDate) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.numberAssignDate = numberAssignDate;
    }

    public Long getId() {
        return id;
    }

    public Integer getOrderNumber() {
        return orderNumber;
    }

    public String getNumberAssignDate() {
        return numberAssignDate;
    }
}
