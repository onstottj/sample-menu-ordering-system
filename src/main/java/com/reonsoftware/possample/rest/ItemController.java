package com.reonsoftware.possample.rest;

import com.reonsoftware.possample.db.ItemDao;
import com.reonsoftware.possample.models.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
@RestController
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    @RequestMapping("/api/items")
    public List<Item> getItems() {
        return itemDao.getItems();
    }

}
