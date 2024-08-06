require('dotenv').config();
const express = require("express");
const MongodbConnection = require("./db")
const cors = require("cors")

const app = express();
app.use(cors());
app.use(express.json())
const PORT = process.env.PORT || 5000;
MongodbConnection();

app.use("/api/auth", require("./routes/User"));
app.use("/api/newspace", require("./routes/NewSpace"));
app.use("/api/reviews", require("./routes/Review"));

app.get("", (req, res)=>{
    res.send("hi, server is running fine 😋")
})

app.listen(PORT, ()=>{
    console.log(`Server is running fine on http://localhost:${PORT}`)
})