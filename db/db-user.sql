CREATE USER 'harmony_user'@'localhost' IDENTIFIED BY 'h@rm0ny_us#r';
GRANT ALL PRIVILEGES ON *.* TO 'harmony_user'@'localhost';
ALTER USER 'harmony_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'h@rm0ny_us#r';
FLUSH PRIVILEGES;

