# Contrato: Produtos

- **Versão:** 0.1.0
- **Status:** DRAFT (aprovação em TASK-0001)

## Entrada
name, description, sku, price (centavos+moeda), attributes, status(active|draft|archived), images

## Saída
product {id, tenant_id, ...}

## Erros
validation_error, not_found, duplicate_sku, forbidden

## Permissões
catalog:read, catalog:write (admin/operador); IA: somente leitura via search_products

## Idempotência
POST/PUT com Idempotency-Key; SKU único por tenant

## Regras
Preço vem só do banco. IA não cria/altera preço.

## Histórico
- 0.1.0 — rascunho inicial.
