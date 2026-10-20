require("dotenv").config();

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "smart40-auth-gateway"
  });
});

app.listen(PORT, () => {
  console.log(`Auth Gateway rodando na porta ${PORT}`);
});
