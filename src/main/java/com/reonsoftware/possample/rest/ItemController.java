package com.reonsoftware.possample.rest;

import com.reonsoftware.possample.db.ItemDao;
import com.reonsoftware.possample.models.Item;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.ParseException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
@RestController
public class ItemController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ItemController.class);

    @Autowired
    private ItemDao itemDao;

    @RequestMapping("/api/items/")
    public List<Item> getItems() {
        return itemDao.getItems();
    }

    @RequestMapping(value = "/api/items/upload", method = RequestMethod.POST)
    public void handleItemListUpload(@RequestParam("file") MultipartFile file) {
        if (!file.isEmpty()) {
            try {
                List<Item> parsedItems = parseItemsCsv(file);
                parsedItems.forEach(itemDao::insertItem);
                LOGGER.info("Imported " + parsedItems.size() + " items from a CSV file");
            } catch (IOException e) {
                LOGGER.error("Failed to import items from a CSV file", e);
            }
        } else {
            LOGGER.warn("An empty items file was uploaded");
        }
    }

    private List<Item> parseItemsCsv(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            try (InputStreamReader reader = new InputStreamReader(inputStream)) {
                try (CSVParser csvParser = new CSVParser(reader, CSVFormat.EXCEL.withHeader().withIgnoreSurroundingSpaces().withIgnoreEmptyLines())) {
                    Iterable<CSVRecord> records = csvParser.getRecords();

                    // Iterator to stream technique: http://stackoverflow.com/a/23936723/132374
                    return StreamSupport.stream(records.spliterator(), false)
                            .map(record -> {
                                String name = null;
                                String priceText = null;
                                try {
                                    name = record.get("Item Name");
                                    priceText = record.get("Price");
                                } catch (RuntimeException e) {
                                    String errorMessage = "Unable to process an item from a CSV file: " + record;
                                    LOGGER.error(errorMessage, e);
                                    throw new IllegalArgumentException(errorMessage, e);
                                }
                                return new Item(null, name, parseCurrency(priceText));
                            })
                            .collect(Collectors.toList());
                }
            }
        }
    }

    /**
     * From http://stackoverflow.com/a/18231943/132374
     */
    private BigDecimal parseCurrency(String text) {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols();
        symbols.setGroupingSeparator(',');
        symbols.setDecimalSeparator('.');

        DecimalFormat decimalFormat = new DecimalFormat("#,##0.0#", symbols);
        decimalFormat.setParseBigDecimal(true);
        try {
            return (BigDecimal) decimalFormat.parse(text);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Unable to process the item's price: '" + text + "'");
        }
    }

}
