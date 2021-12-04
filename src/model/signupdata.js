const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@seethal.oacel.mongodb.net/NewLibrary?retryWrites=true&w=majority');
const Schema = mongoose.Schema;

const SignupSchema = new Schema({
    username: String,
    email: String,
    password: Number,



});

var Signupdata = mongoose.model('Signup', SignupSchema);
module.exports = Signupdata;