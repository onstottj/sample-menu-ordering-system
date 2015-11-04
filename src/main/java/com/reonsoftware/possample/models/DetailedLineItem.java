package com.reonsoftware.possample.models;

import java.math.BigDecimal;

/**
 * Used when clients retrieve detailed Order data.
 */
public class DetailedLineItem {
    private final Item item;
    private final int quantity;
    private final BigDecimal extendedPrice;

    public DetailedLineItem(Item item, int quantity) {
        this.item = item;
        this.quantity = quantity;
        extendedPrice = item.getPrice().multiply(new BigDecimal(quantity));
    }

    public Item getItem() {
        return item;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getExtendedPrice() {
        return extendedPrice;
    }
}
