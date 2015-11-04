package com.reonsoftware.possample.models;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * An {@link Order}, populated with additional data that could be useful to clients.
 * Just used for order retrieval at the moment.
 */
public class DetailedOrder extends Order {
    private final List<DetailedLineItem> lineItems;
    private final BigDecimal totalDue;
    private final Tender tender;

    public DetailedOrder(long id, Integer orderNumber, Date numberAssignDate, List<DetailedLineItem> lineItems, BigDecimal totalDue, Tender tender) {
        super(id, orderNumber, numberAssignDate);
        this.lineItems = lineItems;
        this.totalDue = totalDue;
        this.tender = tender;
    }

    public List<DetailedLineItem> getLineItems() {
        return lineItems;
    }

    public BigDecimal getTotalDue() {
        return totalDue;
    }

    public Tender getTender() {
        return tender;
    }
}
