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
('dash.001', 'TREE.DASHBOARD', 'dashboard', 1, 1),
('conf.001', 'TREE.USER', 'users', 1, 2),
('conf.002', 'TREE.ROLE', 'roles', 1, 2),
('conf.004', 'TREE.EMPLOYEE', 'employees', 1, 2),
('conf.006', 'FORM.LABELS.SERVICE', 'services', 1, 2),
-- ('conf.007', 'TREE.DIVISION', 'divisions', 1, 2),
('conf.008', 'TREE.LOCATION', 'locations', 1, 2),
('conf.009', 'TREE.PROJECT', 'projects', 1, 2),
-- ('conf.010', 'TREE.SUB_PROJECT', 'sub_projects', 1, 2),
('conf.011', 'TREE.ACCOUNT', 'accounts', 1, 2),
-- ('conf.012', 'TREE.FUNDING_SOURCE', 'funding_sources', 1, 2),
-- ('conf.013', 'TREE.ACTIVITY', 'activities', 1, 2),
-- ('conf.014', 'TREE.ENTITY', 'entities', 1, 2),
-- ('conf.015', 'TREE.FUNCTION_CODE', 'function_codes', 1, 2),
('conf.016', 'TREE.BUDGET_LINE', 'budget_lines', 1, 2),
('conf.017', 'TREE.VENDOR', 'vendors', 1, 2),
('conf.018', 'TREE.TA_SETTING', 'ta_setting', 1, 2),
('prf.001', 'FORM.BUTTONS.NEWe', 'prf_registration', 1, 3),
('prf.002', 'TREE.PRF_REGISTRY', 'prf_registry', 1, 3),
('prf.003', 'TREE.PRF_HISTORIC', 'prf_historic', 0, 3),
('prf.004', 'PRF.LIST_TO_APPROVE', 'prf_approve_view', 0, 3),
('prf.005', 'VOUCHERS.NOTES', 'prf_notes', 0, 3),
('fr.001', 'FORM.BUTTONS.NEWe', 'fr_registration', 1, 5),
('fr.002', 'TREE.PRF_REGISTRY', 'fr_registry', 1, 5),
('exr.001', 'FORM.BUTTONS.NEW', 'exr_registration', 1, 6),
('exr.002', 'TREE.PRF_REGISTRY', 'exr_registry', 1, 6),
('och.001', 'FORM.BUTTONS.NEW', 'och_registration', 1, 7),
('och.002', 'TREE.PRF_REGISTRY', 'och_registry', 1, 7),
('ta.001', 'FORM.BUTTONS.NEW', 'ta_registration', 1, 8),
('ta.002', 'TREE.PRF_REGISTRY', 'ta_registry', 1, 8);


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
