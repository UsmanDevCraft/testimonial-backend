const mongoose = require("mongoose");
const { Schema } = mongoose;

const NewSpaceModel = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usermodel"
    },
    spaceName: {
        type: String,
        require: true
    },
    headerTitle: {
        type: String,
        require: true
    },
    customMessage: {
        type: String,
        require: true
    },
    spaceToken: {
        type: String
    }

});

module.exports = mongoose.model("NewSpaceModel", NewSpaceModel)