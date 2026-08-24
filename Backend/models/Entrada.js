const mongoose = require("mongoose");

const entradaSchema = new mongoose.Schema({
  entrada: { type: String, required: true },
  descripcion: { type: String, required: true },
  valor: { type: Number, required: true },
  fecha: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Entrada", entradaSchema);