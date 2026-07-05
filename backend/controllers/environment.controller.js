const Environment = require("../models/Variable");

exports.getEnvironments = async (req, res) => {
    try {
        const environments = await Environment.find().sort({ createdAt: -1 });
        res.json(environments);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

exports.createEnvironment = async (req, res) => {
    try {
        console.log("environment body", req.body)
        const env = await Environment.create(req.body);
        res.status(201).json(env);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

exports.updateEnvironment = async (req, res) => {
    try {
        const env = await Environment.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.json(env);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

};

exports.deleteEnvironment = async (req, res) => {
    try {
        await Environment.findByIdAndDelete(req.params.id);

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