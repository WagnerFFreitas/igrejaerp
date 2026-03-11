#!/bin/bash

echo "=========================================="
echo "Configurando Banco de Dados PostgreSQL"
echo "=========================================="
echo ""

DB_NAME="erp_local"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "Este script vai criar o banco de dados '$DB_NAME' e suas tabelas."
echo "Certifique-se de que o PostgreSQL está instalado e rodando."
echo ""

# Pede a senha (opcional, o psql vai pedir automaticamente se necessário)
read -s -p "Digite a senha do usuario postgres: " PGPASSWORD
export PGPASSWORD
echo ""

echo "[1/2] Criando o banco de dados '$DB_NAME'..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true

echo "[2/2] Criando as tabelas a partir do arquivo schema.sql..."
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f database/schema.sql

echo ""
echo "=========================================="
echo "Concluído! O banco de dados foi gerado."
echo "=========================================="
