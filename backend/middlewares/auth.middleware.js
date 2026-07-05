const jwt = require("jsonwebtoken");

async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Missing bearer token",
        });
    }

    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured",
            });
        }

        req.user = jwt.verify(token, secret);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

module.exports = {
    requireAuth,
};