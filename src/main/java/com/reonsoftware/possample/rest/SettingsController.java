package com.reonsoftware.possample.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
@RestController
public class SettingsController {

    /**
     * Sales tax, which is about 6%.  This could be stored in the database or a configuration file.
     */
    public static double SALES_TAX_RATE = 0.059446733372;

    @RequestMapping("/api/settings/salesTaxRate")
    public double getSalesTaxRate() {
        return SALES_TAX_RATE;
    }

}
