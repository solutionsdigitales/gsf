ALTER TABLE `pricing` ADD `is_periodic` TINYINT(2);

-- 05/12/2022
ALTER TABLE `pricing` 
    ADD `is_debt` TINYINT(2) DEFAULT 0,
    ADD `is_refund` TINYINT(2) DEFAULT 0;
ALTER TABLE `transactions`
    ADD KEY `year`(`year`),
    ADD KEY `month`(`month`);


-- 22/10/2025
CREATE TABLE `invoice`(
  `uuid` BINARY(16) NOT NULL,
  `member_uuid` BINARY(16) NOT NULL,
  `amount` VARCHAR(100) NOT NULL,
  `number` INTEGER NOT NULL,
  `currency_id` tinyint(3) unsigned NOT NULL,
  `frequency` VARCHAR(100) NOT NULL,
  `date` DATETIME NOT NULL,
  `created_by` BINARY(16) NOT NULL COMMENT 'user_id',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update` DATETIME NULL,
  PRIMARY KEY (`uuid`)
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

alter table transactions ADD
  `invoice_uuid` BINARY(16) NULL;

delete  from `modules` where id> 2;
delete  from `page` where module_id> 2;
DELETE FROM    `page` WHERE code='conf.004';
INSERT INTO modules (`id`, `label`, `description`, `icon`) VALUES
(3, 'TREE.FINANCE', 'FINANCE', 'pi pi-file');


INSERT INTO `page` (`code`, `label`, `url`, `isTreeItem`, `module_id`)  VALUES
('fin1.001', 'TREE.INVOICE', 'invoice', 1, 3),
('fin2.001', 'TREE.PAYMENT', 'payments', 1, 3);


