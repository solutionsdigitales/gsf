CREATE TABLE `currency` (
  `id` tinyint(3) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `format_key` varchar(20) NOT NULL,
  `symbol` varchar(15) NOT NULL,
  `intel_number_format` VARCHAR(10)  NOT NULL DEFAULT 'en-US',
  `note` text,
  `min_monentary_unit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `enterprise`;
CREATE TABLE IF NOT EXISTS `enterprise` (
  `uuid`  BINARY(16) NOT NULL,
  `name` varchar(200)  NULL,
  `abbreviation` varchar(200)  NULL,
  `code` varchar(200)  NULL,
  `currency_id` tinyint(3) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `name`(`name`),
  KEY `currency_id`(`currency_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `uuid`  BINARY(16) NOT NULL,
  `name` varchar(200)  NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `name`(`name`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


DROP TABLE IF EXISTS `gender`;
CREATE TABLE IF NOT EXISTS `gender` (
 `id` VARCHAR(3) NOT NULL,
  `label` varchar(100) NOT NULL,
  PRIMARY KEY(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Dumping structure for table ihris_sheet_test.modules
CREATE TABLE IF NOT EXISTS `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(35) NOT NULL,
  `description` text,
  `icon` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Dumping structure for table ihris_sheet_test.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `uuid` binary(16) NOT NULL,
  `label` varchar(50) NOT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `label_2` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Dumping structure for table ihris_sheet_test.page
CREATE TABLE IF NOT EXISTS `page` (
  `code` varchar(25) NOT NULL,
  `label` varchar(50) NOT NULL,
  `url` varchar(40) NOT NULL,
  `isTreeItem` tinyint(1) NOT NULL DEFAULT '1',
  `module_id` int(11) DEFAULT NULL,
  `application_code` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`code`),
  KEY `module_id` (`module_id`),
  FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Data exporting was unselected.

-- Dumping structure for table ihris_sheet_test.role_page
CREATE TABLE IF NOT EXISTS `role_page` (
  `uuid` binary(16) DEFAULT NULL,
  `page_code` varchar(20) DEFAULT NULL,
  `role_uuid` binary(16) DEFAULT NULL,
  UNIQUE KEY `role_page` (`role_uuid`,`page_code`),
  KEY `page_code` (`page_code`),
  KEY `role_uuid` (`role_uuid`),
  FOREIGN KEY (`page_code`) REFERENCES `page` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`role_uuid`) REFERENCES `roles` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `actions` (
  `id` INT(10) UNSIGNED NOT NULL,
  `description` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `role_actions` (
  `uuid` BINARY(16) NOT NULL,
  `role_uuid` BINARY(16) NOT NULL,
  `actions_id`INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`uuid`),
  CONSTRAINT `role_actions__action` FOREIGN KEY (`actions_id`) REFERENCES `actions` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `role_actions__role` FOREIGN KEY (`role_uuid`) REFERENCES `roles` (`uuid`) ON UPDATE CASCADE  ON DELETE CASCADE
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 
CREATE TABLE IF NOT EXISTS `user` (
  `id` BINARY(16) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `pwd` varchar(100) NOT NULL,
  `locked` TINYINT(2) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_nom_user` (`name`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Dumping structure for table ihris_sheet_test.users_roles
CREATE TABLE IF NOT EXISTS `users_roles` (
  `uuid` binary(16) NOT NULL,
  `users_id` binary(16) NOT NULL,
  `roles_uuid` binary(16) NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `roles_uuid` (`roles_uuid`),
  KEY `users_id` (`users_id`),
  FOREIGN KEY (`roles_uuid`) REFERENCES `roles` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`users_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping structure for table user_op
CREATE TABLE IF NOT EXISTS `user_op` (
  `id` binary(16) NOT NULL,
  `user_id` binary(16) DEFAULT NULL,
  `is_create` tinyint(1) DEFAULT NULL,
  `text` VARCHAR(100) DEFAULT NULL,
  `date_op` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `exchange_rate` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `currency_id` tinyint(3) unsigned NOT NULL,
  `rate` decimal(19,8) unsigned NOT NULL,
  `sell_rate` decimal(19,8) unsigned DEFAULT '0.00000000',
  `buy_rate` decimal(19,8) unsigned DEFAULT '0.00000000',
  `bank_rate` decimal(19,8) unsigned DEFAULT '0.00000000',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `currency_id` (`currency_id`),
  KEY `rate` (`rate`),
  KEY `date` (`date`),
  FOREIGN KEY (`currency_id`) REFERENCES `currency` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `entity_map`;
CREATE TABLE `entity_map` (
  `uuid`              BINARY(16) NOT NULL,
  `text`              TEXT NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

DROP TABLE IF EXISTS `document_map`;
CREATE TABLE `document_map` (
  `uuid`              BINARY(16) NOT NULL,
  `text`              TEXT NOT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


CREATE TABLE payment_method(
  `id` INT NOT NULL,
  `name` VARCHAR(100),
  `translation_key` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name`(`name`)
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `province` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  UNIQUE KEY `name`(`name`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `town` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `province_id` VARCHAR(100) NOT NULL,
  UNIQUE KEY `name`(`name`),
  KEY `province_id`(`province_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `cellule` (
  `uuid` BINARY(16) NOT NULL,
  `name` VARCHAR(100),
  `number` INT NOT NULL,
  `town_id` VARCHAR(100)  NOT NULL,
  `creation_date` DATE NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` datetime NULL,
  KEY `town_id`(`town_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `member`(
  `uuid` BINARY(16) NOT NULL,
  `lastname` VARCHAR(100) NOT NULL,
  `middlename` VARCHAR(100),
  `firstname` VARCHAR(100)  NOT NULL,
  `address` VARCHAR(100)  NOT NULL,
  `profession`  VARCHAR(250) NULL,
  `phone`  VARCHAR(100) NULL,
  `email`  VARCHAR(50) NULL,
  `gender` VARCHAR(2) NOT NULL,
  `town_id`VARCHAR(100) NOT NULL,
  `number` INT NOT NULL,
  `cellule_uuid` BINARY(16) NOT NULL,
  `joining_date` DATE NOT NULL,
  `created_by` BINARY(16) NOT NULL COMMENT 'user_id',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME NULL,
  PRIMARY KEY (`uuid`)
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


CREATE TABLE `invoice`(
  `uuid` BINARY(16) NOT NULL,
  `member_uuid` BINARY(16) NOT NULL,
  `amount` VARCHAR(100) NOT NULL,
  `currency_id` tinyint(3) unsigned NOT NULL,
  `frequency` VARCHAR(100) NOT NULL,
  `date` DATETIME NOT NULL,
  `created_by` BINARY(16) NOT NULL COMMENT 'user_id',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME NULL,
  PRIMARY KEY (`uuid`)
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `pricing`(
  `uuid` BINARY(16) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(19,4) NOT NULL,
  `is_periodic` TINYINT(2),
  `is_debt` TINYINT(2),
  `is_refund` TINYINT(2),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME NULL,
  PRIMARY KEY (`uuid`)
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `transactions`(
  `uuid` BINARY(16) NOT NULL,
  `amount` DECIMAL(19, 4) NOT NULL,
  `quantity` DECIMAL(19, 4) NOT NULL,
  `number` INT NOT NULL,
  `member_uuid` BINARY(16) NOT NULL,
  `pricing_uuid` BINARY(16) NULL,
  `invoice_uuid` BINARY(16) NULL,
  `date` DATE NOT NULL,
  `transaction_type` VARCHAR(50) NOT NULL,
  `month` VARCHAR(30) NULL,
  `year` VARCHAR(10) NULL,
  `currency` VARCHAR(50) NOT NULL,
  `currency_id` tinyint(3) unsigned NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `user_id` BINARY(16) NULL,
  `phone`  VARCHAR(50) NULL,
  `email` VARCHAR(50) NULL,
  `status` VARCHAR(5) NOT NULL,
  `reference` VARCHAR(100) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME NULL,
  `locked` TINYINT(2) DEFAULT 0,
  PRIMARY KEY (`uuid`),
  KEY `member_uuid`(`member_uuid`),
  KEY `pricing_uuid`(`pricing_uuid`),
  KEY `user_id`(`user_id`),
  KEY `status`(`status`),
  KEY `year`(`year`),
  KEY `month`(`month`),
  CONSTRAINT `transaction__currency` FOREIGN KEY (`currency_id`) REFERENCES `currency` (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
