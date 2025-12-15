import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// 👉 IMPORTAR RUTAS
import platsRouter from "./routes/platscombinats.js";
import combinatsRouter from "./routes/platscombinats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔧 Handlebars (aunque ahora sirvas HTML estático)
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 🔧 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔧 Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 🔧 RUTA API (IMPORTANTE)
app.use("/api/plats_combinats", platsRouter);



// 🔧 Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// 🔧 Servidor
app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
