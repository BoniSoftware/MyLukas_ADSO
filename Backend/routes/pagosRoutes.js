const express = require("express");
const router = express.Router();
const Pago = require("../models/Pago");

// REGISTRAR VINCULO
router.post("/", async (req, res) => {
  try {
    const nuevoPago = new Pago(req.body);
    await nuevoPago.save();
    res.status(201).json({message: "Vinculo registrado correctamente"});

  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al registrar vinculo"});
  }
});

// OBTENER VINCULOS
router.get("/", async (req, res) => {
  try {
    const pagos = await Pago.find();
    res.json(pagos);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al obtener vinculos"});
  }
});

// ACTUALIZAR
router.put("/:id", async (req, res) => {
  try {
    await Pago.findByIdAndUpdate(req.params.id,req.body);
    res.json({message: "Vinculo actualizado"});
  } catch (error) {console.log(error);
    res.status(500).json({error: "Error al actualizar"});
  }
});

// ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    await Pago.findByIdAndDelete(req.params.id);
    res.json({message: "Vinculo eliminado"});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Error al eliminar"});
  }
});

module.exports = router;