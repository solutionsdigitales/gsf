#!/bin/bash

# bash script mode
set -euo pipefail

./sh/build-database.sh || { echo 'failed to build DB' ; exit 1; }

echo "[test]"

echo "[test] running tests using mocha"
# run the tests
./server/node_modules/.bin/mocha --timeout 10000 --recursive --bail --exit ./test/integration/

echo "[/test]"