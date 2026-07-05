const Collection = require("../models/Collection");

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.find().sort({ createdAt: -1 });
        res.json(collections);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

exports.createCollection = async (req, res) => {
    try {
        const collection = await Collection.create(req.body);
        res.status(201).json(collection);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

exports.updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.json(collection);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

exports.deleteCollection = async (req, res) => {
    try {
        await Collection.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};