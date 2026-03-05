import jwt from "jsonwebtoken";
const secret_key_space = process.env.JWT_SECRET_SPACE;

const fetchspace = async (req, res, next) => {
  const spaceToken = req.headers["space-token"];
  if (!spaceToken) {
    return res
      .status(404)
      .json({ error: "Space token not found, please try again." });
  }
  try {
    const dataSpace = jwt.verify(spaceToken, secret_key_space);
    // console.log('dataSpace:', dataSpace); // Debug dataSpace
    req.spaceId = dataSpace.id;
    // console.log('req.space:', req.space); // Debug req.space
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default fetchspace;
