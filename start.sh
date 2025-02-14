#!/bin/bash

# Migração do banco de dados
yarn migrate
yarn migrate:generate
yarn migrate:reset --force

# Deploy
yarn deploy