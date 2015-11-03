package com.reonsoftware.possample.rest;

import com.reonsoftware.possample.db.OrderDao;
import com.reonsoftware.possample.models.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * @author Jon Onstott
 * @since 11/2/2015
 */
@RestController
public class OrderController {

    @Autowired
    private OrderDao orderDao;

    /**
     * TODO: in production systems, a REST POST call would typically return the created object
     *
     * @return the PK of the created Order
     */
    @RequestMapping(value = "/api/orders", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public long createOrder(@RequestBody Order order) {
        return orderDao.createOrder(order);
    }

    @RequestMapping(value = "/api/orders/{orderId}/items", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public void addItemToOrder(@PathVariable("orderId") long orderId,
                               @RequestParam("itemId") long itemId) {
        orderDao.addItemToOrder(orderId, itemId);
    }

}
