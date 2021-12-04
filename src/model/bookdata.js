const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@seethal.oacel.mongodb.net/NewLibrary?retryWrites=true&w=majority');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    image: String,
    title: String,
    author: String,
    text: String,



});

var BookData = mongoose.model('Book', BookSchema);
module.exports = BookData;