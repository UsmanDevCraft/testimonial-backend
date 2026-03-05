import jwt from "jsonwebtoken";
const secret_key = process.env.JWT_SECRET;

const fetchuser = async (req, res, next) => {
  const token = req.headers["auth-token"];
  if (!token) {
    return res
      .status(404)
      .json({ error: "Token not found, please try again." });
  }
  try {
    const data = jwt.verify(token, secret_key);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export default fetchuser;
