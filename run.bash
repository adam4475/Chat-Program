#!/bin/bash
set -e
echo "launching server..."
node server.js &
echo "launching client..."
open http://127.0.0.1:8084/client.html &
echo "waiting for all processes to finish..."
wait
echo "Done."