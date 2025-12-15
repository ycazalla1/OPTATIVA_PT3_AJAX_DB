import express from "express"
import * as productosController from "../controllers/productosController.js";

export const router = express.Router();


// GET todos los productos
router.get("/", productosController.listarProductos);

// GET producto por id
router.get("/:id", productosController.obtenerProducto);

// POST nuevo producto
router.post("/", productosController.crearProducto);

// PUT actualizar producto
router.put("/:id", productosController.actualizarProducto);

// DELETE borrar producto
router.delete("/:id", productosController.borrarProducto);

//module.exports = router;


