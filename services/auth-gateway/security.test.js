
require("dotenv").config();

const { test } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

// Define o endereco do Gateway.
const BASE_URL =
  process.env.BASE_URL || "http://localhost:3000";

// Recupera a chave secreta do ambiente.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET nao configurado.");
}

// Gera tokens utilizados nos testes automatizados.
function gerarToken(role, expiresIn = "24h", extras = {}) {

  return jwt.sign(
    {
      sub: "unidade1-grupo5",
      role,
      origem: "unidade1-grupo5",
      ...extras
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn
    }
  );
}

// Envia uma requisicao para a rota administrativa.
async function acessarRota(token) {

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}/api/v1/test/admin`, {
    method: "GET",
    headers
  });
}

// TESTE 1 - Verifica se o Gateway esta ativo.
test("Health deve retornar HTTP 200", async () => {

  const resposta = await fetch(`${BASE_URL}/health`);

  assert.equal(resposta.status, 200);
});

// TESTE 2 - Rejeita requisicoes sem token.
test("Sem token deve retornar HTTP 401", async () => {

  const resposta = await acessarRota();

  assert.equal(resposta.status, 401);
});

// TESTE 3 - Rejeita tokens invalidos.
test("Token invalido deve retornar HTTP 401", async () => {

  const resposta = await acessarRota("token-invalido");

  assert.equal(resposta.status, 401);
});

// TESTE 4 - Rejeita tokens expirados.
test("Token expirado deve retornar HTTP 401", async () => {

  const token = gerarToken("ADMIN", "-1s");

  const resposta = await acessarRota(token);

  assert.equal(resposta.status, 401);
});

// TESTE 5 - Bloqueia perfil OPERATOR na rota ADMIN.
test("OPERATOR deve retornar HTTP 403", async () => {

  const token = gerarToken("OPERATOR");

  const resposta = await acessarRota(token);

  assert.equal(resposta.status, 403);
});

// TESTE 6 - Autoriza o perfil ADMIN.
test("ADMIN deve retornar HTTP 200", async () => {

  const token = gerarToken("ADMIN");

  const resposta = await acessarRota(token);

  assert.equal(resposta.status, 200);
});

// TESTE 7 - Rejeita token sem claims obrigatorias.
test("Token sem origem deve retornar HTTP 401", async () => {

  const token = jwt.sign(
    {
      sub: "unidade1-grupo5",
      role: "ADMIN"
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "24h"
    }
  );

  const resposta = await acessarRota(token);

  assert.equal(resposta.status, 401);
});

// TESTE 8 - Rejeita origem desconhecida.
test("Origem invalida deve retornar HTTP 401", async () => {

  const token = gerarToken("ADMIN", "24h", {
    sub: "grupo-desconhecido",
    origem: "grupo-desconhecido"
  });

  const resposta = await acessarRota(token);

  assert.equal(resposta.status, 401);
});

// TESTE 9 - Rejeita tokens sem expiracao.
test("Token sem expiracao deve retornar HTTP 401", async () => {

  const token = jwt.sign(
    {
      sub: "unidade1-grupo5",
      role: "ADMIN",
      origem: "unidade1-grupo5"
    },
    JWT_SECRET,
    {
      algorithm: "HS256"
    }
  );

  const resposta = await acessarRota(token);

  assert.equal(resposta.status, 401);
});

// TESTE 10 - Bloqueia perfis desconhecidos.
test("Perfil desconhecido deve retornar HTTP 403", async () => {

  const token = gerarToken("DESCONHECIDO");

  const resposta = await acessarRota(token);

  assert.equal(resposta.status, 403);
});

// TESTE 11 - Rejeita algoritmos diferentes de HS256.
test("Algoritmo HS384 deve retornar HTTP 401", async () => {

  const token = jwt.sign(
    {
      sub: "unidade1-grupo5",
      role: "ADMIN",
      origem: "unidade1-grupo5"
    },
    JWT_SECRET,
    {
      algorithm: "HS384",
      expiresIn: "24h"
    }
  );

  const resposta = await acessarRota(token);

  assert.equal(resposta.status, 401);
});
