const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
    try {
        // Read the token from req.cookies
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: "Token is missing or invalid." });
        }

        // Verify the token
        const decodedObj = jwt.verify(token, "DEV@Tinder$790");

        const { _id } = decodedObj;

        // Find the user by ID
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Attach user to the request
        req.user = user;
        next();
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token." });
        } else if (e.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token has expired." });
        }
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {
    userAuth
};
