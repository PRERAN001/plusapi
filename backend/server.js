const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect("mongodb+srv://preran248:preran123@cluster0.gqh6dfj.mongodb.net/plusapi?appName=Cluster0");

mongoose.connection.once("open", () => {
    console.log("Mongo Connected");

    app.listen(5000, () => {
        console.log("Server Running");
    });
});
