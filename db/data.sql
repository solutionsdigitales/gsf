

SET @userID = HUID('ef24cf1a-d5b9-4826-b78c-520e01c1e136');
SET @testUserID = HUID('ef15cf1a-d5b9-4826-b78c-520e01c1e198');


SET @USD = 1;
SET @FC = 2;
SET @EUR = 3;

INSERT INTO `currency` (`id`, `name`, `format_key`, `symbol`, `intel_number_format`, `min_monentary_unit`) VALUES
(@USD, 'Dollar americain', 'USD', '$', 'en-US', '0.01'),
(@FC , 'Franc Congolais', 'CDF', 'FC', 'it-IT', '50.00'),
(@EUR , 'Euro', 'EUR', '€', 'it-IT', '0.01');

SET @enterprise_id = HUID('ef24cf1a-d3b9-4826-b70c-520e01c1e136');;


INSERT INTO enterprise(uuid, name, currency_id)
VALUES(@enterprise_id, "GSF", @USD);

INSERT INTO `user` (`id`, `name`, `pwd`) VALUES
(@userID , 'admin', '21232f297a57a5a743894a0e4a801fc3'),
(@testUserID , 'test', '21232f297a57a5a743894a0e4a801fc3');

-- roles
SET @roleUUID = HUID('ef24cf1a-d5b9-4826-b70c-520e01c1e136');
SET @simpleEmployeeRoleUUID = HUID('ef24cf1a-d5b9-4826-b70c-520e01c1e114');

INSERT INTO roles(uuid, label, is_default) VALUES
(@roleUUID, 'Super user', 0),
(@simpleEmployeeRoleUUID, 'Simple employee', 1);


INSERT INTO users_roles(uuid, users_id, roles_uuid) VALUES
(HUID(uuid()), @userID, @roleUUID ),
(HUID(uuid()), @testUserID, @roleUUID );

INSERT INTO role_page 
SELECT HUID(uuid()), code, @roleUUID  FROM page;

-- actions
INSERT INTO role_actions
  SELECT HUID(UUID()) as uuid, @roleUUID, id FROM actions;



INSERT INTO `exchange_rate`(`currency_id`, `rate`, `sell_rate`, `buy_rate`)
 VALUES ( 2, 2000, 2700, 2000);

INSERT INTO `gender`(`id`, `label`) VALUES 
('M', 'FORM.LABELS.MALE'),
('F', 'FORM.LABELS.FEMALE');
