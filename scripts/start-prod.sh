#!/bin/bash
set -e
NODE_ENV=production node artifacts/api-server/dist/index.cjs
