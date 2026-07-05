const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    headers: {
      type: Map,
      of: String,
      default: {},
    },

    params: {
      type: Map,
      of: String,
      default: {},
    },

    body: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    response: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    responseHeaders: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    status: Number,

    responseTime: Number,

    responseSize: Number,

    success: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", HistorySchema);