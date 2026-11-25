# Política RBAC e Whitelist — Sprint 3

## 1. Objetivo

Definir as regras de autenticação, autorização e controle de origens da Planta N2 SMART 4.0.

## 2. Autenticação JWT

- Algoritmo: HS256.
- Validade dos tokens de teste: 24 horas.
- Claims obrigatórias: sub, role, origem e exp.
- Armazenamento seguro da chave secreta por variável de ambiente.

## 3. Matriz RBAC proposta

| Funcionalidade | OPERATOR | ENGINEER | MANAGER | ADMIN |
|---|---|---|---|---|
| Leitura de telemetria | Sim | Sim | Não | Sim |
| Comandos operacionais básicos | Sim | Não | Não | Sim |
| Configuração técnica | Não | Sim | Não | Sim |
| Calibração do robô | Não | Sim | Não | Sim |
| Relatórios OEE | Não | Não | Sim | Sim |
| Ordens de produção | Não | Não | Sim | Sim |
| Administração | Não | Não | Não | Sim |

A matriz deverá ser ratificada pelos grupos responsáveis antes da aplicação nas rotas reais.

## 4. Whitelist de origens

- unidade1-grupo1
- unidade1-grupo2
- unidade1-grupo3
- unidade1-grupo4
- unidade1-grupo5

Origens desconhecidas deverão ser rejeitadas.

A whitelist de comandos na borda deverá ser implementada e validada conjuntamente com o Grupo 1.

## 5. Comando de emergência

O comando EMERGENCY_STOP deverá possuir tratamento excepcional na whitelist da borda, com registro auditável e respeitando as proteções físicas e os intertravamentos locais.

## 6. Respostas de segurança

- HTTP 200: acesso autorizado.
- HTTP 400: requisição inválida.
- HTTP 401: falha de autenticação.
- HTTP 403: acesso sem permissão.
- HTTP 500: erro interno.
- WebSocket 4001: token inválido no broker.

## 7. Pendências

- Ratificação das permissões por rota.
- Integração com os microsserviços.
- Validação da whitelist na borda.
- Validação do broker WebSocket.
- Homologação conjunta.