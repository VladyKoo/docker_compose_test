const mongoose = require("mongoose")
const { Schema } = mongoose

const Record = new Schema({
  value: String,
})

module.exports = mongoose.model("Record", Record)