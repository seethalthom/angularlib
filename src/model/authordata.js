const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@seethal.oacel.mongodb.net/NewLibrary?retryWrites=true&w=majority');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    image: String,
    author: String,
    title: String,
    text: String,



});

var AuthorData = mongoose.model('Author', AuthorSchema);
module.exports = AuthorData;