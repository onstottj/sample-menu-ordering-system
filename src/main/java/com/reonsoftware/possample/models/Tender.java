package com.reonsoftware.possample.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
public class Tender {

    private final Long id;
    private final long orderId;
    private final BigDecimal amountTendered;
    private final BigDecimal changeDue;

    public Tender(@JsonProperty("id") Long id,
                  @JsonProperty("orderId") long orderId,
                  @JsonProperty("amountTendered") BigDecimal amountTendered,
                  @JsonProperty("changeDue") BigDecimal changeDue) {
        this.id = id;
        this.orderId = orderId;
        this.amountTendered = amountTendered;
        this.changeDue = changeDue;
    }

    public Long getId() {
        return id;
    }

    public long getOrderId() {
        return orderId;
    }

    public BigDecimal getAmountTendered() {
        return amountTendered;
    }

    public BigDecimal getChangeDue() {
        return changeDue;
    }
}
