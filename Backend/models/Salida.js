const mongoose = require("mongoose");

const salidaSchema = new mongoose.Schema({
  salida: { type: String, required: true },
  descripcion: { type: String, required: true },
  valor: { type: Number, required: true },
  fecha: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Salida", salidaSchema);