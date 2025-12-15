import express from "express";
//import {router as productesRouter} from "./routes/productos.js";
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(express.static("public"));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
