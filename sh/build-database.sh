#!/bin/bash

# bash script mode
set -o pipefail

# This assumes you run tests from the top level bhima directory.

echo "[build]"
echo "Building Database"

set -a
source .env
set +a

# set build timeout
TIMEOUT=${BUILD_TIMEOUT:-8}

fout=/dev/null

if [ "$1" == "debug" ]; then
    fout=/dev/tty
fi

# build the test database

mysql -u $DB_USER -p$DB_PASS -e "DROP DATABASE IF EXISTS $DB_NAME ;"
mysql -u $DB_USER -p$DB_PASS -e "CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "[build] database schema"
mysql -u $DB_USER -p$DB_PASS $DB_NAME < db/schema.sql


echo "[build] config data"
mysql -u $DB_USER -p$DB_PASS $DB_NAME < db/config.sql

echo "[build] functions"
mysql -u $DB_USER -p$DB_PASS $DB_NAME < db/function.sql


echo "[build] test data"
mysql -u $DB_USER -p$DB_PASS $DB_NAME < db/data.sql

echo "[/build]"
