#!/bin/bash
sleep 30
set -e
# Análise do Código
yarn lint
yarn style
yarn typecheck
yarn compliance

# Teste smoke
yarn test:smoke

# Testes unitários
yarn test:unit

# Migração do banco de dados
yarn migrate:test
yarn migrate:test:generate
yarn migrate:test:reset --force

# Testes fim a fim
yarn test:e2e

# Limpar banco para teste de API
yarn migrate:test:reset

# Testes de API
yarn e2e:run