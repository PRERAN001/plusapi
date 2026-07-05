const History = require("../models/History");

exports.getHistory = async (req, res) => {
    try {
        const history = await History.find().sort({
            createdAt: -1,
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

exports.deleteHistory = async (req, res) => {
    try {
        await History.findByIdAndDelete(req.params.id);

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

exports.clearHistory = async (req, res) => {
    try {
        await History.deleteMany();

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