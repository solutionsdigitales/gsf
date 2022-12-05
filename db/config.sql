INSERT INTO `modules` (`id`, `label`, `description`, `icon`) VALUES
(1, 'TREE.DASHBOARD', 'Dashboard', 'pi pi-fw pi-home'),
(2, 'TREE.SETTING', 'Setting', 'pi pi-cogs'),
(3, 'TREE.PRF', 'PRF', 'pi pi-file'),
(4, 'TREE.REPORT', 'Report', 'pi pi-pie-chart'),
(5, 'TREE.FR', 'FR', 'pi pi-file'),
(6, 'TREE.EXPENSE_REPORT', 'Expense report', 'pi pi-file'),
(7, 'TREE.OCH', 'OCH', 'pi pi-file'),
(8, 'TREE.TRAVAL_ADVANCE', 'TA', 'pi pi-file');


INSERT INTO `page` (`code`, `label`, `url`, `isTreeItem`, `module_id`)  VALUES
('conf.0011', 'TREE.PRICE_LIST', 'price_list', 1, 2),
('conf.001', 'TREE.USER', 'users', 1, 2),
('conf.002', 'TREE.ROLE', 'roles', 1, 2),
('conf.0021', 'TREE.CELLULE', 'cellules', 1, 2),
('conf.003', 'TREE.MEMBERS', 'members', 1, 2),
('conf.004', 'TREE.PAYMENT', 'payments', 1, 2),
('dash.001', 'TREE.DASHBOARD', 'dashboard', 1, 1);


INSERT INTO`actions` (`id`,`description`) VALUES
(1, 'CAN_EDIT_ROLE');

INSERT INTO payment_method(`id`, `name`, `translation_key`) VALUES
(1, 'cash', 'VOUCHERS.PAYMENT_METHOD.CASH'),
(2, 'check', 'VOUCHERS.PAYMENT_METHOD.CHECK'),
(3, 'bank_transfer', 'VOUCHERS.PAYMENT_METHOD.BANK_TRANSFER'),
(4, 'gen_journal', 'VOUCHERS.PAYMENT_METHOD.GENERAL_JOURNAL');



INSERT INTO `province` (`id`, `name`) VALUES 
('V/Kinshasa', 'Kinshasa');

INSERT INTO `town` (`id`, `name`, `province_id`) VALUES 
('C/Bandalungwa', 'Bandalungwa', 'V/Kinshasa'),
('C/Barumbu', 'Barumbu', 'V/Kinshasa'),
('C/Bumbu', 'Bumbu', 'V/Kinshasa'),
('C/Gombe', 'Gombe', 'V/Kinshasa'),
('C/Kalamu (Kinshasa)', 'Kalamu (Kinshasa)', 'V/Kinshasa'),
('C/Kasa-Vubu', 'Kasa-Vubu', 'V/Kinshasa'),
('C/Kimbanseke', 'Kimbanseke', 'V/Kinshasa'),
('C/Kinshasa', 'Kinshasa', 'V/Kinshasa'),
('C/Kintambo', 'Kintambo', 'V/Kinshasa'),
('C/Kisenso', 'Kisenso', 'V/Kinshasa'),
('C/Lemba', 'Lemba', 'V/Kinshasa'),
('C/Limete', 'Limete', 'V/Kinshasa'),
('C/Lingwala', 'Lingwala', 'V/Kinshasa'),
('C/Makala', 'Makala', 'V/Kinshasa'),
('C/Maluku', 'Maluku', 'V/Kinshasa'),
('C/Masina', 'Masina', 'V/Kinshasa'),
('C/Matete', 'Matete', 'V/Kinshasa'),
('C/Mont-Ngafula', 'Mont-Ngafula', 'V/Kinshasa'),
('C/Ndjili', 'Ndjili', 'V/Kinshasa'),
('C/Ngaba', 'Ngaba', 'V/Kinshasa'),
('C/Ngaliema', 'Ngaliema', 'V/Kinshasa'),
('C/Ngiri-Ngiri', 'Ngiri-Ngiri', 'V/Kinshasa'),
('C/Nsele', 'Nsele', 'V/Kinshasa'),
('C/Selembao', 'Selembao', 'V/Kinshasa');
