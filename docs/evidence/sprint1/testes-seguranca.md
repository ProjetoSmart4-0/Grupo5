
# Evidências de Segurança — Sprint 1

Projeto: SMART 4.0 - Planta N2
Grupo: 5 — API Gateway, IAM, Segurança RBAC e Infraestrutura Cloud
Ambiente: Local de desenvolvimento

## 1. Objetivo

Registrar os testes iniciais de autenticação JWT e autorização RBAC
realizados no Auth Gateway.

## 2. Resultados dos testes

| Teste | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|
| Requisição sem token | HTTP 401 | HTTP 401 | PASS |
| Requisição com token inválido | HTTP 401 | HTTP 401 | PASS |
| Perfil OPERATOR acessando rota de teste ADMIN | HTTP 403 | HTTP 403 | PASS |
| Perfil ADMIN acessando sua rota de teste | HTTP 200 | HTTP 200 | PASS |

## 3. Implementações realizadas

- Servidor Express executando localmente.
- Validação de JWT com a biblioteca jsonwebtoken.
- Verificação da assinatura e validade do token.
- Middleware de autenticação.
- Middleware de autorização por perfil.
- Rota de teste protegida para demonstrar o controle de acesso.

## 4. Limitações atuais

- Os testes foram realizados somente no ambiente local.
- A rota /api/v1/test/admin é exclusivamente demonstrativa.
- As permissões definitivas das rotas da planta ainda dependem
  da validação com os demais grupos.
- Os contratos de entrada e saída das APIs ainda precisam ser
  detalhados e revisados.
- A integração com a planta física não foi realizada.
- O teste específico de token expirado ainda precisa ser registrado.

## 5. Próximas atividades

- Validar a matriz RBAC com os responsáveis pelas funcionalidades.
- Testar tokens expirados.
- Aplicar as regras aprovadas às rotas reais.
- Documentar os resultados e revisar o contrato OpenAPI.
