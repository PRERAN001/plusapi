const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect("mongodb://127.0.0.1:27017/ezyapi");

mongoose.connection.once("open", () => {
    console.log("Mongo Connected");

    app.listen(5000, () => {
        console.log("Server Running");
    });
});