//========== DEPENDENCIES ==========

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//========== SET UP SCHEMA ==========
const recipeSchema = new Schema({
    //we define out schema fields here
    name: String,
    image: String,
    time: String,
    ingredients: [String],
    directions: String
}, {
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;