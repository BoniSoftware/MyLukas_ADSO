const express = require("express");
const router = express.Router();
const Entrada = require("../models/Entrada");

// REGISTRAR ENTRADA
router.post("/", async (req, res) => {
  try {
    const nuevaEntrada = new Entrada(req.body);
    await nuevaEntrada.save();
    res.status(201).json({message: "Entrada registrada correctamente"});

  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al registrar entrada"});
  }
});

// OBTENER ENTRADAS
router.get("/", async (req, res) => {
  try {
    const entradas = await Entrada.find();
    res.json(entradas);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al obtener entradas"});
  }
});

// ACTUALIZAR
router.put("/:id", async (req, res) => {
  try {
    await Entrada.findByIdAndUpdate(req.params.id,req.body);
    res.json({message: "Entrada actualizada"});
  } catch (error) {console.log(error);
    res.status(500).json({error: "Error al actualizar"});
  }
});

// ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    await Entrada.findByIdAndDelete(req.params.id);
    res.json({message: "Entrada eliminada"});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al eliminar"});
  }
});

module.exports = router;