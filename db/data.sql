

SET @userID = HUID('ef24cf1a-d5b9-4826-b78c-520e01c1e136');
SET @testUserID = HUID('ef15cf1a-d5b9-4826-b78c-520e01c1e198');

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


INSERT INTO `currency` (`id`, `name`, `format_key`, `symbol`, `intel_number_format`, `min_monentary_unit`) VALUES
(1, 'Dollar americain', 'USD', '$', 'en-US', '0.01'),
(2, 'Franc Congolais', 'CDF', 'FC', 'it-IT', '50.00'),
(3, 'Euro', 'EUR', '€', 'it-IT', '0.01');


INSERT INTO `gender`(`id`, `label`) VALUES 
('M', 'FORM.LABELS.MALE'),
('F', 'FORM.LABELS.FEMALE');
