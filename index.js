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
app.use(
  cors({
    origin: [
      "https://testimonials-mern-app.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.set("trust proxy", 1);

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
