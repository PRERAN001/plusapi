const mongoose = require("mongoose");

const VariableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    variables: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Variable", VariableSchema);