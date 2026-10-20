
# Matriz de Acesso RBAC — Planta N2 Smart 4.0

## Objetivo

Documentar os perfis de acesso utilizados pelo sistema e estabelecer
uma base para a implementação da autenticação e autorização no
auth-gateway.

## Perfis de acesso

| Perfil | Descrição |
|---|---|
| OPERATOR | Perfil relacionado à operação da planta. |
| ENGINEER | Perfil relacionado à engenharia e análise técnica. |
| MANAGER | Perfil relacionado ao acompanhamento e à gestão. |
| ADMIN | Perfil administrativo do sistema. |

## Regras de segurança

- As rotas protegidas devem exigir um token JWT válido.
- Tokens ausentes, inválidos ou expirados devem resultar em HTTP 401.
- Usuários autenticados sem permissão devem receber HTTP 403.
- O gateway deve validar a assinatura do JWT e sua validade.
- A autorização deve considerar o perfil do usuário e a permissão
  exigida pela rota.

## Matriz de permissões

As permissões específicas de cada perfil ainda precisam ser
confirmadas com os grupos responsáveis pelas funcionalidades
da planta e com a equipe do projeto.

| Recurso | OPERATOR | ENGINEER | MANAGER | ADMIN |
|---|---|---|---|---|
| Consultar estado da planta | A definir | A definir | A definir | A definir |
| Enviar comandos | A definir | A definir | A definir | A definir |
| Consultar dashboard OEE | A definir | A definir | A definir | A definir |

## Pendências

- Validar as permissões com os demais grupos.
- Confirmar as rotas e os recursos que exigem autenticação.
- Registrar as decisões finais antes da implementação do gateway.
