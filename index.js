const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Mi servidor está funcionando!");
});

app.get("/api/status", (req, res) => {
  res.json({ online: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor activo");
});