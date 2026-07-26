const express = require("express");
const router = express.Router();
const Salida = require("../models/Salida");

// REGISTRAR SALIDA
router.post("/", async (req, res) => {
  try {
    const nuevaSalida = new Salida(req.body);
    await nuevaSalida.save();
    res.status(201).json({message: "Salida registrada correctamente"});

  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al registrar salida"});
  }
});

// OBTENER SALIDAS
router.get("/", async (req, res) => {
  try {
    const salidas = await Salida.find();
    res.json(salidas);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al obtener salidas"});
  }
});

// ACTUALIZAR
router.put("/:id", async (req, res) => {
  try {
    await Salida.findByIdAndUpdate(req.params.id,req.body);
    res.json({message: "Salida actualizada"});
  } catch (error) {console.log(error);
    res.status(500).json({error: "Error al actualizar"});
  }
});

// ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    await Salida.findByIdAndDelete(req.params.id);
    res.json({message: "Salida eliminada"});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al eliminar"});
  }
});

module.exports = router;