const jwt = require("jsonwebtoken");
const secret_key = "usman12345";

const fetchuser = async (req, res, next) => {
    const token = req.headers["auth-token"];
    if(!token){
        return res.status(404).json({error: "Token not found, please try again."})
    }
    try {
        const data = jwt.verify(token, secret_key);
        req.user = data.user;
        next();

    } catch (error) {
        res.status(400).json(error.message)
    }
};

module.exports = fetchuser;