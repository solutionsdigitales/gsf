ALTER TABLE `pricing` ADD `is_periodic` TINYINT(2);

-- 05/12/2022
ALTER TABLE `pricing` 
    ADD `is_debt` TINYINT(2) DEFAULT 0,
    ADD `is_refund` TINYINT(2) DEFAULT 0;
ALTER TABLE `transactions`
    ADD KEY `year`(`year`),
    ADD KEY `month`(`month`);