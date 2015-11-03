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

    /**
     * Changes an item's quantity for an order.
     *
     * TODO: with this URL, you'd typically be updating the whole Item object
     */
    @RequestMapping(value = "/api/orders/{orderId}/items/{itemId}", method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.OK)
    public void updateItemQuantity(@PathVariable("orderId") long orderId,
                                   @PathVariable("itemId") long itemId,
                                   @RequestParam("quantity") int quantity) {
        orderDao.updateItemQuantity(orderId, itemId, quantity);
    }

    /**
     * Removes the item from the order completely (no matter what the quantity is)
     */
    @RequestMapping(value = "/api/orders/{orderId}/items/{itemId}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.OK)
    public void deleteItemFromOrder(@PathVariable("orderId") long orderId,
                                    @PathVariable("itemId") long itemId) {
        orderDao.deleteItemFromOrder(orderId, itemId);
    }

}
