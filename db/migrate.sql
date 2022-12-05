ALTER TABLE `pricing` ADD `is_periodic` TINYINT(2);

-- 05/12/2022
INSERT INTO `page` (`code`, `label`, `url`, `isTreeItem`, `module_id`)  VALUES
('dash.001', 'TREE.DASHBOARD', 'dashboard', 1, 1);