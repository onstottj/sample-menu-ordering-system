package com.reonsoftware.possample.rest;

import com.reonsoftware.possample.db.TenderDao;
import com.reonsoftware.possample.models.Tender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
@RestController
public class TenderController {

    @Autowired
    TenderDao tenderDao;

    @RequestMapping(value = "/api/orders/{orderId}/tender", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public void createTenderRecord(@PathVariable("orderId") long orderId,
                                   @RequestBody Tender tender) {
        tenderDao.createTenderRecord(tender, orderId);
    }

}
