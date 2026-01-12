import express from "express";
//import {router as productesRouter} from "./routes/productos.js";
import path from "path"
import { fileURLToPath } from "url";
import platsCombinatsRouter from "./routes/platscombinats.js";
import begudesRouter from "./routes/begudes.js";
import menuCantinaRouter from "./routes/menuCantina.js";
import usuariRouter from "./routes/usuarisRouter.js";
import magatzemRouter from "./routes/magatzemRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/menu_cantina", menuCantinaRouter);
app.use("/api/plats_combinats", platsCombinatsRouter);
app.use("/api/begudes", begudesRouter);
app.use("/api/magatzem", magatzemRouter);
app.use("/api/usuaris", usuariRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));