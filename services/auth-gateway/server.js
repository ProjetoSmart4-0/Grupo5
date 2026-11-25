
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

// Cria a aplicacao Express.
const app = express();

// Recupera as variaveis de ambiente.
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Impede a inicializacao sem uma chave segura.
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("Configure um JWT_SECRET seguro.");
}

// Define os quatro perfis autorizados.
const PERFIS = [
  "OPERATOR",
  "ENGINEER",
  "MANAGER",
  "ADMIN"
];

// Define as cinco origens reconhecidas.
const ORIGENS = [
  "unidade1-grupo1",
  "unidade1-grupo2",
  "unidade1-grupo3",
  "unidade1-grupo4",
  "unidade1-grupo5"
];

// Permite receber requisicoes JSON.
app.use(express.json());

// Rota publica para verificar se o servidor esta ativo.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "smart40-auth-gateway"
  });
});

// Middleware responsavel pela autenticacao JWT.
function autenticarToken(req, res, next) {

  const authorization = req.headers.authorization;

  // Verifica se o token foi informado corretamente.
  if (
    !authorization ||
    !/^Bearer \S+$/i.test(authorization)
  ) {
    return res.status(401).json({
      erro: "Token de acesso ausente ou invalido"
    });
  }

  // Extrai o token do cabecalho Authorization.
  const token = authorization.split(" ")[1];

  try {

    // Valida a assinatura e a expiracao do JWT.
    const usuario = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"]
    });

    // Verifica as claims obrigatorias da Sprint 3.
    if (
      !usuario ||
      typeof usuario !== "object" ||
      !ORIGENS.includes(usuario.sub) ||
      !ORIGENS.includes(usuario.origem) ||
      usuario.sub !== usuario.origem ||
      typeof usuario.role !== "string" ||
      !Number.isFinite(usuario.exp)
    ) {
      return res.status(401).json({
        erro: "Claims obrigatorias invalidas"
      });
    }

    // Armazena os dados autenticados na requisicao.
    req.usuario = usuario;

    // Permite continuar para a proxima verificacao.
    next();

  } catch (erro) {

    // Rejeita tokens invalidos ou expirados.
    return res.status(401).json({
      erro: "Token invalido ou expirado"
    });
  }
}

// Middleware responsavel pelo controle RBAC.
function autorizarPerfil(...perfisPermitidos) {

  return (req, res, next) => {

    // Verifica se o perfil possui acesso a rota.
    if (
      !PERFIS.includes(req.usuario.role) ||
      !perfisPermitidos.includes(req.usuario.role)
    ) {
      return res.status(403).json({
        erro: "Usuario sem permissao"
      });
    }

    // Autoriza a continuacao da requisicao.
    next();
  };
}

// Protege as rotas iniciadas por /api.
app.use("/api", autenticarToken);

// Rota demonstrativa exclusiva do perfil ADMIN.
app.get(
  "/api/v1/test/admin",
  autorizarPerfil("ADMIN"),
  (req, res) => {

    res.status(200).json({
      mensagem: "Acesso autorizado",
      perfil: req.usuario.role,
      origem: req.usuario.origem
    });
  }
);

// Retorno temporario para rotas nao implementadas.
app.use("/api", (req, res) => {

  res.status(501).json({
    erro: "Funcionalidade ainda nao implementada"
  });
});

// Inicializa o servidor.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Auth Gateway rodando na porta ${PORT}`);
});
