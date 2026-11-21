const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
  descripcion: { type: String, required: true, trim: true,},
  vinculo: { type: String, required: true, trim: true, }
},
{
  timestamps: true,
});
  
module.exports = mongoose.model("Pago", pagoSchema);