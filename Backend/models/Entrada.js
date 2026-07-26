const mongoose = require("mongoose");

const entradaSchema = new mongoose.Schema({
  entrada: { type: String, required: true },
  descripcion: { type: String, required: true },
  valor: { type: Number, required: true }
});

module.exports = mongoose.model("Entrada", entradaSchema);