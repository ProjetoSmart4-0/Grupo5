
require("dotenv").config();

const assert = require("node:assert/strict");
const { test } = require("node:test");
const jwt = require("jsonwebtoken");

const BASE_URL = "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Configure JWT_SECRET no arquivo .env");
}

function gerarToken(role, expiresIn = "15m") {
  return jwt.sign(
    { role },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn
    }
  );
}

async function acessarRota(token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}/api/v1/test/admin`, {
    headers
  });
}

test("Sem token deve retornar HTTP 401", async () => {
  const resposta = await acessarRota();
  assert.equal(resposta.status, 401);
});

test("Token invalido deve retornar HTTP 401", async () => {
  const resposta = await acessarRota("token-invalido");
  assert.equal(resposta.status, 401);
});

test("Token expirado deve retornar HTTP 401", async () => {
  const token = gerarToken("ADMIN", "-1s");
  const resposta = await acessarRota(token);
  assert.equal(resposta.status, 401);
});

test("OPERATOR deve receber HTTP 403 na rota ADMIN", async () => {
  const token = gerarToken("OPERATOR");
  const resposta = await acessarRota(token);
  assert.equal(resposta.status, 403);
});

test("ADMIN deve receber HTTP 200 na rota ADMIN", async () => {
  const token = gerarToken("ADMIN");
  const resposta = await acessarRota(token);
  assert.equal(resposta.status, 200);
});
