DELIMITER $$

/*
  HUID(hexUuid)

  Converts a hex uuid (36 chars) into a binary uuid (16 bytes)
*/
DROP FUNCTION IF EXISTS HUID $$

CREATE FUNCTION HUID(_uuid CHAR(36))
RETURNS BINARY(16) DETERMINISTIC
  RETURN UNHEX(REPLACE(_uuid, '-', ''));
$$
/*
  BUID(binaryUuid)

  Converts a binary uuid (16 bytes) to dash-delimited hex UUID (36 characters).
*/
DROP FUNCTION IF EXISTS BUID $$
CREATE FUNCTION BUID(b BINARY(16))
RETURNS CHAR(32) DETERMINISTIC
BEGIN
  RETURN HEX(b);
END $$

DROP FUNCTION IF EXISTS FORMAT_DATE $$
CREATE FUNCTION FORMAT_DATE(_date DATETIME)
RETURNS VARCHAR(30) DETERMINISTIC
BEGIN
  RETURN DATE_FORMAT(_date,'%Y-%m-%d');
END $$

DROP FUNCTION IF EXISTS FORMAT_DATETIME $$
CREATE FUNCTION FORMAT_DATETIME(_date DATETIME)
RETURNS VARCHAR(30) DETERMINISTIC
BEGIN
  RETURN DATE_FORMAT(_date,'%Y-%m-%d %H:%i:%s');
END $$


DROP FUNCTION IF EXISTS FORMAT_ENTITY_NUMBER $$
CREATE FUNCTION FORMAT_ENTITY_NUMBER(_number INT)
RETURNS VARCHAR(10) DETERMINISTIC
BEGIN

  IF _number < 10 THEN
  	RETURN CONCAT("0000", _number);
  ELSEIF _number < 100 THEN
  	RETURN CONCAT("000", _number);
  	
  ELSEIF _number < 1000 THEN
  	RETURN CONCAT("00", _number);
   ELSEIF _number < 10000 THEN
  RETURN CONCAT("000", _number);
  END IF;
  
  RETURN CONCAT("", _number);
END $$


DELIMITER ;
