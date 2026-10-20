
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "smart40-auth-gateway"
  });
});

function autenticarToken(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({
      erro: "Chave JWT nao configurada no servidor"
    });
  }

  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      erro: "Token de acesso ausente"
    });
  }

  const token = authorization.split(" ")[1];

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (erro) {
    return res.status(401).json({
      erro: "Token invalido ou expirado"
    });
  }
}

function autorizarPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    if (!perfisPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({
        erro: "Usuario sem permissao para acessar este recurso"
      });
    }

    next();
  };
}

app.use("/api/v1", autenticarToken);

app.get(
  "/api/v1/test/admin",
  autorizarPerfil("ADMIN"),
  (req, res) => {
    res.status(200).json({
      mensagem: "Acesso autorizado",
      perfil: req.usuario.role
    });
  }
);

app.use("/api/v1", (req, res) => {
  res.status(501).json({
    erro: "Funcionalidade ou permissao ainda nao implementada"
  });
});

app.listen(PORT, () => {
  console.log(`Auth Gateway rodando na porta ${PORT}`);
});
