require('dotenv').config();
const mongoose = require("mongoose");

const MongoDb_URL = process.env.MONGODB_URL;
console.log(process.env.MONGODB_URL)

const MongodbConnection = () => {
    mongoose.connect(process.env.MONGODB_URL)
};

module.exports = MongodbConnection;