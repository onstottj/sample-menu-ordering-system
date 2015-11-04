CREATE TABLE `items` (
	`item_id` INT(11) NOT NULL AUTO_INCREMENT,
	`name`    VARCHAR(45)      DEFAULT NULL,
	`price`   DECIMAL(15, 2)   DEFAULT NULL,
	PRIMARY KEY (`item_id`),
	UNIQUE KEY `item_name_uk` (`name`)
)
	ENGINE = InnoDB
	AUTO_INCREMENT = 123
	DEFAULT CHARSET = utf8;

CREATE TABLE `order_line_items` (
	`order_line_item_id` INT(11) NOT NULL AUTO_INCREMENT,
	`order_id`           INT(11) NOT NULL,
	`item_id`            INT(11) NOT NULL,
	`quantity`           INT(11) NOT NULL,
	PRIMARY KEY (`order_line_item_id`),
	KEY `oli_items_fk_idx` (`item_id`),
	KEY `oli_orders_fk_idx` (`order_id`),
	CONSTRAINT `oli_items_fk` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `oli_orders_fk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	AUTO_INCREMENT = 18
	DEFAULT CHARSET = utf8;

CREATE TABLE `orders` (
	`order_id`           INT(11) NOT NULL AUTO_INCREMENT,
	`order_number`       INT(11)          DEFAULT NULL,
	`number_assign_date` DATETIME         DEFAULT NULL,
	PRIMARY KEY (`order_id`)
)
	ENGINE = InnoDB
	AUTO_INCREMENT = 23
	DEFAULT CHARSET = utf8;

CREATE TABLE `tender` (
	`tender_id`       INT(11)        NOT NULL AUTO_INCREMENT,
	`order_id`        INT(11)        NOT NULL,
	`amount_tendered` DECIMAL(15, 2) NOT NULL,
	`change_due`      DECIMAL(15, 2) NOT NULL,
	PRIMARY KEY (`tender_id`),
	KEY `tender_order_fk_idx` (`order_id`),
	CONSTRAINT `tender_order_fk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	AUTO_INCREMENT = 11
	DEFAULT CHARSET = utf8;
