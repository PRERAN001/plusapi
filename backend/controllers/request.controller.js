const {
    executeRequestService,
} = require("../services/request.service");

exports.executeRequest = async (req, res) => {

    try {
        console.log(req.body);
        const result = await executeRequestService(req.body);

        res.json(result);

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};