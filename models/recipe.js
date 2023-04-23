const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
    {
        title:String,
        image:String,
        ingredient:[String],
        description:String,
    })
    
    const Recipe = mongoose.model("recipe",RecipeSchema);
    module.exports = Recipe