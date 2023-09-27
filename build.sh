#!/bin/bash

docker buildx build --push \
  --platform linux/arm64,linux/amd64 \
  --tag subekti13/exproxy:latest \
  --tag subekti13/exproxy:1.0.0-alpha.2 \
  --progress=plain \
  .