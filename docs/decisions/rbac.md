# Matriz de Acesso RBAC — Planta N2 Smart 4.0

## Objetivo

Documentar os perfis de acesso utilizados no sistema SMART 4.0 — Planta N2 e estabelecer as regras de autenticação e autorização que deverão ser aplicadas pelo auth-gateway.

O controle de acesso utiliza RBAC (Role-Based Access Control), no qual cada usuário possui um perfil que determina quais funcionalidades pode acessar.

As permissões descritas neste documento seguem as responsabilidades estabelecidas pelo professor no documento da Sprint 2.

## Perfis de acesso

| Perfil | Descrição |
|---|---|
| OPERATOR | Operador responsável pelo acompanhamento e pelos acionamentos básicos da planta. |
| ENGINEER | Engenheiro responsável pelos ajustes técnicos e parâmetros de operação. |
| MANAGER | Gestor responsável pelo acompanhamento da produção, indicadores OEE e ordens de produção. |
| ADMIN | Administrador responsável pelo gerenciamento de usuários, serviços e configurações administrativas. |

## Regras de segurança

- Todas as rotas protegidas devem exigir um token JWT válido.
- O token JWT deve ser enviado pelo cabeçalho `Authorization: Bearer <token>` nas chamadas REST protegidas.
- O auth-gateway deve validar a assinatura HMAC-SHA256 e a validade do JWT.
- Tokens ausentes, inválidos ou expirados devem resultar em HTTP 401 (Unauthorized).
- Usuários autenticados sem a permissão exigida devem receber HTTP 403 (Forbidden).
- Usuários autenticados e autorizados podem prosseguir para a funcionalidade solicitada.
- O perfil do usuário deve ser obtido da claim `role` do JWT validado, e não de parâmetros enviados livremente pelo cliente.
- A autorização deve ser aplicada individualmente às rotas protegidas.
- As credenciais e chaves secretas não devem ser expostas no repositório, nos logs ou no código do frontend.
- Endereços IP industriais e portas de comunicação dos CLPs e do robô não devem ser expostos diretamente à internet.

## Matriz de permissões funcionais — Sprint 2

A matriz abaixo representa as capacidades atribuídas a cada perfil pelo documento da Sprint 2.

| Perfil | Permissões funcionais |
|---|---|
| OPERATOR | Consultar o estado da planta e executar acionamentos básicos de Start, Stop e Emergência. |
| ENGINEER | Ajustar parâmetros de borda, taxa de polling e pontos de calibração do robô. |
| MANAGER | Consultar relatórios OEE, histórico de produção e abrir ordens de produção. |
| ADMIN | Acessar rotas administrativas e de gerenciamento, incluindo controle de usuários e reinício de serviços. |

## Matriz de autorização por recurso

A tabela abaixo registra as permissões explicitamente atribuídas pelo professor. Os campos pendentes não representam autorização concedida.

| Recurso | OPERATOR | ENGINEER | MANAGER | ADMIN |
|---|---|---|---|---|
| Consultar estado da planta | Permitido | Pendente | Pendente | Pendente |
| Executar Start/Stop | Permitido | Pendente | Pendente | Pendente |
| Solicitar acionamento de emergência | Permitido* | Pendente | Pendente | Pendente |
| Ajustar parâmetros de borda | Pendente | Permitido | Pendente | Pendente |
| Ajustar taxa de polling | Pendente | Permitido | Pendente | Pendente |
| Calibrar pontos do robô | Pendente | Permitido | Pendente | Pendente |
| Consultar relatórios OEE | Pendente | Pendente | Permitido | Pendente |
| Consultar histórico de produção | Pendente | Pendente | Permitido | Pendente |
| Abrir ordens de produção | Pendente | Pendente | Permitido | Pendente |
| Gerenciar usuários | Pendente | Pendente | Pendente | Permitido |
| Reiniciar serviços | Pendente | Pendente | Pendente | Permitido |

**Legenda:**

- **Permitido:** capacidade explicitamente atribuída ao perfil na Sprint 2.
- **Pendente:** permissão não especificada para essa combinação de perfil e recurso; não deve ser concedida automaticamente.
- **Permitido\*:** capacidade mencionada no documento, sujeita às proteções e à validação de segurança industrial.

A autorização de um comando no software não substitui os mecanismos físicos de segurança da planta. A implementação de acionamentos deverá ser validada com os responsáveis pela automação.

O documento atribui ao ADMIN acesso irrestrito às rotas de gerenciamento. A aplicação desse acesso às demais rotas operacionais deverá ser formalizada antes da implementação.

## Aplicação no auth-gateway

O auth-gateway é responsável por verificar a autenticação e a autorização antes de permitir o acesso às funcionalidades protegidas.

O processo de validação deve seguir estas etapas:

1. Receber a requisição HTTP.
2. Verificar se o token JWT foi informado.
3. Validar a assinatura e a expiração do token.
4. Identificar o perfil do usuário pela claim `role`.
5. Verificar se o perfil possui autorização para a operação solicitada.
6. Retornar HTTP 401 para falhas de autenticação.
7. Retornar HTTP 403 para acessos autenticados sem permissão.
8. Encaminhar a requisição ou executar a funcionalidade quando o acesso estiver autorizado.

## Rota demonstrativa da Sprint 1

A rota `GET /api/v1/test/admin` foi utilizada para demonstrar o funcionamento inicial do controle RBAC.

| Situação | Resultado esperado |
|---|---|
| Requisição sem token | HTTP 401 |
| Token inválido | HTTP 401 |
| Token expirado | HTTP 401 |
| Token válido com perfil OPERATOR | HTTP 403 |
| Token válido com perfil ADMIN | HTTP 200 |

Essa rota é demonstrativa e não comprova que todas as rotas reais da Planta N2 já estejam protegidas.

## Pendências de integração

- Confirmar os caminhos e métodos HTTP dos endpoints dos Grupos 1, 2 e 3.
- Confirmar com o Grupo 4 quais operações serão consumidas pelo frontend.
- Definir as permissões não especificadas na matriz por recurso.
- Associar cada endpoint real à sua política RBAC.
- Atualizar o contrato `contracts/openapi-spec.yaml` com as rotas e os requisitos de segurança confirmados.
- Aplicar as regras de autorização no `services/auth-gateway/server.js`.
- Criar o script `generate-test-tokens.py` para geração de tokens de teste.
- Implementar testes automatizados de autenticação e autorização.
- Registrar evidências dos retornos HTTP 200, 401 e 403.
- Validar a integração com os microsserviços e a implantação do auth-gateway no GCP Cloud Run.

## Estado atual

A matriz funcional foi atualizada com base nas responsabilidades da Sprint 2.

A implementação completa das permissões nas rotas reais, a integração com os microsserviços e os testes automatizados ainda precisam ser confirmados e executados.

Este documento registra as regras planejadas de acesso, não uma comprovação de que todas elas já estão implementadas.