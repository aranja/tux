#!/usr/bin/env bash

tslint -c './tslint.json' \
  -e './{utilities,src,addons,adapters,examples}/**/node_modules/**/*' \
  -e './{utilities,src,addons,adapters,examples}/**/es/**/*'\
  -e './{utilities,src,addons,adapters,examples}/**/lib/**/*' \
  './{utilities,src,addons,adapters,examples}/**/*.{ts,tsx}';