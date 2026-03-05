import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import MongodbConnection from "./db.js";
import userRoutes from "./routes/User.js";
import newSpaceRoutes from "./routes/NewSpace.js";
import reviewRoutes from "./routes/Review.js";

dotenv.config();
MongodbConnection();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", userRoutes);
app.use("/api/newspace", newSpaceRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("", (req, res) => {
  res.send("hi, server is running fine 😋");
});

app.listen(PORT, () => {
  console.log(`Server is running fine on http://localhost:${PORT}`);
});
