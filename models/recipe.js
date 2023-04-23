const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
    {
        titre:String,
        image:String,
        description:String,
        preparation:String,
    })
    
    const Recipe = mongoose.model("recipe",RecipeSchema);
    module.exports = Recipe