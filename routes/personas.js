import express from "express"
import personesController from "../controllers/personasController.js";

const misrutas = express.Router();
 
// GET todos las personas
misrutas.get("/", personesController.getPersones);
misrutas.post("/", personesController.altaPersona);
misrutas.post("/cerca", personesController.cercaPersones);

export default misrutas;
