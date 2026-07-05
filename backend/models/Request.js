const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      enum: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
        "HEAD",
      ],
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

    auth: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", RequestSchema);